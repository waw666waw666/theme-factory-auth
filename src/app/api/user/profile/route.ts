import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// 获取用户信息
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 更新用户信息
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { name } = await req.json()
    if (!name) {
      return NextResponse.json({ error: '请输入昵称' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', user.id)
      .select('id, name, email, created_at')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: '更新失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 修改密码
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: '请填写所有字段' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码至少需要6位' }, { status: 400 })
    }

    // 验证当前密码
    const { data: userData } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', user.id)
      .single()

    if (!userData || !(await bcrypt.compare(currentPassword, userData.password_hash))) {
      return NextResponse.json({ error: '当前密码错误' }, { status: 401 })
    }

    // 更新密码
    const newHash = await bcrypt.hash(newPassword, 10)
    const { error } = await supabase
      .from('users')
      .update({ password_hash: newHash })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json({ error: '修改失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '密码修改成功' })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
