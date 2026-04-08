'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (!res.ok) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>加载中...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Theme Factory</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">欢迎，{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 用户信息卡片 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">用户信息</h2>
            <div className="space-y-2">
              <p><span className="text-gray-600">昵称：</span>{user.name}</p>
              <p><span className="text-gray-600">邮箱：</span>{user.email}</p>
              <p><span className="text-gray-600">注册时间：</span>{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <Link
              href="/profile"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              编辑资料 →
            </Link>
          </div>

          {/* 快捷操作卡片 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
            <div className="space-y-2">
              <Link
                href="/profile"
                className="block py-2 px-4 bg-gray-100 rounded hover:bg-gray-200"
              >
                修改个人资料
              </Link>
              <Link
                href="/profile"
                className="block py-2 px-4 bg-gray-100 rounded hover:bg-gray-200"
              >
                修改密码
              </Link>
            </div>
          </div>

          {/* 状态卡片 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">账户状态</h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>账户正常</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>邮箱已验证</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
