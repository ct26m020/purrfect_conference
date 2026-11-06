<script setup lang="ts">
const route = useRoute()
const { getSpeaker, sessions } = useConferenceData()
const speaker = getSpeaker(String(route.params.id))

if (!speaker) {
  throw createError({ statusCode: 404, statusMessage: 'Speaker not found' })
}

const speakerSessions = computed(() =>
  sessions.value.filter(session => speaker.sessionIds.includes(session.id))
)
</script>

<template>
  <section class="speaker-page">
    <h1>{{ speaker.name }}</h1>
    <p class="speaker-page__meta">{{ speaker.title }} · {{ speaker.company }}</p>
    <p>{{ speaker.bio }}</p>

    <h2>Sessions</h2>
    <ul class="speaker-page__sessions">
      <li v-for="session in speakerSessions" :key="session.id">
        <NuxtLink :to="`/sessions/${session.id}`">{{ session.title }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.speaker-page__meta {
  color: var(--color-text-secondary);
  font-weight: 600;
}

.speaker-page__sessions {
  display: grid;
  gap: var(--space-2);
  padding-left: var(--space-4);
}
</style>
