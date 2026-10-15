<script setup lang="ts">
const { sessionCount } = useConferenceData()
</script>

<template>
  <section class="hero">
    <p class="hero__mascot" aria-hidden="true">🐱</p>
    <h1>Purrfect Conference</h1>
    <p class="hero__proof">Aktuell sind <strong>{{ sessionCount }} Sessions</strong> im Programm.</p>
  </section>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: var(--space-section) 0;
}

.hero__mascot {
  font-size: 64px;
  margin-bottom: var(--space-2);
}

.hero__proof {
  margin-bottom: 0;
}
</style>
