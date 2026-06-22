'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Crown,
  Download,
  Edit3,
  Gift,
  Grid3X3,
  ImagePlus,
  MessageCircleMore,
  Search,
  Sparkles,
  Star,
  Upload,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  RecommendationIntentType,
  saveRecommendationHandoff,
} from '@/lib/recommendation-handoff';

type DemoItem = {
  id: string;
  title: string;
  caption: string;
  description: string;
  image: string;
  slider?: number;
};

type WorkStage = 'landing' | 'processing' | 'result';

type RecommendationCardItem = {
  id: string;
  title: string;
  description: string;
  badge: string;
  href: string;
  intentType: RecommendationIntentType;
  mediaType: 'image' | 'video';
  previewImage: string;
  eyebrow: string;
  cta: string;
};

type IntentRecoStatus = 'idle' | 'loading' | 'ready' | 'failed';
type RecommendationExperimentGroup = 'control' | 'result_card' | 'download_modal';

const createSvgDataUri = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const portraitArt = '/login-hero-woman.png';

const portraitGlowArt = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#644fd6"/>
      <stop offset="100%" stop-color="#ffb0bc"/>
    </linearGradient>
    <radialGradient id="light" cx="65%" cy="36%" r="45%">
      <stop offset="0%" stop-color="#ffe6b7"/>
      <stop offset="100%" stop-color="#ffbe8b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <rect width="640" height="480" fill="url(#light)"/>
  <path d="M170 435 C210 232 314 85 454 76 C435 127 440 160 507 225 C563 280 567 380 500 433 Z" fill="#5f2355" opacity="0.86"/>
  <path d="M382 120 C437 120 492 160 492 238 C492 318 448 375 386 400 C336 419 273 401 243 359 C222 329 220 287 244 252 C284 195 321 120 382 120 Z" fill="#ffd5c4"/>
  <path d="M398 216 C418 207 437 210 447 228" stroke="#8b3b64" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M414 282 C433 298 444 318 446 338" stroke="#f17991" stroke-width="10" stroke-linecap="round" fill="none"/>
</svg>
`);

const bottleArt = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe09f"/>
      <stop offset="100%" stop-color="#ffd2bd"/>
    </linearGradient>
    <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff7d1"/>
      <stop offset="100%" stop-color="#ffc861"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <circle cx="130" cy="330" r="118" fill="#fff3dd" opacity="0.8"/>
  <circle cx="530" cy="145" r="94" fill="#ffe9cd" opacity="0.65"/>
  <ellipse cx="320" cy="394" rx="162" ry="44" fill="#f3a43a" opacity="0.3"/>
  <rect x="238" y="134" width="164" height="214" rx="28" fill="url(#glass)" stroke="#f6b24e" stroke-width="8"/>
  <rect x="280" y="95" width="80" height="64" rx="14" fill="#f3bc57"/>
  <rect x="293" y="75" width="54" height="30" rx="9" fill="#f0a733"/>
  <circle cx="198" cy="273" r="36" fill="#f7d7a6"/>
  <circle cx="447" cy="258" r="31" fill="#ffcf8d"/>
  <circle cx="446" cy="209" r="18" fill="#fff2c3"/>
  <path d="M145 352 C232 304 408 298 506 338" stroke="#f8c27d" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.7"/>
</svg>
`);

const balloonArt = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8bd3ff"/>
      <stop offset="100%" stop-color="#f7d08c"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#sky)"/>
  <ellipse cx="108" cy="130" rx="86" ry="40" fill="#ffffff" opacity="0.4"/>
  <ellipse cx="218" cy="98" rx="72" ry="30" fill="#ffffff" opacity="0.34"/>
  <path d="M0 330 C101 283 177 287 266 337 C349 387 460 388 640 290 L640 480 L0 480 Z" fill="#a86d3b"/>
  <path d="M0 360 C142 297 292 317 409 381 C497 429 558 432 640 388 L640 480 L0 480 Z" fill="#6e4826"/>
  <ellipse cx="282" cy="182" rx="48" ry="58" fill="#f7b94d"/>
  <path d="M250 186 C270 160 292 156 316 186 C306 212 290 232 282 232 C274 232 258 214 250 186 Z" fill="#ef7d2d"/>
  <line x1="266" y1="234" x2="274" y2="264" stroke="#6d4b2f" stroke-width="4"/>
  <line x1="298" y1="234" x2="290" y2="264" stroke="#6d4b2f" stroke-width="4"/>
  <rect x="266" y="264" width="28" height="18" rx="5" fill="#714d33"/>
</svg>
`);

const dogArt = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="sea" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d6c39b"/>
      <stop offset="100%" stop-color="#6ec8f0"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#sea)"/>
  <path d="M0 305 C110 260 232 286 330 308 C439 331 530 329 640 286 L640 480 L0 480 Z" fill="#4ea7dc"/>
  <path d="M0 336 C112 302 220 337 336 348 C451 360 554 348 640 322 L640 480 L0 480 Z" fill="#e6e4d5" opacity="0.82"/>
  <ellipse cx="312" cy="232" rx="106" ry="126" fill="#9b6736"/>
  <ellipse cx="246" cy="178" rx="42" ry="76" fill="#815229" transform="rotate(-28 246 178)"/>
  <ellipse cx="380" cy="178" rx="42" ry="76" fill="#b67943" transform="rotate(24 380 178)"/>
  <ellipse cx="312" cy="238" rx="54" ry="42" fill="#b88353"/>
  <circle cx="280" cy="217" r="9" fill="#24150f"/>
  <circle cx="344" cy="217" r="9" fill="#24150f"/>
  <ellipse cx="312" cy="260" rx="24" ry="17" fill="#24150f"/>
  <path d="M287 283 C300 301 322 301 336 283" stroke="#24150f" stroke-width="8" stroke-linecap="round" fill="none"/>
</svg>
`);

