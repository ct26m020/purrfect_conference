<script setup lang="ts">
import type { Session } from '~/composables/useConferenceData'

// Sessions kommen zur Laufzeit von der Server-Route, damit die Übersicht nach einer
// Zeitplanänderung dieselben Zeiten zeigt wie die Detailseiten (siehe ADR Schritt 2, Abschnitt 3)
const { data } = await useFetch<Session[]>('/api/sessions')
const sessions = computed(() => data.value ?? [])
const {
  searchTerm,
  selectedTrack,
  trackOptions,
  selectedDay,
  dayOptions,
  selectedLevel,
  levelOptions,
  filteredSessions,
  resetFilters
} = useSessionFilter(sessions)
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
      v-model:selected-day="selectedDay"
      v-model:selected-level="selectedLevel"
      :track-options="trackOptions"
      :day-options="dayOptions"
      :level-options="levelOptions"
      @reset="resetFilters"
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
