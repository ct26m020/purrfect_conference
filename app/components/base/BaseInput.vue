<script setup lang="ts">
defineProps<{ label: string; placeholder?: string }>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="base-input">
    <span class="base-input__label">{{ label }}</span>
    <input v-model="model" type="text" :placeholder="placeholder" />
  </label>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.base-input__label {
  font-size: var(--text-small);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.base-input input {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-body);
}
</style>
