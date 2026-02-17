<template>
  <Teleport to="body">
    <div v-if="show" class="overlay">
      <div class="dialog">
        <p class="message">{{ message }}</p>
        <div class="actions">
          <button class="btn-cancel" @click="$emit('cancel')">
            {{ cancelText }}
          </button>
          <button class="btn-confirm" @click="$emit('confirm')">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 汎用確認ダイアログコンポーネント
 *
 * ユーザーに確認を求めるためのモーダルダイアログ。
 * 背景クリックやESCキーでは閉じず、明示的なボタン選択を強制する。
 */

// Props定義
interface Props {
  show: boolean;           // 表示制御
  message: string;         // 確認メッセージ
  confirmText?: string;    // 確認ボタンテキスト
  cancelText?: string;     // キャンセルボタンテキスト
}

// デフォルト値付きでPropsを受け取る
withDefaults(defineProps<Props>(), {
  confirmText: 'はい',
  cancelText: 'いいえ',
});

// Emits定義
defineEmits<{
  confirm: [];  // 確認ボタン押下時
  cancel: [];   // キャンセルボタン押下時
}>();
</script>

<style scoped>
/* オーバーレイ: 画面全体を覆う半透明の背景 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* ダイアログボックス */
.dialog {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* メッセージテキスト */
.message {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* ボタンエリア */
.actions {
  display: flex;
  gap: 1rem;
}

/* ボタン共通スタイル */
.actions button {
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* キャンセルボタン */
.btn-cancel {
  background: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background: #d0d0d0;
}

/* 確認ボタン */
.btn-confirm {
  background: #2196f3;
  color: white;
}

.btn-confirm:hover {
  background: #1976d2;
}

/* レスポンシブ対応: モバイル */
@media (max-width: 640px) {
  .dialog {
    padding: 1.5rem;
    max-width: 280px;
  }

  .message {
    font-size: 1rem;
  }

  .actions button {
    padding: 0.7rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
