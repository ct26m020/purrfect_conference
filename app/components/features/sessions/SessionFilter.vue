<script setup lang="ts">
const props = defineProps<{
  searchTerm: string
  selectedTrack: string | null
  trackOptions: Array<{ id: string; name: string }>
}>()

const emit = defineEmits<{
  'update:searchTerm': [value: string]
  'update:selectedTrack': [value: string | null]
}>()

const onSearchChange = (value: string) => emit('update:searchTerm', value)
const onTrackChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedTrack', target.value || null)
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