const flowerArt = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5f57d6"/>
      <stop offset="100%" stop-color="#20133d"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <circle cx="295" cy="240" r="56" fill="#f9a81c"/>
  <ellipse cx="246" cy="176" rx="96" ry="62" fill="#8f6af8" transform="rotate(-18 246 176)"/>
  <ellipse cx="383" cy="178" rx="96" ry="62" fill="#6f45d8" transform="rotate(18 383 178)"/>
  <ellipse cx="227" cy="275" rx="102" ry="68" fill="#7a51ea" transform="rotate(12 227 275)"/>
  <ellipse cx="405" cy="282" rx="102" ry="68" fill="#5c36c0" transform="rotate(-12 405 282)"/>
  <ellipse cx="325" cy="332" rx="86" ry="56" fill="#8d6cf5"/>
  <circle cx="170" cy="150" r="13" fill="#ffffff" opacity="0.55"/>
  <circle cx="430" cy="112" r="9" fill="#ffffff" opacity="0.45"/>
  <circle cx="472" cy="334" r="11" fill="#ffffff" opacity="0.3"/>
</svg>
`);

const textArt = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <rect width="640" height="480" fill="#f7f0df"/>
  <g fill="#2a2016" opacity="0.92">
    <rect x="46" y="72" width="225" height="12" rx="4"/>
    <rect x="297" y="72" width="168" height="12" rx="4"/>
    <rect x="497" y="72" width="94" height="12" rx="4"/>
    <rect x="46" y="114" width="182" height="12" rx="4"/>
    <rect x="253" y="114" width="332" height="12" rx="4"/>
    <rect x="46" y="156" width="270" height="12" rx="4"/>
    <rect x="350" y="156" width="194" height="12" rx="4"/>
    <rect x="46" y="198" width="408" height="12" rx="4"/>
    <rect x="46" y="240" width="236" height="12" rx="4"/>
    <rect x="319" y="240" width="232" height="12" rx="4"/>
    <rect x="46" y="282" width="166" height="12" rx="4"/>
    <rect x="236" y="282" width="338" height="12" rx="4"/>
    <rect x="46" y="324" width="391" height="12" rx="4"/>
    <rect x="46" y="366" width="276" height="12" rx="4"/>
    <rect x="347" y="366" width="190" height="12" rx="4"/>
  </g>
  <line x1="320" y1="42" x2="320" y2="438" stroke="#d8c7a8" stroke-width="3"/>
</svg>
`);

const heroSamples: DemoItem[] = [
  {
    id: 'portrait',
    title: '人像照片',
    caption: '人像照片',
    description: '修复肤色、边缘与发丝细节，让人物观感更干净通透。',
    image: portraitArt,
    slider: 50,
  },
  {
    id: 'landscape',
    title: '风景照片',
    caption: '风景照片',
    description: '提升层次与清晰度，弱化雾感与压缩噪点。',
    image: balloonArt,
    slider: 44,
  },
  {
    id: 'product',
    title: '商品图片',
    caption: '商品图片',
    description: '保留高光和材质，让包装、玻璃与边缘更加利落。',
    image: bottleArt,
    slider: 47,
  },
  {
    id: 'art',
    title: '艺术作品',
    caption: '艺术作品',
    description: '恢复图像纹理与颜色细节，适合海报、插画与展陈图。',
    image: flowerArt,
    slider: 54,
  },
];

const caseStudies: DemoItem[] = [
  {
    id: 'portrait-enhance',
    title: '人像增强',
    caption: '处理前',
    description: '使用 PhotoGrid 的 AI 人像增强功能，修复模糊人脸，让合照或者照片中的人物五官清晰可见，真实还原细节。',
    image: portraitArt,
    slider: 49,
  },
  {
    id: 'blur-remove',
    title: '图像模糊消除',
    caption: '处理前',
    description: '借助 PhotoGrid 模糊图像消除，可清晰锐化模糊图像，同时保持自然人像的鲜活质感，增强更柔和的纹理效果。',
    image: portraitGlowArt,
    slider: 56,
  },
  {
    id: 'sharpen',
    title: '图像锐化',
    caption: '处理前',
    description: '让发虚、清晰度不足的照片重新对焦。PhotoGrid 可自然增强照片边缘与细节，让画面更清晰干净，轻松分享不再模糊的照片。',
    image: dogArt,
    slider: 51,
  },
  {
    id: 'upscale',
    title: '照片转高清',
    caption: '处理前',
    description: '操作分辨率图片自动转换为清晰、高质量图像，无需复杂操作，轻松满足打印、分享或长期保存的需求。',
    image: flowerArt,
    slider: 50,
  },
  {
    id: 'restore',
    title: '照片像素放大',
    caption: '处理前',
    description: '修复颗粒感强、像素破碎的照片，让画面更平滑自然。PhotoGrid 可减少生硬像素，还原更舒适、易看的图像效果。',
    image: balloonArt,
    slider: 52,
  },
  {
    id: 'text',
    title: '图片文字变清晰',
    caption: '处理前',
    description: '让图片中模糊、难以辨认的文字重新清晰可读。PhotoGrid 可增强文字边缘，让内容一眼就能看清。',
    image: textArt,
    slider: 58,
  },
];

function inferIntentFromImage({
  sampleId,
  imageUrl,
}: {
  sampleId: string;
  imageUrl: string | null;
}): RecommendationIntentType {
  const source = `${sampleId} ${imageUrl || ''}`.toLowerCase();
  if (
    source.includes('product') ||
    source.includes('商品') ||
    source.includes('bottle') ||
    source.includes('lipstick') ||
    source.includes('cosmetic')
  ) {
    return 'product_ecommerce';
  }
  if (
    source.includes('portrait') ||
    source.includes('selfie') ||
    source.includes('人像') ||
    source.includes('自拍') ||
    source.includes('woman') ||
    source.includes('login-hero-woman')
  ) {
    return 'portrait_selfie';
  }
  return 'generic_fallback';
}

