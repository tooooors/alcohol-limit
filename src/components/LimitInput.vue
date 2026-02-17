<template>
  <div class="limit-input">
    <label>今日の上限</label>
    <div class="control-group">
      <!-- 減らすボタン -->
      <button
        class="btn-decrease"
        :disabled="limit === 1"
        @click="decreaseLimit"
        aria-label="目標を減らす"
      >
        -
      </button>

      <!-- 目標本数表示 -->
      <div class="limit-display">
        <span class="number">{{ limit }}</span>
        <span class="unit">本</span>
      </div>

      <!-- 増やすボタン -->
      <button
        class="btn-increase"
        @click="increaseLimit"
        aria-label="目標を増やす"
      >
        +
      </button>
    </div>

    <!-- 確認ダイアログ -->
    <ConfirmDialog
      :show="showConfirmDialog"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 目標本数設定コンポーネント（改修版）
 *
 * +/-ボタンで目標本数を調整し、以下の機能を提供：
 * - 3本以上への増加時：確認ダイアログ
 * - 4本以上への増加時：爆発エフェクト
 * - 2本以下への減少時：ポジティブフィードバック
 * - 目標減少で現在本数を下回る場合：確認ダイアログ
 * - 上限5本の制限
 */

import { ref } from 'vue';
import { useDrinkTracker } from '../composables/useDrinkTracker';
import { useToast } from '../composables/useToast';
import ConfirmDialog from './ConfirmDialog.vue';

// useDrinkTrackerから状態を取得
const { limit, count, setLimit } = useDrinkTracker();
const { showToast } = useToast();

// Emits定義（爆発エフェクトをトリガーするため）
const emit = defineEmits<{
  explosion: [];
}>();

// 内部State
const pendingLimit = ref<number | null>(null); // 確認待ちの目標本数
const showConfirmDialog = ref(false); // 確認ダイアログ表示フラグ
const confirmMessage = ref(''); // 確認メッセージ内容

/**
 * + ボタン押下時の処理
 */
function increaseLimit(): void {
  const newLimit = limit.value + 1;

  // 上限チェック（5本まで）
  if (newLimit > 5) {
    showToast('飲み過ぎです', 'warning');
    return;
  }

  // 3本以上への増加時は確認ダイアログを表示
  if (newLimit >= 3) {
    pendingLimit.value = newLimit;
    confirmMessage.value = '本当に増やしますか？';
    showConfirmDialog.value = true;
  } else {
    // 3本未満の場合は即座に変更
    applyLimitChange(newLimit);
  }
}

/**
 * - ボタン押下時の処理
 */
function decreaseLimit(): void {
  const newLimit = limit.value - 1;

  // 下限チェック（1本まで）
  if (newLimit < 1) return;

  // 現在の飲酒本数が新しい目標を超える場合は確認ダイアログを表示
  if (count.value > newLimit) {
    pendingLimit.value = newLimit;
    confirmMessage.value = `既に${count.value}本飲んでいますが、目標を${newLimit}本に設定しますか？`;
    showConfirmDialog.value = true;
  } else {
    // 通常の減少処理
    applyLimitChange(newLimit);

    // 2本以下への減少時はポジティブフィードバック
    if (newLimit <= 2) {
      showToast('その調子！健康的な選択です！', 'success');
    }
  }
}

/**
 * 確認ダイアログで「はい」を選択した時の処理
 */
function handleConfirm(): void {
  const newLimit = pendingLimit.value!;
  const oldLimit = limit.value;

  // ダイアログを閉じる
  showConfirmDialog.value = false;

  // 目標を変更
  applyLimitChange(newLimit);

  // 増加の場合：4本以上で爆発エフェクト
  if (newLimit > oldLimit && newLimit >= 4) {
    triggerExplosion();
  }

  // 減少で既に超えている場合：穏やかな情報トースト
  if (newLimit < oldLimit && count.value > newLimit) {
    showToast('既に目標を超えています', 'info');
  }

  // 保留中の値をクリア
  pendingLimit.value = null;
}

/**
 * 確認ダイアログで「いいえ」を選択した時の処理
 */
function handleCancel(): void {
  showConfirmDialog.value = false;
  pendingLimit.value = null;
}

/**
 * 目標変更の実行
 */
function applyLimitChange(newLimit: number): void {
  setLimit(newLimit);
}

/**
 * 爆発エフェクトをトリガー（親コンポーネントに通知）
 */
function triggerExplosion(): void {
  emit('explosion');
}
</script>

<style scoped>
.limit-input {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.control-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

/* 増やすボタン */
.btn-increase {
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-increase:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(76, 175, 80, 0.4);
}

.btn-increase:active {
  transform: translateY(0);
}

/* 減らすボタン */
.btn-decrease {
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #e0e0e0, #d0d0d0);
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-decrease:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #d0d0d0, #c0c0c0);
}

.btn-decrease:active:not(:disabled) {
  transform: translateY(0);
}

.btn-decrease:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

/* 目標本数表示 */
.limit-display {
  min-width: 80px;
  padding: 0.5rem 1rem;
  text-align: center;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.limit-display .number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.limit-display .unit {
  font-size: 1rem;
  margin-left: 0.25rem;
  color: #666;
}

/* レスポンシブ対応: モバイル */
@media (max-width: 640px) {
  .control-group {
    gap: 0.8rem;
  }

  .btn-decrease,
  .btn-increase {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }

  .limit-display {
    min-width: 70px;
    font-size: 1.5rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
