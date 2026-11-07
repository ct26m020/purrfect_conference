export default defineEventHandler((event) => {
  const session = findSession(getRouterParam(event, 'id') ?? '')

  if (!session) {
    throw createError({ statusCode: 404, statusMessage: 'Session not found' })
  }

  return session
})