function buildRecommendationCards(intentType: RecommendationIntentType): RecommendationCardItem[] {
  if (intentType === 'product_ecommerce') {
    return [
      {
        id: 'ugc-video',
        title: '去 UGC Video',
        description: '这张商品图更适合继续做商品讲解或展示视频。',
        badge: '商品视频',
        href: '/ugc-video-generator?source=image-enhancer-reco&intent=product_ecommerce',
        intentType,
        mediaType: 'video',
        previewImage: bottleArt,
        eyebrow: 'Product to Video',
        cta: '去生成商品视频',
      },
      {
        id: 'ai-video-ecommerce',
        title: '试试电商模板',
        description: '直接进入电商渲染分类，快速套用商品视频模板。',
        badge: 'Ecommerce',
        href: '/ai-video?category=ecommerce&source=image-enhancer-reco&intent=product_ecommerce',
        intentType,
        mediaType: 'video',
        previewImage: dogArt,
        eyebrow: 'Ecommerce Template',
        cta: '查看电商模板',
      },
    ];
  }

  if (intentType === 'portrait_selfie') {
    return [
      {
        id: 'ai-filter',
        title: '去 AI Filter',
        description: '这张自拍更适合继续做滤镜风格化和氛围增强。',
        badge: 'AI Filter',
        href: '/editor?app=ai-filter&source=image-enhancer-reco&intent=portrait_selfie',
        intentType,
        mediaType: 'image',
        previewImage: portraitGlowArt,
        eyebrow: 'Portrait Styling',
        cta: '去试试滤镜',
      },
      {
        id: 'ai-video-effect',
        title: '试试视频特效模板',
        description: '把静态自拍快速做成带动效的短视频内容。',
        badge: 'Effect',
        href: '/ai-video?category=featured&source=image-enhancer-reco&intent=portrait_selfie',
        intentType,
        mediaType: 'video',
        previewImage: portraitArt,
        eyebrow: 'Motion Effect',
        cta: '去做动态模板',
      },
    ];
  }

  return [
    {
      id: 'ai-filter-fallback',
      title: '去 AI Filter',
      description: '先试试风格化滤镜，让这张图更有情绪和质感。',
      badge: 'AI Filter',
      href: '/editor?app=ai-filter&source=image-enhancer-reco&intent=generic_fallback',
      intentType,
      mediaType: 'image',
      previewImage: portraitGlowArt,
      eyebrow: 'Visual Polish',
      cta: '去试试滤镜',
    },
    {
      id: 'ai-video-featured',
      title: '去 AI Video',
      description: '也可以继续拿这张图做模板化视频创作。',
      badge: 'Featured',
      href: '/ai-video?category=featured&source=image-enhancer-reco&intent=generic_fallback',
      intentType,
      mediaType: 'video',
      previewImage: balloonArt,
      eyebrow: 'Template Video',
      cta: '查看模板创作',
    },
  ];
}

function parseExperimentGroup(value: string | null): RecommendationExperimentGroup {
  if (value === 'control' || value === 'result_card' || value === 'download_modal') {
    return value;
  }
  return 'result_card';
}

function createHandoffId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `handoff-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function MarketingNavbar({
  workspaceMode = false,
  onBackHome,
}: {
  workspaceMode?: boolean;
  onBackHome?: () => void;
}) {
  const navItems = workspaceMode
    ? [
        { label: 'AI Image', dropdown: true },
        { label: 'AI Video', dropdown: true },
        { label: 'Solutions', dropdown: true },
        { label: 'Resources', dropdown: true },
        { label: 'Pricing', dropdown: false },
      ]
    : [
        { label: '创作', dropdown: true, hot: false },
        { label: '模板', dropdown: true, hot: true },
        { label: 'AI图像', dropdown: true, hot: false },
        { label: 'AI视频', dropdown: true, hot: false },
        { label: '定价', dropdown: false, hot: false },
        { label: '获取应用', dropdown: false, hot: false },
      ];

  return (
    <header className={`${workspaceMode ? 'relative' : 'sticky'} top-0 z-40 bg-white/94 backdrop-blur-xl`}>
      <div className={`${workspaceMode ? 'max-w-none px-6 py-3' : 'mx-auto max-w-7xl px-5 py-4 lg:px-8'} flex items-center justify-between gap-4`}>
        <div className="flex min-w-0 items-center gap-5">
          {workspaceMode && (
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-800 transition hover:bg-slate-200"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="flex shrink-0 items-center gap-2.5">
            <Image src="/logo.svg" alt="PhotoGrid" width={32} height={32} />
            <span className="text-[24px] font-semibold tracking-tight text-slate-900">PhotoGrid</span>
          </div>

          <nav className="hidden items-center gap-8 pl-5 text-[15px] font-medium text-slate-800 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href="#" className="group inline-flex items-center gap-1.5 transition hover:text-slate-950">
                <span>{item.label}</span>
                {item.dropdown && (
                  <ChevronDown className="h-4 w-4 text-slate-500 transition group-hover:text-slate-700" />
                )}
                {'hot' in item && item.hot && (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    Hot
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>

        {workspaceMode ? (
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <Crown className="h-4 w-4 fill-rose-500 text-rose-500" />
              Try For Free
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(34,211,238,0.18)] transition hover:bg-cyan-600"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <img
              src={portraitArt}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              draggable={false}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={onBackHome}
            className="hidden items-center gap-3 text-[17px] font-medium text-slate-900 transition hover:text-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>主页</span>
          </button>
        )}
      </div>
    </header>
  );
}

function CompareSlider({
  image,
  beforeLabel = '处理前',
  afterLabel = '处理后',
  initialPosition = 50,
  className = '',
}: {
  image: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (event: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const next = ((event.clientX - rect.left) / rect.width) * 100;
      setPosition(Math.max(8, Math.min(92, next)));
    };

    const handleUp = () => setIsDragging(false);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-[30px] bg-slate-100 shadow-[0_24px_60px_rgba(125,211,252,0.14)] ${className}`}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover blur-[9px] brightness-[0.88] saturate-[0.8]"
        draggable={false}
      />
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        draggable={false}
      />

      <span className="absolute left-4 top-4 z-10 rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur">
        {beforeLabel}
      </span>
      <span className="absolute right-4 top-4 z-10 rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur">
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 z-20 w-px bg-white/95 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
        style={{ left: `${position}%` }}
      />
      <button
        type="button"
        onPointerDown={() => setIsDragging(true)}
        className="absolute top-1/2 z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_12px_28px_rgba(15,23,42,0.14)]"
        style={{ left: `${position}%` }}
        aria-label="拖动查看前后对比"
      >
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rotate-45 border-b-2 border-l-2 border-slate-400" />
          <span className="h-2 w-2 rotate-45 border-r-2 border-t-2 border-slate-400" />
        </div>
      </button>
    </div>
  );
}

