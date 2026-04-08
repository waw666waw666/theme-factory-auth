# Theme Factory - 主题工厂

一个功能完整的主题设计系统，包含用户认证、20款精美主题展示和一键切换功能。

## 在线演示

- **Vercel**: https://theme-factory-auth.vercel.app/
- **Netlify**: https://theme-factory-auth.netlify.app/

## 功能特性

- 🎨 **20款精美主题** - 包含人民币红、玻璃拟态、赛博朋克等2024流行风格
- 🔄 **一键切换主题** - 点击按钮实时改变全站配色
- 📋 **复制提示词** - 一键复制主题CSS配置
- 🔐 **用户认证** - 注册/登录系统，基于 Supabase
- 📱 **响应式设计** - 适配各种设备
- ⚡ **极速加载** - 关键CSS内联，无闪烁

## 技术栈

- **前端**: Next.js 16 + React + TypeScript
- **样式**: Tailwind CSS + CSS Variables
- **数据库**: Supabase (PostgreSQL)
- **认证**: JWT + Supabase Auth
- **部署**: Vercel + Netlify (双平台)

## 主题列表

| 主题名称 | 风格特点 | 适用场景 |
|---------|---------|---------|
| 人民币红 | 喜庆红金配色 | 春节、庆典 |
| 玻璃拟态 | 透明毛玻璃效果 | 2024最热门 |
| 赛博朋克霓虹 | 霓虹灯科幻风格 | 游戏、科技 |
| 新拟态柔光 | 柔和阴影风格 | 现代UI |
| 粘土拟态 | 圆润3D风格 | 儿童产品 |
| ... | 共20款主题 | ... |

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/waw666waw666/theme-factory-auth.git
cd theme-factory-auth
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署

### 部署到 Vercel

1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库
3. 添加环境变量（同上）
4. 点击 Deploy

### 部署到 Netlify

1. 访问 https://app.netlify.com/start
2. 选择 GitHub 仓库
3. 添加环境变量
4. 点击 Deploy

## 页面路由

| 路由 | 说明 | 权限 |
|------|------|------|
| `/` | 首页（自动跳转） | 公开 |
| `/login` | 登录页 | 公开 |
| `/register` | 注册页 | 公开 |
| `/dashboard` | 主题展示 | 需登录 |

## 项目结构

```
theme-factory-auth/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   │   └── auth/       # 认证接口
│   │   ├── components/     # 组件
│   │   │   └── ThemeProvider.tsx
│   │   ├── dashboard/      # 主题展示页
│   │   ├── login/          # 登录页
│   │   ├── register/       # 注册页
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   └── lib/
│       └── supabase.ts     # Supabase 客户端
├── .env.local              # 环境变量（不提交）
├── netlify.toml            # Netlify 配置
├── next.config.js          # Next.js 配置
└── vercel.json             # Vercel 配置
```

## 数据库结构

**表**: `users`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `name` | String | 用户昵称 |
| `email` | String | 邮箱（唯一） |
| `password_hash` | String | 加密密码 |
| `created_at` | Timestamp | 创建时间 |

## 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务密钥 | ✅ |

## 技术亮点

1. **主题系统** - 使用 CSS Variables 实现动态主题切换
2. **状态管理** - React Context + localStorage 持久化
3. **性能优化** - 关键 CSS 内联，防止 FOUC
4. **双平台部署** - Vercel + Netlify，国内国外都能访问

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
