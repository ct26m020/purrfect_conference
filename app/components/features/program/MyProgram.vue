<script setup lang="ts">
const { selectedSessionIds } = useMyProgram()
</script>

<template>
  <BaseCard class="my-program">
    <p v-if="selectedSessionIds.length === 0" class="my-program__empty">
      🐾 Dein Konferenz-Körbchen ist noch leer. Das Merken von Sessions folgt in einem späteren Schritt.
    </p>
  </BaseCard>
</template>

<style scoped>
.my-program__empty {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
