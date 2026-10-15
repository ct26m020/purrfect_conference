import type { Ref } from 'vue'
import type { Session } from './useConferenceData'

/**
 * Platzhalter (Schritt 1): Headless-Filterlogik gemäß ADR-02.
 * Die eigentliche Filterung nach Suchbegriff und Track folgt in einem späteren Schritt;
 * vorerst wird die Session-Liste unverändert durchgereicht.
 */
export function useSessionFilter(sessions: Ref<Session[]>) {
  const searchTerm = ref('')
  const selectedTrack = ref<string | null>(null)

  // TODO (Schritt 2): nach searchTerm und selectedTrack filtern
  const filteredSessions = computed(() => sessions.value)

  return { searchTerm, selectedTrack, filteredSessions }
}
