<script setup lang="ts">
const { sessions } = useConferenceData()
const { searchTerm, selectedTrack, trackOptions, filteredSessions } = useSessionFilter(sessions)
const { selectedSessionIds, addSession, removeSession } = useMyProgram()

function toggleSession(sessionId: string) {
  if (selectedSessionIds.value.includes(sessionId)) {
    removeSession(sessionId)
    return
  }

  addSession(sessionId)
}
</script>

<template>
  <section class="program-page">
    <div class="program-page__header">
      <h1>Programm</h1>
      <p>{{ filteredSessions.length }} Sessions</p>
    </div>

    <SessionFilter
      v-model:search-term="searchTerm"
      v-model:selected-track="selectedTrack"
      :track-options="trackOptions"
    />

    <div v-if="filteredSessions.length === 0" class="program-page__empty">
      <BaseCard>
        <p>🐾 Keine Sessions gefunden. Versuche eine andere Suche oder wähle einen anderen Track.</p>
      </BaseCard>
    </div>

    <div v-else class="program-page__list">
      <SessionCard
        v-for="session in filteredSessions"
        :key="session.id"
        :session="session"
        :selected="selectedSessionIds.includes(session.id)"
        @toggle="toggleSession"
      />
    </div>
  </section>
</template>

<style scoped>
.program-page__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-section);
}

.program-page__header p {
  margin: 0;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.program-page__list {
  display: grid;
  gap: var(--space-3);
}

.program-page__empty p {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
