import { cookies } from 'next/headers'
import { supabase } from './supabase'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) return null

  try {
    const [email] = Buffer.from(token, 'base64').toString().split(':')
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('email', email)
      .single()

    return user
  } catch {
    return null
  }
}

export function generateToken(email: string) {
  return Buffer.from(`${email}:${Date.now()}`).toString('base64')
}
