import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyCode } from '@/app/api/email-code/route'
import { generateToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, code } = await req.json()

    // 验证输入
    if (!name || !email || !password || !code) {
      return NextResponse.json({ error: '请填写所有字段' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少需要6位' }, { status: 400 })
    }

    // 验证邮箱验证码
    if (!verifyCode(email, code)) {
      return NextResponse.json({ error: '验证码错误或已过期' }, { status: 400 })
    }

    // 检查邮箱是否已注册
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 })
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10)

    // 创建用户
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash: passwordHash }])
      .select('id, name, email, created_at')
      .single()

    if (error || !user) {
      return NextResponse.json({ error: '注册失败' }, { status: 500 })
    }

    // 生成token
    const token = generateToken(email)

    const response = NextResponse.json({
      success: true,
      user,
      token,
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
    })

    return response
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
