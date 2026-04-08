import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 })
    }

    // 查询用户
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, password_hash, created_at')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
    }

    // 验证密码
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
    }

    // 生成token
    const token = generateToken(email)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
