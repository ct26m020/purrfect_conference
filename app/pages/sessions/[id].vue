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
    <NuxtLink to="/program" class="session-page__back">← Zurück zum Programm</NuxtLink>

    <BaseCard class="session-page__intro">
      <div class="session-page__badges">
        <span class="session-page__track">{{ trackName }}</span>
        <span class="session-page__tag">{{ session.format }}</span>
        <span class="session-page__tag">{{ session.level }}</span>
      </div>

      <h1>{{ session.title }}</h1>

      <dl class="session-page__facts">
        <div>
          <dt>Tag</dt>
          <dd>{{ session.day }}</dd>
        </div>
        <div>
          <dt>Zeit</dt>
          <dd>{{ session.startTime }}–{{ session.endTime }} Uhr</dd>
        </div>
        <div>
          <dt>Raum</dt>
          <dd>{{ roomName }}</dd>
        </div>
      </dl>

      <p class="session-page__abstract">{{ session.abstract }}</p>
    </BaseCard>

    <section>
      <h2>Speaker</h2>
      <div class="session-page__speakers">
        <BaseCard v-for="speaker in speakers" :key="speaker.id">
          <h3>
            <NuxtLink class="session-page__speaker-link" :to="`/speakers/${speaker.id}`">{{ speaker.name }}</NuxtLink>
          </h3>
          <p class="session-page__speaker-meta">{{ speaker.title }} · {{ speaker.company }}</p>
        </BaseCard>
      </div>
    </section>
  </article>
</template>

<style scoped>
.session-page {
  display: grid;
  gap: var(--space-section);
}

.session-page__back {
  justify-self: start;
  color: var(--color-text-secondary);
  font-size: var(--text-small);
  font-weight: 600;
  text-decoration: none;
}

.session-page__back:hover,
.session-page__back:focus-visible {
  text-decoration: underline;
}

.session-page__intro {
  display: grid;
  gap: var(--space-3);
}

.session-page__intro h1 {
  margin: 0;
}

.session-page__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.session-page__track {
  display: inline-block;
  padding: var(--space-2) var(--space-3);
  border-radius: 999px;
  background-color: var(--color-surface-accent);
  color: var(--color-text-primary);
  font-size: var(--text-small);
  font-weight: 600;
}

.session-page__tag {
  display: inline-block;
  padding: var(--space-2) var(--space-3);
  border-radius: 999px;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}

.session-page__facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-3);
  margin: 0;
  padding: var(--space-3);
  border-radius: 12px;
  background-color: var(--color-background);
}

.session-page__facts dt {
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}

.session-page__facts dd {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 700;
}

.session-page__abstract {
  margin: 0;
}

.session-page__speakers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-3);
}

.session-page__speaker-link {
  color: inherit;
  text-decoration: none;
}

.session-page__speaker-link:hover,
.session-page__speaker-link:focus-visible {
  text-decoration: underline;
}

.session-page__speaker-meta {
  margin: var(--space-1) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}
</style>
