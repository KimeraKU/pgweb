'use client';

import { useState } from 'react';
import { ImageIcon, LayoutGrid, Sparkles, Users, Wand2 } from 'lucide-react';
import { LandingNavbar } from '@/components/landing-navbar';
import { LoginModal } from '@/components/login-modal';

const featureCards = [
  {
    title: 'AI照片编辑器',
    description: '一键抠图、替换背景、智能增强与局部修复。',
    icon: Sparkles,
    tone: 'from-cyan-100 to-sky-50',
  },
  {
    title: 'AI模板',
    description: '封面、社媒、广告物料与活动图快速生成。',
    icon: LayoutGrid,
    tone: 'from-violet-100 to-fuchsia-50',
  },
  {
    title: '批量处理',
    description: '面向内容团队的高频工作流，保持统一输出。',
    icon: Users,
    tone: 'from-amber-100 to-orange-50',
  },
  {
    title: 'AI修图',
    description: '扩图、消除、多图拼接与风格化生成。',
    icon: Wand2,
    tone: 'from-emerald-100 to-lime-50',
  },
  {
    title: '图片生成',
    description: '从一句提示词直接生成海报、插图与商品图。',
    icon: ImageIcon,
    tone: 'from-rose-100 to-pink-50',
  },
];

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fff7f5_0%,#f6fbff_55%,#eef8ff_100%)] text-slate-900">
      <LandingNavbar onLoginClick={() => setShowLoginModal(true)} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(251,113,133,0.08),transparent_30%),radial-gradient(circle_at_right_15%,rgba(56,189,248,0.08),transparent_30%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(300px,0.74fr)] lg:px-8 lg:py-16">
          <div className="max-w-2xl pt-4 lg:pt-8">
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-amber-700 shadow-[0_10px_30px_rgba(148,163,184,0.12)] ring-1 ring-amber-100">
              <span className="text-base"></span>
              <span>Editor&apos;s Choice</span>
            </div>

            <h1 className="max-w-xl text-[42px] font-semibold leading-[1.06] tracking-tight text-slate-950 sm:text-5xl lg:text-[64px]">
              免费 AI
              <br />
              制作工具箱
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              PhotoGrid 集成图像生成、AI 修图、模板设计与批量编辑，适合内容运营、设计团队与独立创作者的日常高频制作。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="rounded-xl bg-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-[0_16px_34px_rgba(34,211,238,0.24)] transition hover:bg-cyan-600"
              >
                立即使用
              </button>
              <a
                href="/creation"
                className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                查看工具
              </a>
            </div>
          </div>

          <div className="grid gap-3 self-end sm:grid-cols-2">
            {featureCards.map(({ title, description, icon: Icon, tone }) => (
              <div
                key={title}
                className="rounded-[18px] bg-white/90 p-4 shadow-[0_16px_40px_rgba(148,163,184,0.14)] ring-1 ring-white/70 backdrop-blur"
              >
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tone}`}
                >
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                <p className="mt-1.5 text-sm leading-5.5 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </main>
  );
}
