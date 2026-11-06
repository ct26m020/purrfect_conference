import type { Ref } from 'vue'
import type { Session } from './useConferenceData'

export function useSessionFilter(sessions: Ref<Session[]>) {
  const { getTrack, speakers } = useConferenceData()
  const searchTerm = ref('')
  const selectedTrack = ref<string | null>(null)
  const selectedDay = ref<string | null>(null)
  const selectedLevel = ref<string | null>(null)

  const trackOptions = computed(() => {
    const seen = new Set<string>()

    return sessions.value.reduce<Array<{ id: string; name: string }>>((items, session) => {
      const track = getTrack(session.trackId)
      if (!track || seen.has(track.id)) {
        return items
      }

      seen.add(track.id)
      items.push({ id: track.id, name: track.name })
      return items
    }, [])
  })

  const dayOptions = computed(() => [...new Set(sessions.value.map(session => session.day))])
  const levelOptions = computed(() => [...new Set(sessions.value.map(session => session.level))])

  function resetFilters() {
    searchTerm.value = ''
    selectedTrack.value = null
    selectedDay.value = null
    selectedLevel.value = null
  }

  const filteredSessions = computed(() => {
    const normalizedSearch = searchTerm.value.trim().toLowerCase()

    return sessions.value.filter(session => {
      const matchesTrack = !selectedTrack.value || session.trackId === selectedTrack.value
      const matchesDay = !selectedDay.value || session.day === selectedDay.value
      const matchesLevel = !selectedLevel.value || session.level === selectedLevel.value
      const matchesSearch =
        normalizedSearch.length === 0 ||
        session.title.toLowerCase().includes(normalizedSearch) ||
        session.abstract.toLowerCase().includes(normalizedSearch) ||
        getTrack(session.trackId)?.name.toLowerCase().includes(normalizedSearch) ||
        session.speakerIds.some(speakerId => {
          const speaker = speakers.value.find(item => item.id === speakerId)
          return speaker?.name.toLowerCase().includes(normalizedSearch)
        })

      return matchesTrack && matchesDay && matchesLevel && matchesSearch
    })
  })

  return {
    searchTerm,
    selectedTrack,
    trackOptions,
    selectedDay,
    dayOptions,
    selectedLevel,
    levelOptions,
    filteredSessions,
    resetFilters
  }
}
