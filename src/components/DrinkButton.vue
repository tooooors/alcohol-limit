<template>
  <button class="drink-button" :disabled="disabled" @click="$emit('click')">
    🍺 飲む！
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.drink-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.3rem;
  background: linear-gradient(135deg, #f5a623, #f7931e);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(245, 166, 35, 0.3);
}

.drink-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 166, 35, 0.4);
}

.drink-button:active:not(:disabled) {
  transform: translateY(0);
}

.drink-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
