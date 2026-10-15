/**
 * Platzhalter (Schritt 1): Verwaltet die ausgewählten Session-IDs für „Mein Programm“.
 * Die localStorage-Persistenz und Rehydration gemäß Doc 03 folgen in einem späteren Schritt.
 */
export function useMyProgram() {
  const selectedSessionIds = ref<string[]>([])

  function addSession(id: string) {
    if (!selectedSessionIds.value.includes(id)) {
      selectedSessionIds.value.push(id)
    }
    // TODO (Schritt 2): Auswahl in localStorage speichern
  }

  function removeSession(id: string) {
    selectedSessionIds.value = selectedSessionIds.value.filter(existingId => existingId !== id)
    // TODO (Schritt 2): Auswahl in localStorage speichern
  }

  return { selectedSessionIds, addSession, removeSession }
}
