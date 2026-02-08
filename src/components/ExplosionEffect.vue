<template>
  <Teleport to="body">
    <div v-if="isExploding" class="explosion-overlay">
      <div class="explosion">
        <div class="bomb">💣</div>
        <div class="boom">💥</div>
      </div>
      <div class="warning-text">飲み過ぎ注意！！</div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  trigger: number;
}>();

const isExploding = ref(false);

watch(
  () => props.trigger,
  (newVal, oldVal) => {
    if (newVal > oldVal) {
      isExploding.value = true;
      setTimeout(() => {
        isExploding.value = false;
      }, 1500);
    }
  }
);
</script>

<style scoped>
.explosion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: flash 0.3s ease-in-out 3;
}

@keyframes flash {
  0%,
  100% {
    background: rgba(255, 0, 0, 0.8);
  }
  50% {
    background: rgba(255, 100, 0, 0.9);
  }
}

.explosion {
  position: relative;
  font-size: 6rem;
}

.bomb {
  animation: shake 0.1s ease-in-out 5;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.boom {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: explode 0.5s ease-out 0.5s forwards;
}

@keyframes explode {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

.warning-text {
  margin-top: 2rem;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: pulse 0.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}
</style>
