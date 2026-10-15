import conferenceData from '~/data/conference-data.json'

export interface Track {
  id: string
  name: string
}

export interface Room {
  id: string
  name: string
  capacity: number
}

export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  sessionIds: string[]
}

export interface Session {
  id: string
  title: string
  abstract: string
  trackId: string
  speakerIds: string[]
  day: string
  startTime: string
  endTime: string
  roomId: string
  level: string
  format: string
}

/**
 * Stellt den zentralen, statischen Konferenzdatensatz bereit (siehe Doc 03).
 * Die JSON-Datei wird vom Build-Prozess eingebunden; ein HTTP-Aufruf entfällt.
 */
export function useConferenceData() {
  const conference = conferenceData.conference
  const sessions = ref<Session[]>(conferenceData.sessions)
  const tracks = ref<Track[]>(conferenceData.tracks)
  const rooms = ref<Room[]>(conferenceData.rooms)
  const speakers = ref<Speaker[]>(conferenceData.speakers)
  const sessionCount = computed(() => sessions.value.length)

  function getTrack(trackId: string) {
    return tracks.value.find(track => track.id === trackId)
  }

  function getRoom(roomId: string) {
    return rooms.value.find(room => room.id === roomId)
  }

  function getSessionSpeakers(session: Session) {
    return session.speakerIds
      .map(speakerId => speakers.value.find(speaker => speaker.id === speakerId))
      .filter((speaker): speaker is Speaker => speaker !== undefined)
  }

  return {
    conference,
    sessions,
    tracks,
    rooms,
    speakers,
    sessionCount,
    getTrack,
    getRoom,
    getSessionSpeakers,
  }
}
