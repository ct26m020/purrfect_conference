// Simuliert eine Zeitplanänderung (siehe ADR Schritt 2, Abschnitt 2).
// Body: { "id": "s01", "minutes": 30 } verschiebt Start- und Endzeit von s01 um 30 Minuten.
export default defineEventHandler(async (event) => {
  const body = await readBody<{ id?: string; minutes?: number }>(event)
  const minutes = typeof body?.minutes === 'number' ? body.minutes : 30
  const session = shiftSession(String(body?.id ?? ''), minutes)

  if (!session) {
    throw createError({ statusCode: 404, statusMessage: 'Session not found' })
  }

  return session
})
