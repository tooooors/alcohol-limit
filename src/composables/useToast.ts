import { ref } from 'vue';

/**
 * トースト通知の状態を表すインターフェース
 */
export interface ToastState {
  show: boolean; // トーストを表示するかどうか
  message: string; // 表示するメッセージ
  type: 'success' | 'warning' | 'info'; // トーストのタイプ（色分けに使用）
}

/**
 * useToast composableの返り値の型定義
 */
export interface UseToast {
  toastState: typeof toastState; // グローバル状態へのアクセス
  showToast: (
    message: string,
    type: ToastState['type'],
    duration?: number
  ) => void;
  hideToast: () => void;
}

/**
 * 【重要】グローバル状態（シングルトンパターン）
 *
 * このtoastStateは「モジュールスコープ」で定義されているため、
 * アプリ全体で1つだけ存在する共有状態となる。
 *
 * どのコンポーネントからuseToast()を呼び出しても、
 * 全て同じtoastStateを参照する = Piniaのstoreと同じ仕組み
 *
 * 例：
 * - App.vueでuseToast() → 同じtoastStateを参照
 * - LimitInput.vueでuseToast() → 同じtoastStateを参照
 * → どこからshowToast()を呼んでも、App.vueのToastコンポーネントに反映される
 */
const toastState = ref<ToastState>({
  show: false,
  message: '',
  type: 'info',
});

/**
 * 自動非表示用のタイマーID
 * トーストが表示されている間、このタイマーが動いている
 */
let toastTimer: number | null = null;

/**
 * トースト通知を管理するComposable
 *
 * 使い方：
 * ```ts
 * const { toastState, showToast, hideToast } = useToast();
 *
 * // トーストを表示
 * showToast('保存しました', 'success');
 *
 * // トーストを手動で非表示（通常は自動で消える）
 * hideToast();
 * ```
 */
export function useToast(): UseToast {
  /**
   * トーストを表示する関数
   *
   * @param message - 表示するメッセージ
   * @param type - トーストのタイプ（success/warning/info）
   * @param duration - 表示時間（ミリ秒）、デフォルトは2500ms（2.5秒）
   *
   * 動作：
   * 1. 既存のタイマーをクリア（前のトーストを強制終了）
   * 2. toastStateを更新して表示
   * 3. duration後に自動でhideToast()を呼ぶタイマーをセット
   */
  const showToast = (
    message: string,
    type: ToastState['type'],
    duration = 2500
  ) => {
    // 既存のタイマーをクリア
    // 理由：連続でshowToast()が呼ばれた時、前のトーストを即座に消して新しいものを表示する
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    // グローバル状態を更新
    // この瞬間、Toast.vueコンポーネントが反応して表示される
    toastState.value = { show: true, message, type };

    // 自動非表示タイマーをセット
    // duration後にhideToast()が呼ばれる
    toastTimer = window.setTimeout(() => {
      hideToast();
    }, duration);
  };

  /**
   * トーストを非表示にする関数
   *
   * 通常は自動で呼ばれるが、手動で呼ぶことも可能
   * Toast.vueの@closeイベントでも使用される
   */
  const hideToast = () => {
    // show: falseにすると、Toast.vueのv-ifが反応して消える
    toastState.value.show = false;
  };

  // グローバル状態と関数を返す
  // 複数のコンポーネントで呼んでも、同じtoastStateを参照するのがポイント
  return {
    toastState,
    showToast,
    hideToast,
  };
}