function UploadPanel({
  dragActive,
  batchCount,
  onSingleUpload,
  onBatchUpload,
  onDrop,
  onDragStateChange,
}: {
  dragActive: boolean;
  batchCount: number;
  onSingleUpload: () => void;
  onBatchUpload: () => void;
  onDrop: (files: FileList | null) => void;
  onDragStateChange: (active: boolean) => void;
}) {
  return (
    <div
      className={`flex min-h-[364px] flex-col items-center justify-center rounded-[36px] border bg-white/92 px-8 py-10 text-center shadow-[0_30px_80px_rgba(148,163,184,0.16)] backdrop-blur transition ${
        dragActive
          ? 'scale-[1.01] border-cyan-300 shadow-[0_30px_80px_rgba(34,211,238,0.18)]'
          : 'border-slate-100'
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        onDragStateChange(true);
      }}
      onDragLeave={() => onDragStateChange(false)}
      onDrop={(event) => {
        event.preventDefault();
        onDragStateChange(false);
        onDrop(event.dataTransfer.files);
      }}
    >
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,#f4fbff,#e8faff)] text-cyan-500 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.14)]">
        <Upload className="h-12 w-12" strokeWidth={1.9} />
      </div>
      <h2 className="max-w-[320px] text-[19px] font-semibold tracking-tight text-slate-900">
        点击上传，拖放图片，粘贴图片
      </h2>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {['4K高清', '批量处理', '无水印'].map((item) => (
          <span
            key={item}
            className="rounded-lg bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-600 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.08)]"
          >
            {item}
          </span>
        ))}
        {batchCount > 0 && (
          <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600">
            已导入 {batchCount} 张
          </span>
        )}
      </div>
      <div className="mt-8 flex w-full max-w-[320px] flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onSingleUpload}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300 bg-white px-7 py-3.5 text-sm font-semibold text-cyan-600 transition hover:border-cyan-400 hover:bg-cyan-50"
        >
          <ImagePlus className="h-4 w-4" />
          立即上传
        </button>
        <button
          type="button"
          onClick={onBatchUpload}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(34,211,238,0.24)] transition hover:bg-cyan-600"
        >
          <Upload className="h-4 w-4" />
          批量上传
        </button>
      </div>
    </div>
  );
}

function ProcessingPreview({
  image,
  message,
}: {
  image: string;
  message: string;
}) {
  return (
    <div className="relative aspect-[1/0.88] w-full max-w-full overflow-hidden rounded-[28px] bg-slate-100">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[0.95]"
        draggable={false}
      />
      <div className="absolute inset-y-0 left-1/2 w-[220px] -translate-x-1/2 bg-slate-800/38" />
      <div className="absolute inset-0 bg-slate-900/18" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[15px] font-semibold text-white/92">{message}</span>
      </div>
      <button
        type="button"
        className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/78 text-white shadow-[0_10px_20px_rgba(15,23,42,0.2)]"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
}

function ResultPreview({
  image,
  beforeDimensions,
  afterDimensions,
  backgroundBlurEnabled,
}: {
  image: string;
  beforeDimensions: { width: number; height: number } | null;
  afterDimensions: { width: number; height: number } | null;
  backgroundBlurEnabled: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (event: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const next = ((event.clientX - rect.left) / rect.width) * 100;
      setPosition(Math.max(12, Math.min(88, next)));
    };

    const handleUp = () => setIsDragging(false);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative h-[620px] w-full max-w-full overflow-hidden rounded-lg bg-[#f1f2f4] lg:h-[680px] xl:h-[720px]"
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-contain blur-[1.2px] brightness-[0.98] saturate-[0.92]"
        draggable={false}
      />
      <img
        src={image}
        alt=""
        className={`absolute inset-0 h-full w-full object-contain transition ${backgroundBlurEnabled ? 'scale-[1.02] blur-0' : ''}`}
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
          filter: backgroundBlurEnabled ? 'contrast(1.05) saturate(1.05) brightness(1.02)' : 'contrast(1.04) saturate(1.02)',
        }}
        draggable={false}
      />
      <span className="absolute left-4 top-4 z-10 rounded-md bg-black/36 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
        Before&nbsp; {beforeDimensions ? `${beforeDimensions.width}x${beforeDimensions.height}` : ''}
      </span>
      <span className="absolute right-4 top-4 z-10 rounded-md bg-black/36 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
        After&nbsp; {afterDimensions ? `${afterDimensions.width}x${afterDimensions.height}` : ''}
      </span>
      <div className="absolute inset-y-0 z-20 w-px bg-white" style={{ left: `${position}%` }} />
      <button
        type="button"
        onPointerDown={() => setIsDragging(true)}
        className="absolute top-1/2 z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_12px_24px_rgba(15,23,42,0.15)]"
        style={{ left: `${position}%` }}
      >
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rotate-45 border-b-2 border-l-2 border-slate-400" />
          <span className="h-2 w-2 rotate-45 border-r-2 border-t-2 border-slate-400" />
        </div>
      </button>
      <button
        type="button"
        className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-md bg-black/44 text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)]"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  );
}

function ProcessingSidebar({
  activeStep,
  intentRecoStatus,
}: {
  activeStep: number;
  intentRecoStatus: IntentRecoStatus;
}) {
  const steps = ['消除模糊', '增强画质', '图像超分', '增强细节'];
  const agentMessage =
    intentRecoStatus === 'ready'
      ? '已完成内容识别，正在准备下一步推荐。'
      : intentRecoStatus === 'failed'
        ? '已切换到通用推荐策略，结果完成后展示。'
        : '正在识别图片内容和创作意图。';
  const agentProgress = intentRecoStatus === 'ready' || intentRecoStatus === 'failed' ? 100 : activeStep >= 2 ? 76 : 42;

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h2 className="text-[24px] font-semibold tracking-tight text-slate-950">画质增强中...</h2>
        <div className="relative mt-10 space-y-7">
          <div className="absolute left-[11px] top-3 h-[calc(100%-24px)] w-px bg-slate-200" />
          {steps.map((step, index) => {
            const isActive = index <= activeStep;
            return (
              <div key={step} className="relative flex items-center gap-4">
                <span
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`text-[15px] font-medium ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 shadow-[0_10px_24px_rgba(34,211,238,0.08)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-[0_8px_18px_rgba(34,211,238,0.12)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-slate-950">PG Agent 智能分析已启动</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{agentMessage}</p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${agentProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pb-4">
        <button
          type="button"
          disabled
          className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-300/65 px-5 py-4 text-lg font-semibold text-white/75"
        >
          下载全部
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">请及时下载</p>
      </div>
    </div>
  );
}

function RecommendationCardGrid({
  intentRecoStatus,
  recommendations,
  onRecommendationClick,
  className = '',
}: {
  intentRecoStatus: IntentRecoStatus;
  recommendations: RecommendationCardItem[];
  onRecommendationClick: (item: RecommendationCardItem) => void;
  className?: string;
}) {
  if (intentRecoStatus === 'loading') {
    return (
      <div className={`space-y-2 ${className}`}>
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex h-[92px] animate-pulse gap-3 rounded-xl bg-white/72 p-2">
            <div className="h-full w-[112px] rounded-lg bg-slate-100" />
            <div className="flex flex-1 flex-col justify-center gap-2">
              <div className="h-3 w-24 rounded bg-slate-100" />
              <div className="h-2.5 w-32 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`rounded-xl bg-white/72 p-3 text-xs leading-5 text-slate-500 ${className}`}>
        推荐生成中，稍后会自动展示下一步创作入口。
      </div>
    );
  }

  const displayRecommendations =
    recommendations.length >= 3
      ? recommendations.slice(0, 3)
      : [...recommendations, recommendations[0]].slice(0, 3);

  return (
    <div className={`space-y-2 ${className}`}>
      {displayRecommendations.map((item, index) => (
        <Link
          key={`${item.id}-${index}`}
          href={item.href}
          onClick={() => onRecommendationClick(item)}
          className="group relative flex min-h-[92px] gap-3 rounded-xl bg-white/82 p-2 shadow-[0_10px_22px_rgba(255,174,89,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
        >
          <div className="relative h-[76px] w-[112px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <img
              src={item.previewImage}
              alt={item.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="truncate text-[13px] font-semibold text-slate-900">
              {index === 1 ? 'Video Effects' : 'AI Filter'}
            </p>
            <p className="mt-1 truncate text-[11px] text-slate-500">
              {index === 0 ? 'Try Trending AI Filters' : 'Try Stunning Video Effects'}
            </p>
          </div>
          {index === 0 && (
            <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffb33d,#ff4fa2)] text-white shadow-[0_10px_20px_rgba(255,79,162,0.22)]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
          {index === 1 && (
            <span className="absolute -right-1 -top-2 rounded-full bg-lime-300 px-3 py-1 text-[11px] font-bold text-slate-950 shadow-[0_8px_18px_rgba(132,204,22,0.24)]">
              Hover
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

function RecommendationPanel({
  intentRecoStatus,
  recommendations,
  onRecommendationClick,
}: {
  intentRecoStatus: IntentRecoStatus;
  recommendations: RecommendationCardItem[];
  onRecommendationClick: (item: RecommendationCardItem) => void;
}) {
  return (
    <div className="rounded-[14px] border border-pink-200 bg-[linear-gradient(145deg,#fffbe8,#fff7fb)] p-3 shadow-[0_10px_24px_rgba(255,174,89,0.08)]">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-pink-500" />
          <p className="bg-[linear-gradient(90deg,#ff4fa2,#ff8b3d)] bg-clip-text text-[14px] font-semibold text-transparent">
            PG Agent Suggestions
          </p>
        </div>
      </div>
      <RecommendationCardGrid
        intentRecoStatus={intentRecoStatus}
        recommendations={recommendations}
        onRecommendationClick={onRecommendationClick}
      />
    </div>
  );
}

function DownloadRecommendationModal({
  intentRecoStatus,
  recommendations,
  onClose,
  onRecommendationClick,
}: {
  intentRecoStatus: IntentRecoStatus;
  recommendations: RecommendationCardItem[];
  onClose: () => void;
  onRecommendationClick: (item: RecommendationCardItem) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/24 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/90 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
          aria-label="关闭推荐弹窗"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
            <Sparkles className="h-3.5 w-3.5" />
            PG Agent 推荐
          </div>
          <h3 className="mt-4 text-[24px] font-semibold leading-tight tracking-tight text-slate-950">
            图片已下载，还可以继续创作
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            已根据这张高清图匹配两个后续功能，点击后会自动带入图片。
          </p>
        </div>

        <RecommendationCardGrid
          intentRecoStatus={intentRecoStatus}
          recommendations={recommendations}
          onRecommendationClick={(item) => {
            onRecommendationClick(item);
            onClose();
          }}
          className="mt-5"
        />

        <button
          type="button"
          onClick={onClose}
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          稍后再说
        </button>
      </div>
    </div>
  );
}

function ResultSidebar({
  backgroundBlurEnabled,
  intentRecoStatus,
  recommendations,
  experimentGroup,
  onToggleBackgroundBlur,
  onContinueUpload,
  onEditImage,
  onDownloadAll,
  onRecommendationClick,
}: {
  backgroundBlurEnabled: boolean;
  intentRecoStatus: IntentRecoStatus;
  recommendations: RecommendationCardItem[];
  experimentGroup: RecommendationExperimentGroup;
  onToggleBackgroundBlur: () => void;
  onContinueUpload: () => void;
  onEditImage: () => void;
  onDownloadAll: () => void;
  onRecommendationClick: (item: RecommendationCardItem) => void;
}) {
  const shouldShowResultRecommendations = experimentGroup === 'result_card';

  return (
    <div className="flex h-full flex-col justify-between bg-white">
      <div className="space-y-3">
        <button
          type="button"
          className="flex h-[50px] w-full items-center justify-between rounded-lg bg-slate-50 px-4 text-left transition hover:bg-slate-100"
        >
          <div>
            <p className="text-[14px] font-semibold text-slate-900">Standard</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>

        <div className="rounded-lg bg-slate-50 px-4 py-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <Grid3X3 className="h-5 w-5 text-slate-800" />
              <p className="text-[14px] font-semibold text-slate-900">Background Blur</p>
            </div>
            <button
              type="button"
              onClick={onToggleBackgroundBlur}
              className={`relative h-6 w-10 rounded-full transition ${
                backgroundBlurEnabled ? 'bg-cyan-500' : 'bg-slate-300'
              }`}
              aria-label="切换背景虚化"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  backgroundBlurEnabled ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {shouldShowResultRecommendations && (
          <RecommendationPanel
            intentRecoStatus={intentRecoStatus}
            recommendations={recommendations}
            onRecommendationClick={onRecommendationClick}
          />
        )}

      </div>

      <div className="mt-8 space-y-2">
        <button
          type="button"
          onClick={onEditImage}
          className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-md border border-cyan-500 bg-white px-3 text-[15px] font-semibold text-cyan-600 transition hover:bg-cyan-50"
        >
          <Edit3 className="h-5 w-5" />
          <span>Edit Image</span>
        </button>
        <div className="relative">
          <span className="absolute -top-2 left-0 z-10 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold text-white">
            Free
          </span>
          <button
            type="button"
            onClick={onDownloadAll}
            className="inline-flex h-[50px] w-full items-center justify-center rounded-md bg-cyan-500 px-3 text-[15px] font-semibold text-white shadow-[0_18px_38px_rgba(34,211,238,0.18)] transition hover:bg-cyan-600"
          >
            Download All
          </button>
        </div>
        <button
          type="button"
          onClick={onContinueUpload}
          className="inline-flex h-9 w-full items-center justify-center rounded-md border border-transparent text-[11px] font-semibold text-cyan-500 transition hover:border-cyan-100 hover:bg-cyan-50"
        >
          Continue Uploading · Click, Drag &amp; Drop, or Paste
        </button>
      </div>
    </div>
  );
}

function ResultFeedback() {
  return (
    <div className="fixed bottom-7 right-5 z-30 hidden rounded-[24px] bg-white/94 px-3 py-4 shadow-[0_18px_44px_rgba(15,23,42,0.12)] backdrop-blur xl:flex">
      <div className="flex flex-col items-center gap-5">
        <button type="button" className="flex h-6 w-6 items-center justify-center text-rose-500 transition hover:text-rose-600">
          <Gift className="h-5 w-5 fill-rose-100" />
        </button>
        <button type="button" className="flex h-6 w-6 items-center justify-center text-slate-800 transition hover:text-slate-950">
          <Star className="h-5 w-5" />
        </button>
        <button type="button" className="flex h-6 w-6 items-center justify-center text-slate-800 transition hover:text-slate-950">
          <MessageCircleMore className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function ResultThumbnailStrip({
  activeImage,
  selectedHeroId,
  onSelectSample,
}: {
  activeImage: string;
  selectedHeroId: string;
  onSelectSample: (sample: DemoItem) => void;
}) {
  const thumbnails = [
    { id: 'current', image: activeImage, title: 'Current' },
    ...heroSamples.filter((sample) => sample.id !== selectedHeroId).slice(0, 3),
  ];

  return (
    <div className="mx-auto mt-5 flex w-full items-center justify-center gap-3">
      {thumbnails.map((item, index) => {
        const isActive = index === 0;
        const sample = heroSamples.find((entry) => entry.id === item.id);
        return (
          <button
            key={`${item.id}-${index}`}
            type="button"
            onClick={() => {
              if (sample) onSelectSample(sample);
            }}
            className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition hover:-translate-y-0.5 ${
              isActive ? 'border-cyan-500 p-1 shadow-[0_12px_28px_rgba(34,211,238,0.24)]' : 'border-transparent'
            }`}
          >
            <img src={item.image} alt={item.title} className="h-full w-full rounded-md object-cover" draggable={false} />
          </button>
        );
      })}
    </div>
  );
}

function ExampleCard({ item }: { item: DemoItem }) {
  return (
    <article className="group">
      <CompareSlider image={item.image} initialPosition={item.slider ?? 50} className="aspect-[1.16/0.78] w-full" />
      <div className="px-1 pt-5">
        <h3 className="text-[30px] font-semibold leading-none tracking-tight text-slate-950 sm:text-[24px]">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
        <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 transition group-hover:text-cyan-700">
          了解更多
          <span className="text-base">›</span>
        </a>
      </div>
    </article>
  );
}

function FloatingUtilityRail() {
  const icons = [Gift, Sparkles, Star, MessageCircleMore];

  return (
    <div className="pointer-events-none fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 xl:flex">
      <div className="pointer-events-auto flex flex-col gap-3 rounded-[24px] bg-white/86 p-3 shadow-[0_18px_44px_rgba(15,23,42,0.12)] backdrop-blur">
        {icons.map((Icon, index) => (
          <button
            key={index}
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
              index === 0
                ? 'border-rose-100 bg-rose-50 text-rose-500'
                : 'border-slate-100 bg-white text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ImageEnhancerPage() {
  const router = useRouter();
  const singleInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);
  const currentBlobRef = useRef<string | null>(null);
  const processingTimerRef = useRef<number | null>(null);
  const [selectedHeroId, setSelectedHeroId] = useState(heroSamples[0].id);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [batchCount, setBatchCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [workStage, setWorkStage] = useState<WorkStage>('landing');
  const [processingStep, setProcessingStep] = useState(0);
  const [backgroundBlurEnabled, setBackgroundBlurEnabled] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [previewStage, setPreviewStage] = useState<Exclude<WorkStage, 'landing'> | null>(null);
  const [intentRecoStatus, setIntentRecoStatus] = useState<IntentRecoStatus>('idle');
  const [intentType, setIntentType] = useState<RecommendationIntentType>('generic_fallback');
  const [experimentGroup, setExperimentGroup] = useState<RecommendationExperimentGroup>('result_card');
  const [showDownloadRecommendationModal, setShowDownloadRecommendationModal] = useState(false);
  const [downloadModalDismissed, setDownloadModalDismissed] = useState(false);
  const [recommendationClicked, setRecommendationClicked] = useState(false);

  const selectedHero = useMemo(
    () => heroSamples.find((item) => item.id === selectedHeroId) ?? heroSamples[0],
    [selectedHeroId]
  );

  useEffect(() => {
    return () => {
      if (currentBlobRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobRef.current);
      }
      if (processingTimerRef.current) {
        window.clearTimeout(processingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preview = new URLSearchParams(window.location.search).get('preview');
    const experiment = new URLSearchParams(window.location.search).get('experiment');
    setExperimentGroup(parseExperimentGroup(experiment));
    if (preview === 'processing' || preview === 'result') {
      setPreviewStage(preview);
      setUploadedImage(portraitArt);
      setBatchCount(1);
      setWorkStage(preview);
      setProcessingStep(preview === 'processing' ? 1 : 3);
      setImageDimensions({ width: 297, height: 297 });
      setIntentType('portrait_selfie');
      setIntentRecoStatus('ready');
    }
  }, []);

  useEffect(() => {
    if (!uploadedImage || workStage !== 'processing') return;
    if (previewStage) return;

    setProcessingStep(0);
    const stepTimers = [0, 900, 1800, 2700].map((delay, index) =>
      window.setTimeout(() => setProcessingStep(index), delay)
    );

    processingTimerRef.current = window.setTimeout(() => {
      setWorkStage('result');
      processingTimerRef.current = null;
    }, 3600);

    return () => {
      stepTimers.forEach((timer) => window.clearTimeout(timer));
      if (processingTimerRef.current) {
        window.clearTimeout(processingTimerRef.current);
        processingTimerRef.current = null;
      }
    };
  }, [uploadedImage, workStage, previewStage]);

  useEffect(() => {
    if (!uploadedImage) {
      setImageDimensions(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = uploadedImage;
  }, [uploadedImage]);

  useEffect(() => {
    if (!uploadedImage) {
      setIntentRecoStatus('idle');
      setIntentType('generic_fallback');
      return;
    }

    let cancelled = false;
    const fallbackIntent = inferIntentFromImage({
      sampleId: selectedHeroId,
      imageUrl: uploadedImage,
    });

    const detectIntent = async () => {
      setIntentRecoStatus('loading');
      try {
        const response = await fetch('/api/recommendation/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sample_id: selectedHeroId,
            image_url: uploadedImage,
          }),
        });
        if (!response.ok) throw new Error('intent detect failed');
        const json = (await response.json()) as { intent_type?: RecommendationIntentType };
        if (cancelled) return;
        setIntentType(json.intent_type || fallbackIntent);
        setIntentRecoStatus('ready');
      } catch {
        if (cancelled) return;
        setIntentType(fallbackIntent);
        setIntentRecoStatus('failed');
      }
    };

    void detectIntent();
    return () => {
      cancelled = true;
    };
  }, [uploadedImage, selectedHeroId]);

  const updateUploadedImage = (nextUrl: string | null) => {
    if (currentBlobRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(currentBlobRef.current);
    }
    currentBlobRef.current = nextUrl;
    setUploadedImage(nextUrl);
  };

  const useFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const [first] = Array.from(files);
    updateUploadedImage(URL.createObjectURL(first));
    setBatchCount(files.length);
    setBackgroundBlurEnabled(false);
    setIntentRecoStatus('loading');
    setIntentType('generic_fallback');
    setShowDownloadRecommendationModal(false);
    setDownloadModalDismissed(false);
    setRecommendationClicked(false);
    setWorkStage('processing');
  };

  const activeImage = uploadedImage ?? selectedHero.image;
  const recommendations = useMemo(
    () => buildRecommendationCards(intentType),
    [intentType]
  );

  const afterDimensions = imageDimensions
    ? { width: imageDimensions.width * 8, height: imageDimensions.height * 8 }
    : null;
  const displayStage = previewStage ?? workStage;
  const workspaceImage = uploadedImage ?? selectedHero.image;
  const isWorkspaceMode = displayStage !== 'landing' && Boolean(uploadedImage);
  const displayBeforeDimensions = imageDimensions ?? (previewStage ? { width: 297, height: 297 } : null);
  const displayAfterDimensions = afterDimensions ?? (previewStage ? { width: 2376, height: 2376 } : null);

  const handleBackHome = () => {
    setWorkStage('landing');
    setBackgroundBlurEnabled(false);
    setProcessingStep(0);
    setBatchCount(0);
    setShowDownloadRecommendationModal(false);
    setDownloadModalDismissed(false);
    setRecommendationClicked(false);
    updateUploadedImage(null);
  };

  const handleRecommendationClick = (item: RecommendationCardItem) => {
    if (!workspaceImage) return;
    setRecommendationClicked(true);
    saveRecommendationHandoff({
      imageUrl: workspaceImage,
      intentType: item.intentType,
      sourcePage: 'image-enhancer',
      target: item.id,
      handoffId: createHandoffId(),
      experimentGroup,
      recoSurface: experimentGroup === 'download_modal' ? 'download_modal' : 'result_page',
      title: selectedHero.title,
      category: item.badge,
      createdAt: Date.now(),
    });
  };

  const handleEditImage = () => {
    if (!workspaceImage) return;
    saveRecommendationHandoff({
      imageUrl: workspaceImage,
      intentType,
      sourcePage: 'image-enhancer',
      target: 'editor',
      handoffId: createHandoffId(),
      experimentGroup,
      recoSurface: 'result_action',
      title: 'Enhanced Image',
      category: 'Edit image',
      createdAt: Date.now(),
    });
    router.push('/editor?source=image-enhancer-edit');
  };

  const handleDownloadAll = () => {
    if (typeof document === 'undefined' || !workspaceImage) return;
    const link = document.createElement('a');
    link.href = workspaceImage;
    link.download = 'photogrid-enhanced-image.png';
    document.body.appendChild(link);
    link.click();
    link.remove();

    if (
      experimentGroup === 'download_modal' &&
      !downloadModalDismissed &&
      !recommendationClicked &&
      recommendations.length > 0
    ) {
      setShowDownloadRecommendationModal(true);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_10%_92%,rgba(191,242,255,0.74),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(213,198,255,0.48),transparent_25%),linear-gradient(180deg,#ffffff_0%,#f7feff_62%,#f3fdff_100%)] text-slate-900">
      <MarketingNavbar workspaceMode={isWorkspaceMode} onBackHome={handleBackHome} />
      {!isWorkspaceMode && <FloatingUtilityRail />}

      <input
        ref={singleInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => useFiles(event.target.files)}
      />
      <input
        ref={batchInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => useFiles(event.target.files)}
      />

      {isWorkspaceMode ? (
        <div className="mx-auto w-[calc(100%-48px)] max-w-[1300px] pb-8 pt-8">
          <section className="rounded-[24px] bg-white p-5 shadow-[0_24px_70px_rgba(148,163,184,0.14)]">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_344px]">
              <div className="min-w-0 overflow-hidden">
                {displayStage === 'processing' ? (
                  <ProcessingPreview image={workspaceImage} message="高清增强中，PG Agent 正在分析..." />
                ) : (
                  <ResultPreview
                    image={workspaceImage}
                    beforeDimensions={displayBeforeDimensions}
                    afterDimensions={displayAfterDimensions}
                    backgroundBlurEnabled={backgroundBlurEnabled}
                  />
                )}
              </div>
              <div className="min-h-[620px] min-w-0 lg:min-h-[680px] xl:min-h-[720px]">
                {displayStage === 'processing' ? (
                  <ProcessingSidebar activeStep={processingStep} intentRecoStatus={intentRecoStatus} />
                ) : (
                  <ResultSidebar
                    backgroundBlurEnabled={backgroundBlurEnabled}
                    intentRecoStatus={intentRecoStatus}
                    recommendations={recommendations}
                    experimentGroup={experimentGroup}
                    onToggleBackgroundBlur={() => setBackgroundBlurEnabled((prev) => !prev)}
                    onContinueUpload={() => singleInputRef.current?.click()}
                    onEditImage={handleEditImage}
                    onDownloadAll={handleDownloadAll}
                    onRecommendationClick={handleRecommendationClick}
                  />
                )}
              </div>
            </div>
          </section>
          {displayStage === 'result' && (
            <ResultThumbnailStrip
              activeImage={workspaceImage}
              selectedHeroId={selectedHeroId}
              onSelectSample={(sample) => {
                updateUploadedImage(sample.image);
                setSelectedHeroId(sample.id);
                setBatchCount(1);
                setWorkStage('result');
              }}
            />
          )}
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-7xl px-5 pb-28 pt-6 lg:px-8">
            <div className="text-sm font-medium text-slate-500">
              首页 / <span className="text-slate-700">图片变清晰</span>
            </div>

            <section className="pb-10 pt-10 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {['100%免费', '无水印', '4K', '批量处理'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-600 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.08)]"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="mx-auto mt-7 max-w-5xl text-[44px] font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-[58px] lg:text-[72px]">
                AI一键
                <span className="bg-[linear-gradient(90deg,#26c6da_0%,#5ab6ff_40%,#9f8cff_100%)] bg-clip-text text-transparent">
                  图片变清晰
                </span>
                ，100%免费
              </h1>

              <p className="mx-auto mt-6 max-w-5xl text-[17px] leading-8 text-slate-600">
                使用我们最强大的 AI 图片增强工具，瞬间提升暗淡、模糊和噪点图片至 4K。100% 免费，增强亮度，提高清晰度，优化细节，让图片变清晰。
              </p>
            </section>

            <section className="grid gap-8 md:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] md:items-start">
              <div className="relative">
                <div className="flex gap-4 md:grid md:grid-cols-[84px_minmax(0,1fr)] md:items-stretch">
                  <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:h-full md:grid-rows-4 md:gap-3 md:overflow-visible md:pb-0">
                    {heroSamples.map((sample) => {
                      const active = sample.id === selectedHeroId && !uploadedImage;
                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => {
                            updateUploadedImage(null);
                            setBatchCount(0);
                            setSelectedHeroId(sample.id);
                          }}
                          className={`relative h-[116px] w-[84px] shrink-0 overflow-hidden rounded-2xl border-2 transition md:h-full md:w-full ${
                            active
                              ? 'border-cyan-400 shadow-[0_20px_40px_rgba(34,211,238,0.22)]'
                              : 'border-white/80 shadow-[0_10px_24px_rgba(148,163,184,0.16)]'
                          }`}
                        >
                          <img src={sample.image} alt={sample.title} className="h-full w-full object-cover" />
                          <div className="absolute inset-x-1.5 bottom-1.5 rounded-lg bg-slate-900/62 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                            {sample.caption}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="min-w-0">
                    <CompareSlider
                      image={activeImage}
                      initialPosition={uploadedImage ? 52 : selectedHero.slider ?? 50}
                      className="aspect-[1.36/0.82] w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <UploadPanel
                  dragActive={dragActive}
                  batchCount={batchCount}
                  onSingleUpload={() => singleInputRef.current?.click()}
                  onBatchUpload={() => batchInputRef.current?.click()}
                  onDrop={useFiles}
                  onDragStateChange={setDragActive}
                />

                <div className="mt-8 flex flex-wrap items-center gap-4 px-1 text-sm text-slate-500">
                  <span className="font-medium">没有图片？试试这些</span>
                  <div className="flex items-center gap-3">
                    {heroSamples.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          updateUploadedImage(null);
                          setBatchCount(0);
                          setSelectedHeroId(sample.id);
                        }}
                        className="h-14 w-14 overflow-hidden rounded-2xl border border-white/80 shadow-[0_10px_24px_rgba(148,163,184,0.14)] transition hover:-translate-y-0.5"
                      >
                        <img src={sample.image} alt={sample.title} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-16 grid gap-12 sm:grid-cols-2 xl:grid-cols-3">
              {caseStudies.map((item) => (
                <ExampleCard key={item.id} item={item} />
              ))}
            </section>
          </div>

          <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-24px)] max-w-[420px] -translate-x-1/2 rounded-[24px] border border-white/80 bg-white/86 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur sm:max-w-[470px]">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => singleInputRef.current?.click()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-300 bg-white px-4 py-3 text-sm font-semibold text-cyan-600 transition hover:bg-cyan-50"
              >
                <ImagePlus className="h-4 w-4" />
                立即上传
              </button>
              <button
                type="button"
                onClick={() => batchInputRef.current?.click()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(34,211,238,0.22)] transition hover:bg-cyan-600"
              >
                <Upload className="h-4 w-4" />
                批量上传
              </button>
            </div>
          </div>
        </>
      )}

      {displayStage === 'result' && <ResultFeedback />}

      {showDownloadRecommendationModal && (
        <DownloadRecommendationModal
          intentRecoStatus={intentRecoStatus}
          recommendations={recommendations}
          onClose={() => {
            setDownloadModalDismissed(true);
            setShowDownloadRecommendationModal(false);
          }}
          onRecommendationClick={handleRecommendationClick}
        />
      )}

    </main>
  );
}
