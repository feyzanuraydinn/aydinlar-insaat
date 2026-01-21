import { cookies } from 'next/headers'
import { verifyToken } from './jwt'

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  return payload
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}
