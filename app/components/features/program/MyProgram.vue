<script setup lang="ts">
const { sessions } = useConferenceData()
const { selectedSessionIds, removeSession } = useMyProgram()

const selectedSessions = computed(() =>
  selectedSessionIds.value
    .map(id => sessions.value.find(session => session.id === id))
    .filter((session): session is NonNullable<typeof session> => Boolean(session)),
)
</script>

<template>
  <div class="my-program">
    <BaseCard v-if="selectedSessions.length === 0" class="my-program__empty">
      <p>🐾 Dein Konferenz-Körbchen ist noch leer. Füge ein paar Sessions aus dem Programm hinzu.</p>
    </BaseCard>

    <div v-else class="my-program__list">
      <BaseCard v-for="session in selectedSessions" :key="session.id" class="my-program__item">
        <div class="my-program__content">
          <div>
            <p class="my-program__meta">{{ session.day }} · {{ session.startTime }}–{{ session.endTime }} Uhr</p>
            <h3>{{ session.title }}</h3>
          </div>
          <BaseButton @click="removeSession(session.id)">Entfernen</BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.my-program {
  display: grid;
  gap: var(--space-3);
}

.my-program__empty p,
.my-program__meta {
  margin: 0;
  color: var(--color-text-secondary);
}

.my-program__list {
  display: grid;
  gap: var(--space-3);
}

.my-program__item {
  padding: var(--space-3);
}

.my-program__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}
</style>
