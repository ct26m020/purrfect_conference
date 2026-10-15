<script setup lang="ts">
import type { Session } from '~/composables/useConferenceData'

const props = defineProps<{ session: Session; selected?: boolean }>()

const emit = defineEmits<{ toggle: [sessionId: string] }>()

const { getTrack, getRoom, getSessionSpeakers } = useConferenceData()

const trackName = computed(() => getTrack(props.session.trackId)?.name ?? props.session.trackId)
const roomName = computed(() => getRoom(props.session.roomId)?.name ?? props.session.roomId)
const speakerNames = computed(() => getSessionSpeakers(props.session).map(speaker => speaker.name).join(', '))
</script>

<template>
  <BaseCard class="session-card">
    <div class="session-card__badges">
      <span class="session-card__track">{{ trackName }}</span>
      <span class="session-card__tag">{{ session.format }}</span>
      <span class="session-card__tag">{{ session.level }}</span>
    </div>

    <h3>{{ session.title }}</h3>

    <p class="session-card__meta">
      {{ session.day }} · {{ session.startTime }}–{{ session.endTime }} Uhr · {{ roomName }}
    </p>
    <p class="session-card__speakers">{{ speakerNames }}</p>
    <p class="session-card__abstract">{{ session.abstract }}</p>

    <BaseButton class="session-card__button" @click="emit('toggle', session.id)">
      {{ selected ? 'Aus meinem Programm entfernen' : 'Zu meinem Programm hinzufügen' }}
    </BaseButton>
  </BaseCard>
</template>

<style scoped>
.session-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.session-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-1);
}

.session-card__track {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: 999px;
  background-color: var(--color-surface-accent);
  color: var(--color-text-primary);
  font-size: var(--text-small);
  font-weight: 600;
}

.session-card__tag {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: 999px;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}

.session-card__meta {
  margin-bottom: 0;
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}

.session-card__speakers {
  margin-bottom: 0;
  font-weight: 600;
  font-size: var(--text-small);
}

.session-card__abstract {
  margin-bottom: 0;
}

.session-card__button {
  align-self: flex-start;
  margin-top: var(--space-1);
}
</style>
