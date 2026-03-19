# UI 设计规范

> 本文档定义了项目的统一 UI 设计规范，所有页面和组件必须遵循此规范。  
> **最后更新**: 2026-02-12

---

## 🎨 设计原则

1. **专业性**：面向数据分析场景，保持简洁专业
2. **一致性**：统一的视觉语言和交互模式
3. **可用性**：直观易用，降低学习成本

---

## 🎭 颜色系统

### 主色调

```css
/* 主色 */
--primary: #2563eb;         /* Blue 600 */
--primary-hover: #1d4ed8;   /* Blue 700 */
--primary-light: #dbeafe;   /* Blue 100 */

/* 辅助色 */
--secondary: #64748b;       /* Slate 500 */
--accent: #8b5cf6;          /* Violet 500 */
```

### 语义色

```css
/* 状态色 */
--success: #22c55e;         /* Green 500 */
--warning: #f59e0b;         /* Amber 500 */
--error: #ef4444;           /* Red 500 */
--info: #3b82f6;            /* Blue 500 */
```

### 中性色

```css
/* 背景与边框 */
--background: #ffffff;
--background-secondary: #f8fafc;
--border: #e2e8f0;
--border-hover: #cbd5e1;

/* 文字 */
--text-primary: #0f172a;
--text-secondary: #475569;
--text-muted: #94a3b8;
```

---

## 📝 字体规范

### 字体家族

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 字号层级

| 名称 | 大小 | 行高 | 用途 |
|------|------|------|------|
| `text-xs` | 12px | 16px | 辅助文字、标签 |
| `text-sm` | 14px | 20px | 正文、表格内容 |
| `text-base` | 16px | 24px | 主要正文 |
| `text-lg` | 18px | 28px | 小标题 |
| `text-xl` | 20px | 28px | 标题 |
| `text-2xl` | 24px | 32px | 页面标题 |

---

## 📐 间距系统

基于 4px 网格系统：

| 名称 | 值 | 用途 |
|------|-----|------|
| `space-1` | 4px | 紧凑元素间距 |
| `space-2` | 8px | 元素内部间距 |
| `space-3` | 12px | 相关元素间距 |
| `space-4` | 16px | 组件间距 |
| `space-6` | 24px | 区块间距 |
| `space-8` | 32px | 大区块间距 |

---

## 🔘 组件规范

### 按钮 (Button)

**尺寸**:
- Small: `h-8 px-3 text-sm`
- Default: `h-10 px-4 text-sm`
- Large: `h-12 px-6 text-base`

**变体**:
- Primary: 蓝底白字，主要操作
- Secondary: 灰底深字，次要操作
- Outline: 透明底，边框按钮
- Ghost: 无边框，悬浮显示背景
- Destructive: 红底白字，危险操作

```tsx
// 示例
<Button variant="primary" size="default">
  提交
</Button>
```

### 输入框 (Input)

```tsx
// 默认样式
<input className="h-10 px-3 border border-border rounded-md 
  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
```

### 卡片 (Card)

```tsx
<div className="bg-white rounded-lg border border-border p-4 shadow-sm">
  {/* 内容 */}
</div>
```

### 表格 (Table)

- 表头: `bg-slate-50 text-sm font-medium text-text-secondary`
- 行: `border-b border-border hover:bg-slate-50`
- 单元格: `py-3 px-4 text-sm`

---

## 🖼️ 图标使用

使用 **Lucide React** 图标库：

```tsx
import { Search, Plus, Settings } from 'lucide-react';

// 图标尺寸
<Search className="w-4 h-4" />  // 小图标
<Search className="w-5 h-5" />  // 默认图标
<Search className="w-6 h-6" />  // 大图标
```

---

## 📱 响应式断点

```css
/* Tailwind 默认断点 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 小屏桌面 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏桌面 */
```

---

## ✨ 动效规范

### 过渡时间

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

### 常用过渡

```tsx
// 按钮悬浮
className="transition-colors duration-150"

// 卡片悬浮
className="transition-shadow duration-200 hover:shadow-md"

// 展开/收起
className="transition-all duration-300"
```

---

## 📋 页面布局模板

### 标准页面布局

```tsx
<div className="min-h-screen bg-background-secondary">
  {/* 顶部导航 */}
  <header className="h-14 bg-white border-b border-border">
    {/* 导航内容 */}
  </header>
  
  {/* 主内容区 */}
  <main className="max-w-7xl mx-auto px-6 py-8">
    {/* 页面标题 */}
    <h1 className="text-2xl font-semibold text-text-primary mb-6">
      页面标题
    </h1>
    
    {/* 内容 */}
  </main>
</div>
```

---

## 更新记录

| 日期 | 更新内容 |
|------|----------|
| 2026-01-16 | 初始版本 |
| 2026-02-12 | PRD 一致性更新，补充最后更新日期 |
