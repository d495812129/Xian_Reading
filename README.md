# 闲书库 · 电子书分享平台

一个基于 Next.js + Supabase 的电子书分享网站。用户浏览书籍信息，通过网盘链接下载。

## 功能

- 书籍展示：网格布局，封面 + 书名 + 作者
- 分类目录：按分类浏览
- 搜索：按书名/作者搜索
- 书籍详情：封面、作者、简介、分类、网盘下载链接 + 提取码
- 用户系统：邮箱注册登录（Supabase Auth）
- 后台管理：书籍增删改查、封面上传、分类管理
- 权限控制：只有管理员能操作后台（RLS 行级安全）

## 技术栈

- **前端**：Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **后端**：Supabase（PostgreSQL + Auth + Storage）
- **部署**：Vercel（免费）或任意 Node.js 服务器

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 去 [supabase.com](https://supabase.com) 注册免费账号
2. 新建一个项目
3. 在 `Project Settings > API` 获取：
   - `Project URL`
   - `anon public` key
4. 在 `SQL Editor` 执行 `sql/schema.sql`（创建表、RLS 策略、默认分类）
5. 在 `Storage` 创建一个名为 `covers` 的 **public** 存储桶
6. 复制 `.env.example` 为 `.env.local`，填入：

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 注册并设为管理员

1. 在网站注册一个账号
2. 回到 Supabase `SQL Editor` 执行：

```sql
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = '你的注册邮箱');
```

3. 刷新页面，导航栏出现「后台」入口

## 部署到 Vercel（免费）

1. 把代码推到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入仓库
3. 在 Vercel 项目设置中添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署完成，自动获得全球 CDN

## 目录结构

```
ebook-site/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页（书籍网格 + 搜索）
│   ├── globals.css             # 全局样式
│   ├── login/                  # 登录
│   ├── register/               # 注册
│   ├── category/[slug]/        # 分类页
│   ├── book/[id]/              # 书籍详情
│   ├── admin/                  # 后台
│   │   ├── page.tsx            #   书籍列表
│   │   ├── books/new/          #   添加书籍
│   │   ├── books/[id]/edit/    #   编辑书籍
│   │   └── categories/         #   分类管理
│   └── auth/signout/           # 退出登录
├── components/
│   ├── Navbar.tsx              # 导航栏（含分类目录）
│   ├── Footer.tsx
│   ├── BookCard.tsx            # 书籍卡片
│   ├── BookGrid.tsx            # 书籍网格
│   ├── BookForm.tsx            # 书籍表单（新增/编辑共用）
│   ├── CategoryManager.tsx     # 分类管理
│   └── DeleteBookButton.tsx    # 删除按钮（带确认）
├── lib/
│   ├── types.ts                # 类型定义
│   └── supabase/
│       ├── client.ts           # 浏览器端客户端
│       ├── server.ts           # 服务端客户端
│       └── middleware.ts       # session 刷新
├── sql/
│   └── schema.sql              # 数据库 schema
├── middleware.ts               # 路由保护
└── .env.example                # 环境变量模板
```

## 后续可扩展

- 收藏/书架功能
- 评论系统
- 阅读量统计
- 标签系统（比分类更灵活）
- 封面图自动生成（无封面时用书名生成）
- SEO 优化（生成 sitemap、meta 标签）
- 数据备份导出

## 费用

- Vercel：免费层足够个人项目
- Supabase：免费层含 500MB 数据库 + 1GB 存储 + 50000 月活用户
- 域名（可选）：约 50-80 元/年

**基本上零成本跑起来。**
