<template>
  <div class="limit-input">
    <label for="limit">今日の上限</label>
    <div class="input-group">
      <input
        id="limit"
        type="number"
        min="1"
        :value="modelValue"
        @change="onChange"
      />
      <span class="unit">本まで</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (!isNaN(value) && value >= 1) {
    emit('update:modelValue', value);
  }
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

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

input {
  width: 80px;
  padding: 0.5rem;
  font-size: 1.5rem;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 8px;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.unit {
  font-size: 1.1rem;
  color: #333;
}
</style>
