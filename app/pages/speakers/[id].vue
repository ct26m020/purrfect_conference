<script setup lang="ts">
const route = useRoute()
const { getSpeaker, getTrack, sessions } = useConferenceData()
const speaker = getSpeaker(String(route.params.id))

if (!speaker) {
  throw createError({ statusCode: 404, statusMessage: 'Speaker not found' })
}

const initials = speaker.name
  .split(' ')
  .map(part => part.charAt(0))
  .slice(0, 2)
  .join('')

// Bewusst ohne Uhrzeiten: Die Seite wird beim Build vorgerendert (SSG),
// Zeiten können sich aber zur Laufzeit ändern (siehe ADR Schritt 2).
const speakerSessions = computed(() =>
  sessions.value.filter(session => speaker.sessionIds.includes(session.id))
)
</script>

<template>
  <section class="speaker-page">
    <NuxtLink to="/program" class="speaker-page__back">← Zurück zum Programm</NuxtLink>

    <BaseCard class="speaker-page__intro">
      <div class="speaker-page__header">
        <span class="speaker-page__avatar" aria-hidden="true">{{ initials }}</span>
        <div>
          <h1>{{ speaker.name }}</h1>
          <p class="speaker-page__meta">{{ speaker.title }} · {{ speaker.company }}</p>
        </div>
      </div>
      <p class="speaker-page__bio">{{ speaker.bio }}</p>
    </BaseCard>

    <section>
      <h2>Sessions</h2>
      <div class="speaker-page__sessions">
        <BaseCard v-for="session in speakerSessions" :key="session.id" class="speaker-page__session">
          <h3>
            <NuxtLink class="speaker-page__session-link" :to="`/sessions/${session.id}`">{{ session.title }}</NuxtLink>
          </h3>
          <div class="speaker-page__badges">
            <span class="speaker-page__track">{{ getTrack(session.trackId)?.name ?? session.trackId }}</span>
            <span class="speaker-page__tag">{{ session.format }}</span>
            <span class="speaker-page__tag">{{ session.level }}</span>
          </div>
        </BaseCard>
      </div>
    </section>
  </section>
</template>

<style scoped>
.speaker-page {
  display: grid;
  gap: var(--space-section);
}

.speaker-page__back {
  justify-self: start;
  color: var(--color-text-secondary);
  font-size: var(--text-small);
  font-weight: 600;
  text-decoration: none;
}

.speaker-page__back:hover,
.speaker-page__back:focus-visible {
  text-decoration: underline;
}

.speaker-page__intro {
  display: grid;
  gap: var(--space-3);
}

.speaker-page__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.speaker-page__avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: var(--color-surface-accent);
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  font-size: var(--text-section-title);
  font-weight: 800;
}

.speaker-page__header h1 {
  margin: 0;
}

.speaker-page__meta {
  margin: var(--space-1) 0 0;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.speaker-page__bio {
  margin: 0;
}

.speaker-page__sessions {
  display: grid;
  gap: var(--space-3);
}

.speaker-page__session {
  display: grid;
  gap: var(--space-2);
}

.speaker-page__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.speaker-page__track {
  display: inline-block;
  padding: var(--space-2) var(--space-3);
  border-radius: 999px;
  background-color: var(--color-surface-accent);
  color: var(--color-text-primary);
  font-size: var(--text-small);
  font-weight: 600;
}

.speaker-page__tag {
  display: inline-block;
  padding: var(--space-2) var(--space-3);
  border-radius: 999px;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}

.speaker-page__session-link {
  color: inherit;
  text-decoration: none;
}

.speaker-page__session-link:hover,
.speaker-page__session-link:focus-visible {
  text-decoration: underline;
}
</style>
