# Aggregation Editor

> 🎯 一个用于验证核心功能的 MVP 项目，专注于快速迭代与功能验证。

---

## 📖 项目简介

Aggregation Editor 是一个基于 Next.js 构建的现代化 Web 应用，采用 TypeScript 进行类型安全开发，Tailwind CSS 实现快速样式构建。

---

## 🔧 技术栈

| 类别 | 技术方案 |
|------|----------|
| **前端框架** | Next.js 14/15 (React 18/19) |
| **开发语言** | TypeScript |
| **样式方案** | Tailwind CSS |
| **图标库** | Lucide React |
| **构建工具** | Next.js 内置 (支持 Turbopack) |
| **代码规范** | ESLint |

---

## 📁 项目结构

```
aggregation-editor/
├── src/                    # 主应用源码
│   ├── app/               # Next.js App Router 页面
│   │   ├── layout.tsx     # 根布局组件
│   │   ├── page.tsx       # 首页
│   │   └── globals.css    # 全局样式
│   ├── components/        # React 组件
│   │   ├── ui/           # 基础 UI 组件
│   │   └── features/     # 功能组件
│   ├── types/            # TypeScript 类型定义
│   ├── data/             # 模拟数据
│   └── utils/            # 工具函数
├── prd/                  # 产品需求文档 (PRD)
├── public/               # 静态资源
├── package.json          # 依赖配置
├── tsconfig.json         # TypeScript 配置
├── tailwind.config.ts    # Tailwind CSS 配置
├── next.config.js        # Next.js 配置
├── eslint.config.mjs     # ESLint 配置
└── README.md            # 项目说明（本文件）
```

### 目录说明

| 目录 | 用途 |
|------|------|
| `src/app/` | Next.js App Router 页面路由，每个文件夹代表一个路由 |
| `src/components/ui/` | 可复用的基础 UI 组件（Button、Input、Modal 等） |
| `src/components/features/` | 业务功能组件 |
| `src/types/` | 全局 TypeScript 类型定义 |
| `src/data/` | 开发阶段的模拟数据 |
| `src/utils/` | 通用工具函数 |
| `prd/` | 产品需求文档，使用 Markdown 格式 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm / npm / yarn

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### AI 视频页 · LinkV AIGC（`/ai-video`）

创建任务走 **`POST /api/video/kling-o1`**，由服务端转发到 **Artface / LinkV** 接口（默认与下列 curl 一致）：

`POST https://artface.linkv.live/api/v1/aigc/task/create`

**不想改 `.env` 时**：在 **`/ai-video` 顶栏「接口设置」** 填写 `callback_url`、`user_id` 等，配置保存在浏览器 **localStorage**（键 `ai-video-aigc-config-v1`），请求体优先于环境变量。轮询地址也可在弹窗里填（含 `{task_id}`），会通过查询参数 `poll_url` 传给 **`GET /api/video/kling-o1`**。

**UI 规范（本页）**：交互状态与间距在 [`src/app/ai-video/page.tsx`](src/app/ai-video/page.tsx) 顶部以 `FV`、`uiInput`、`uiIconBtn`、`uiPrimary` 等常量收口；聚焦环统一为键盘 `focus-visible` + `teal-600`，主按钮为白边聚焦；设置弹窗支持 **`Esc` 关闭**、点击遮罩关闭。

**`.env.local` 必填 / 建议（与页面二选一即可）：**

