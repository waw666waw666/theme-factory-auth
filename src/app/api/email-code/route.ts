import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/email'

const verificationCodes = new Map<string, { code: string; expires: number }>()

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 })
    }

    const code = generateCode()
    verificationCodes.set(email, {
      code,
      expires: Date.now() + 5 * 60 * 1000, // 5分钟过期
    })

    await sendVerificationEmail(email, code)

    return NextResponse.json({ success: true, message: '验证码已发送' })
  } catch (error) {
    console.error('发送验证码失败:', error)
    return NextResponse.json({ error: '发送失败，请重试' }, { status: 500 })
  }
}

export function verifyCode(email: string, code: string): boolean {
  const record = verificationCodes.get(email)
  if (!record) return false
  if (Date.now() > record.expires) {
    verificationCodes.delete(email)
    return false
  }
  if (record.code !== code) return false

  verificationCodes.delete(email)
  return true
}
