<script setup lang="ts">
import type { Session } from '~/composables/useConferenceData'

const route = useRoute()
const { getSessionSpeakers, getTrack, getRoom } = useConferenceData()

// Die Session kommt zur Laufzeit von der Server-Route, damit Zeitplanänderungen
// ohne neuen Build ankommen (ISR, siehe ADR Schritt 2)
// Track-, Raum- und Speaker-Namen bleiben statisch aus dem JSON-Datensatz
const { data } = await useFetch<Session>(`/api/sessions/${route.params.id}`)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Session not found' })
}

const session = data.value

const speakers = computed(() => getSessionSpeakers(session))
const trackName = computed(() => getTrack(session.trackId)?.name ?? session.trackId)
const roomName = computed(() => getRoom(session.roomId)?.name ?? session.roomId)
</script>

<template>
  <article class="session-page">
    <h1>{{ session.title }}</h1>
    <p class="session-page__meta">
      {{ session.day }} · {{ session.startTime }}–{{ session.endTime }} Uhr · {{ roomName }}
    </p>
    <p>{{ session.abstract }}</p>
    <p><strong>Track:</strong> {{ trackName }}</p>
    <p><strong>Level:</strong> {{ session.level }}</p>
    <p><strong>Format:</strong> {{ session.format }}</p>

    <h2>Speaker</h2>
    <ul class="session-page__speakers">
      <li v-for="speaker in speakers" :key="speaker.id">
        <NuxtLink :to="`/speakers/${speaker.id}`">{{ speaker.name }}</NuxtLink>
      </li>
    </ul>
  </article>
</template>

<style scoped>
.session-page__meta {
  color: var(--color-text-secondary);
}

.session-page__speakers {
  display: grid;
  gap: var(--space-2);
  padding-left: var(--space-4);
}
</style>
