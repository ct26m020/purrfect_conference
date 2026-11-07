import conferenceData from '../../app/data/conference-data.json'

type Session = (typeof conferenceData.sessions)[number]

// Laufzeit-Kopie des Zeitplans. Sie ersetzt im Prototyp ein echtes Backend
// (siehe ADR Schritt 2, Abschnitt 2): Änderungen wirken ohne neuen Build.
// Nach einem Neustart des Servers gilt wieder der Stand aus der JSON-Datei.
const sessions: Session[] = structuredClone(conferenceData.sessions)

export function getSessions() {
  return sessions
}

export function findSession(id: string) {
  return sessions.find(session => session.id === id)
}

function shiftTime(time: string, minutes: number) {
  const [hours = 0, mins = 0] = time.split(':').map(Number)
  const total = (((hours * 60 + mins + minutes) % 1440) + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export function shiftSession(id: string, minutes: number) {
  const session = findSession(id)
  if (!session) {
    return undefined
  }

  session.startTime = shiftTime(session.startTime, minutes)
  session.endTime = shiftTime(session.endTime, minutes)
  return session
}
