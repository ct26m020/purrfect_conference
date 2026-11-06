<script setup lang="ts">
const props = defineProps<{
  searchTerm: string
  selectedTrack: string | null
  trackOptions: Array<{ id: string; name: string }>
  selectedDay: string | null
  dayOptions: string[]
  selectedLevel: string | null
  levelOptions: string[]
}>()

const emit = defineEmits<{
  'update:searchTerm': [value: string]
  'update:selectedTrack': [value: string | null]
  'update:selectedDay': [value: string | null]
  'update:selectedLevel': [value: string | null]
  reset: []
}>()

const onSearchChange = (value: string) => emit('update:searchTerm', value)
const onTrackChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedTrack', target.value || null)
}
const onDayChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedDay', target.value || null)
}
const onLevelChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedLevel', target.value || null)
}
</script>

<template>
  <div class="session-filter">
    <div class="session-filter__field">
      <BaseInput :model-value="searchTerm" label="Sessions durchsuchen" placeholder="z. B. Vue, Design Tokens …" @update:model-value="onSearchChange" />
    </div>

    <div class="session-filter__field session-filter__field--select">
      <label class="session-filter__label" for="session-track-filter">Track</label>
      <select id="session-track-filter" :value="selectedTrack ?? ''" @change="onTrackChange">
        <option value="">Alle Tracks</option>
        <option v-for="track in trackOptions" :key="track.id" :value="track.id">{{ track.name }}</option>
      </select>
    </div>

    <div class="session-filter__field session-filter__field--select">
      <label class="session-filter__label" for="session-day-filter">Tag</label>
      <select id="session-day-filter" :value="selectedDay ?? ''" @change="onDayChange">
        <option value="">Alle Tage</option>
        <option v-for="day in dayOptions" :key="day" :value="day">{{ day }}</option>
      </select>
    </div>

    <div class="session-filter__field session-filter__field--select">
      <label class="session-filter__label" for="session-level-filter">Level</label>
      <select id="session-level-filter" :value="selectedLevel ?? ''" @change="onLevelChange">
        <option value="">Alle Level</option>
        <option v-for="level in levelOptions" :key="level" :value="level">{{ level }}</option>
      </select>
    </div>

    <div class="session-filter__reset">
      <BaseButton @click="emit('reset')">Filter zurücksetzen</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.session-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-section);
}

.session-filter__field {
  flex: 1 1 220px;
}

.session-filter__field--select {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.session-filter__reset {
  display: flex;
  align-items: end;
}

.session-filter__label {
  font-size: var(--text-small);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.session-filter select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-body);
}
</style>
