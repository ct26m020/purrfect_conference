const STORAGE_KEY = 'purrfect-conference-my-program'

function readStoredSessionIds(): string[] {
  if (!import.meta.client) {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}

export function useMyProgram() {
  const selectedSessionIds = ref<string[]>(readStoredSessionIds())

  function persistSessionIds() {
    if (!import.meta.client) {
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSessionIds.value))
  }

  function addSession(id: string) {
    if (!selectedSessionIds.value.includes(id)) {
      selectedSessionIds.value = [...selectedSessionIds.value, id]
      persistSessionIds()
    }
  }

  function removeSession(id: string) {
    selectedSessionIds.value = selectedSessionIds.value.filter(existingId => existingId !== id)
    persistSessionIds()
  }

  watch(
    selectedSessionIds,
    () => {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSessionIds.value))
      }
    },
    { deep: true },
  )

  return { selectedSessionIds, addSession, removeSession }
}