| 变量 | 说明 |
|------|------|
| **`AIGC_CALLBACK_URL`** | **必填**。任务完成时上游会通知的地址，与 curl 里 `callback_url` 一致，例如 `http://havetea.top:38888/callback`。 |
| **`AIGC_USER_ID`** | **必填**。上游 `user_id`（示例：`12343211`）。 |
| `AIGC_ID_TASK` | 可选。固定 `id_task`；不填则由页面每次生成传唯一 `id_task`，或由服务自动生成。 |
| `AIGC_CREATE_URL` | 可选，默认即为上面 artface 创建地址。 |
| **`AIGC_TASK_QUERY_URL`** | **建议配置**。轮询任务状态，须含占位 **`{task_id}`**，例如 `https://artface.linkv.live/api/v1/aigc/task/xxx?task_id={task_id}`（以你们实际查询文档为准）。未配置时任务创建成功但页面无法自动拉视频，会显示「已提交 + task_id」说明。 |
| `AIGC_APP_ID` / `AIGC_TENANT_ID` | 可选，默认 `arena`。 |
| `AIGC_APP_KIND` | 可选，默认 `imagent`。 |
| `AIGC_MODEL_VERSION_ID` / `KLING_O1_MODEL_VERSION_ID` | 可选，**默认 Kling O1：`kling-video-o1`**（`model_version_id` 与 `parameters.model_name` 同值）。若上游枚举不同，在此改成实际 id（如官方给的 O1 版本号）。 |
| `AIGC_API_KEY` | 若上游需要鉴权，填 Bearer Token。 |
| `AIGC_VIDEO_COMPRESS_SIZE_MB` | 可选，默认 `0`。 |

转发给上游的 JSON 字段与 curl 对齐：`app_id`、`tenant_id`、`user_id`、`app_kind`、`aigc_category`（默认 `text_to_video`）、**`callback_url`**、`input_images`、`model_version_id`、`video_compress_size_mb`、`parameters`（mode / duration / aspect_ratio / model_name / prompt）。图生视频、首尾帧时由前端传 `category` + 图，`input_images` 会相应填充。

若创建接口返回的 `task_id` 字段路径不同，可在 `src/app/api/video/kling-o1/route.ts` 的 `pickTaskId` 中调整。

### 图生图参考图上传 · Crevibe（`batch_upload_images`）

编辑器 **AI 生图** 里点击「添加」参考图时，会经本服务 **`POST /api/upload/crevibe-batch-images`** 转发到：

`https://test-api.crevibe.ai/api/v1/client/fashion/batch_upload_images`（`multipart`，字段名 **`images`**，可多文件）

返回的 **`urls`** 会显示在缩略图上，供后续图生图接口作为 `input_images` / 参考图 URL 使用。

| 变量 | 说明 |
|------|------|
| `CREVIBE_BATCH_UPLOAD_URL` | 可选，默认即上述 test-api 地址 |
| `CREVIBE_API_KEY` | 若上游需要，会加 `Authorization: Bearer …` |

若上游 JSON 结构与当前解析不一致，可在 `src/app/api/upload/crevibe-batch-images/route.ts` 中调整 `extractImageUrls`。

### Google AI 图生图（Artface `google_ai/create`）

编辑器 **AI 生图** 在 **已添加参考图（Crevibe URL）** 且填写 **prompt** 后点生成，会请求 **`POST /api/task/google-ai/create`**，转发到：

`https://artface.linkv.live/api/v1/task/google_ai/create`

请求体与 curl 一致：`app_id`、`app_kind`、`id_task`、`user_id`，以及 `data` 内的 `callback_url`、`prompt`、`task_type`（默认 `gemini`）、`model_name`（默认 `gemini-2.5-flash-image`）、`input_img_urls`、`parameters.aspectRatio`。

| 变量 | 说明 |
|------|------|
| `AIGC_USER_ID` / `AIGC_CALLBACK_URL` | **必填**（与视频任务共用） |
| `GOOGLE_AI_CREATE_URL` | 可选，默认上述 artface 地址 |
| `GOOGLE_AI_APP_ID` | 可选，默认 `test`，也可用 `AIGC_APP_ID` |
| `AIGC_API_KEY` | 若上游要鉴权 |

成片若仅在回调返回，创建接口同步不返图时，列表会显示 task_id 直至你接入轮询或回调落库。

### 构建生产版本

```bash
pnpm build
pnpm start
```

---

## 🌐 部署到网页

### 方式一：Vercel（推荐，零配置）

