# Theme Factory - 主题工厂

Linear 风格的登录系统 + 主题展示平台

## 功能特性

- 🎨 Linear 风格极简登录界面
- 🔐 用户注册与登录
- 📦 MongoDB 数据库
- 🚀 Vercel 部署

## 技术栈

- **前端**: Next.js 16 + React + TypeScript
- **样式**: CSS-in-JS (Styled JSX)
- **数据库**: MongoDB
- **部署**: Vercel (免费)

## 本地开发

### 1. 配置 MongoDB

确保 MongoDB 已运行，默认连接：
```
mongodb://localhost:27017
```

如需修改，在项目根目录创建 `.env.local`：
```
MONGODB_URI=mongodb://localhost:27017
```

### 2. 创建 MongoDB 数据库

1. 打开 MongoDB Compass
2. 连接到 `mongodb://localhost:27017`
3. 创建数据库：`theme_factory`
4. 创建集合：`users`

### 3. 启动项目

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 创建 MongoDB Atlas 免费集群

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 注册账号并登录
3. 创建免费集群 (Shared Cluster)
4. 在 Network Access 中添加 IP: `0.0.0.0/0`
5. 在 Database Access 中创建用户
6. 获取连接字符串，格式：
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net
   ```

### 2. 部署到 Vercel

```bash
npm i -g vercel
vercel login
vercel
```

### 3. 配置环境变量

在 Vercel 项目 Settings → Environment Variables 中添加：

| Name | Value |
|------|-------|
| `MONGODB_URI` | 你的 MongoDB Atlas 连接字符串 |

### 4. 在 Atlas 中创建数据库

1. 登录 Atlas
2. 点击 Browse Collections → Add My Own Data
3. 数据库名：`theme_factory`
4. 集合名：`users`

### 5. 重新部署

```bash
vercel --prod
```

## 页面路由

- `/` - 首页（自动跳转）
- `/login` - 登录页
- `/register` - 注册页
- `/dashboard` - 主题展示（需登录）

## 数据库结构

**集合**: `users`

| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | ObjectId | 主键 |
| `name` | String | 用户昵称 |
| `email` | String | 邮箱（唯一） |
| `passwordHash` | String | 加密密码 |
| `createdAt` | Date | 创建时间 |
