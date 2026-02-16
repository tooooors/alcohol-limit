<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="show" :class="['toast', `toast-${type}`]">
        <span class="toast-icon">{{ iconMap[type] }}</span>
        <span class="toast-message">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = withDefaults(
  defineProps<{
    show: boolean;
    message: string;
    type: 'success' | 'warning' | 'info';
    duration?: number;
  }>(),
  {
    duration: 2500,
  }
);

const emit = defineEmits<{
  close: [];
}>();

const iconMap = {
  success: '✓',
  warning: '⚠',
  info: 'ℹ',
};

// duration後に自動クローズ
let timer: number | null = null;
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        emit('close');
      }, props.duration);
    }
  }
);
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-size: 1rem;
  font-weight: 500;
  color: white;
  max-width: 90%;
  width: 400px;
  pointer-events: none;
}

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
}

/* Type別カラー */
.toast-success {
  background: #4ade80;
}

.toast-warning {
  background: #fb923c;
}

.toast-info {
  background: #60a5fa;
}

/* トランジション */
.toast-enter-active {
  animation: slideDown 0.3s ease-out;
}

.toast-leave-active {
  animation: fadeOut 0.3s ease-in;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* レスポンシブ */
@media (max-width: 640px) {
  .toast {
    width: 90%;
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
  }
}
</style>