1. 把代码推到 **GitHub**（如还没有仓库，先 `git init` 并新建仓库再 push）。
2. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录。
3. 点击 **Add New → Project**，选择本项目的仓库。
4. 保持默认（Framework: Next.js，Build Command: `npm run build`），点击 **Deploy**。
5. 部署完成后会得到一个 `https://xxx.vercel.app` 的链接，即可在线访问。

之后每次 push 到 GitHub，Vercel 会自动重新部署。

### 方式二：静态导出（GitHub Pages / Netlify 等）

1. 在 `next.config.js` 里加上静态导出：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // 生成静态 HTML 到 out 目录
};
module.exports = nextConfig;
```

2. 本地构建：

```bash
npm run build
```

3. 会生成 `out/` 目录，把 **整个 `out/` 目录** 作为网站根目录部署到任意静态托管（如 GitHub Pages、Netlify 静态、自己的 Nginx 等）。

- **GitHub Pages**：在仓库 Settings → Pages → Source 选「Deploy from a branch」，分支选 `main`，目录选 `/ (root)` 或把 `out` 内容放到仓库根目录/指定分支的根目录（视你用的 Actions 或分支而定）。
- **Netlify**：拖拽 `out` 文件夹到 Netlify 的「Deploy」区域，或连接仓库后把 **Publish directory** 设为 `out`。

### 方式三：自己的服务器

在有 Node 的服务器上：

```bash
# 安装依赖并构建
npm install
npm run build

# 用 Next 自带的服务器跑（默认 3000 端口）
npm run start
```

如需用 80 端口或 HTTPS，可在前面加 Nginx/Caddy 做反向代理，或使用 `PORT=80 npm run start`（需 root 或 capability）。

---

## 📝 开发规范

### 命名规范

- **文件夹**: 使用小写字母 + 连字符（kebab-case），如 `auth-wizard/`
- **组件文件**: 使用 PascalCase，如 `UserProfile.tsx`
- **工具函数**: 使用 camelCase，如 `formatDate.ts`
- **类型文件**: 使用 PascalCase 或 camelCase，如 `User.ts` 或 `apiTypes.ts`

### 变量命名

使用描述性变量名，带有辅助动词：

```typescript
// ✅ 推荐
const isLoading = true;
const hasError = false;
const canSubmit = true;

// ❌ 避免
const loading = true;
const error = false;
```

### 组件结构

```typescript
// 1. 导入
import { useState } from 'react';

// 2. 类型定义
interface Props {
  title: string;
}

// 3. 组件导出
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. 事件处理
  const handleClick = () => {};

  // 6. 渲染
  return <div>{title}</div>;
}
```

---

## 📄 PRD 文档管理

所有产品需求文档存放在 `prd/` 目录下，使用 Markdown 格式编写。

### 推荐工作流

1. 使用 **Obsidian** 打开项目文件夹编辑 PRD
2. 使用 **Cursor** 进行代码开发
3. PRD 与代码保持同步更新

### PRD 文件命名规范

```
prd/
├── feature-name.md      # 功能需求文档
├── ui-design.md         # UI 设计规范
└── api-design.md        # API 设计文档
```

---

## 🎨 UI 设计规范

> UI 设计文档位置：`prd/ui-design.md`

如需新增或修改 UI 组件：

1. 更新 UI 设计文档
2. 说明变更用途
3. 确保与现有设计保持一致

---

## 📌 MVP 开发原则

本项目遵循 MVP（最小可行产品）开发原则：

- ✅ **只做明确需求**：用户没提的内容不做
- ✅ **最简方案优先**：代码能跑通即可
- ✅ **快速验证**：优先验证核心逻辑
- ❌ **不需要过度设计**：不做提前泛化
- ❌ **不需要全量容错**：MVP 阶段不追求完美

---

## 🔄 版本记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1.0 | 2026-01-16 | 项目初始化 |

---

## 📞 联系方式

如有问题，请联系项目负责人。
