<template>
  <div class="container">
    <h1>🍺 飲み過ぎ防止</h1>

    <LimitInput :model-value="limit" @update:model-value="setLimit" />

    <DrinkCounter :count="count" :limit="limit" :is-over-limit="isOverLimit" />

    <DrinkButton @click="handleDrink" />

    <button class="reset-button" @click="reset">リセット</button>

    <WarningDialog
      :visible="showWarning"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <ExplosionEffect :trigger="explosionTrigger" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDrinkTracker } from './composables/useDrinkTracker';
import LimitInput from './components/LimitInput.vue';
import DrinkCounter from './components/DrinkCounter.vue';
import DrinkButton from './components/DrinkButton.vue';
import WarningDialog from './components/WarningDialog.vue';
import ExplosionEffect from './components/ExplosionEffect.vue';

const { limit, count, isOverLimit, setLimit, drink, reset } = useDrinkTracker();

const showWarning = ref(false);
const explosionTrigger = ref(0);

function handleDrink() {
  if (isOverLimit.value) {
    showWarning.value = true;
  } else {
    drink();
  }
}

function handleConfirm() {
  showWarning.value = false;
  drink();
  explosionTrigger.value++;
}

function handleCancel() {
  showWarning.value = false;
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.reset-button {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.reset-button:hover {
  background: #d0d0d0;
}
</style>
