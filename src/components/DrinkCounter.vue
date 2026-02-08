<template>
  <div class="drink-counter" :class="{ 'over-limit': isOverLimit }">
    <div class="icon">🍺</div>
    <div class="count">
      <span class="current">{{ count }}</span>
      <span class="separator">/</span>
      <span class="limit">{{ limit }}</span>
      <span class="unit">本</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count: number;
  limit: number;
  isOverLimit: boolean;
}>();
</script>

<style scoped>
.drink-counter {
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.drink-counter.over-limit {
  background: #ffe0e0;
}

.icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.count {
  font-size: 2rem;
  font-weight: bold;
}

.current {
  color: #333;
}

.over-limit .current {
  color: #d32f2f;
}

.separator {
  margin: 0 0.25rem;
  color: #999;
}

.limit {
  color: #666;
}

.unit {
  font-size: 1rem;
  margin-left: 0.25rem;
  color: #666;
}
</style>
