import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Theme Factory
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            用户认证系统演示
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              注册
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-lg font-semibold mb-2">邮箱验证码</h3>
            <p className="text-gray-600">注册时使用邮箱验证码验证身份</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-4">👤</div>
            <h3 className="text-lg font-semibold mb-2">用户管理</h3>
            <p className="text-gray-600">支持注册、登录、个人资料管理</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">安全认证</h3>
            <p className="text-gray-600">密码加密存储，安全的会话管理</p>
          </div>
        </div>
      </div>
    </div>
  )
}
