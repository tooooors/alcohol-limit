<template>
  <Teleport to="body">
    <div v-if="visible" class="overlay" @click.self="$emit('cancel')">
      <div class="dialog">
        <div class="icon">⚠️</div>
        <h2>上限を超えています！</h2>
        <p>本当に飲みますか？</p>
        <div class="actions">
          <button class="btn-cancel" @click="$emit('cancel')">やめとく</button>
          <button class="btn-confirm" @click="$emit('confirm')">飲む！</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
}>();

defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<style scoped>
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

.dialog {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.3rem;
  color: #d32f2f;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.actions button {
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background: #d0d0d0;
}

.btn-confirm {
  background: #d32f2f;
  color: white;
}

.btn-confirm:hover {
  background: #b71c1c;
}
</style>
