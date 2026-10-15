<script setup lang="ts">
// Platzhalter (Schritt 1): stellt die Filteroptionen dar.
// Die Anbindung an useSessionFilter() folgt in einem späteren Schritt (siehe ADR-02).
const searchTerm = ref('')
</script>

<template>
  <div class="session-filter">
    <BaseInput v-model="searchTerm" label="Sessions durchsuchen" placeholder="z. B. Vue, Design Tokens …" />
  </div>
</template>

<style scoped>
.session-filter {
  margin-bottom: var(--space-section);
}
</style>
