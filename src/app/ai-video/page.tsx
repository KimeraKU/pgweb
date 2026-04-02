'use client';

/**
 * AI 视频页 UI：浅色、与编辑器一致
 * - 页面底：bg-slate-50；卡片：白底 + border-slate-200/80 + shadow-sm
 * - 圆角：大区块 rounded-2xl，控件 rounded-lg / rounded-xl
 * - 主色：teal-600 强调，灰阶 slate/gray 正文
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Loader2,
  Search,
  Calendar,
  Plus,
  Pencil,
  RefreshCw,
  MoreVertical,
  ImagePlus,
  Video,
  Heart,
  Move,
  Star,
  Play,
  Pause,
  ArrowUp,
  ChevronDown,
  Copy,
  Download,
  FolderOpen,
  Settings,
  X,
  PanelLeft,
  List,
  Trash2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  loadAivideoAigcConfig,
  saveAivideoAigcConfig,
  mergeAigcFormWithStored,
  AIVIDEO_AIGC_DEFAULTS,
  type AivideoAigcConfig,
} from '@/lib/ai-video-aigc-config';

type TemplateCategory = 'all' | 'featured' | 'ecommerce' | 'drama' | 'camera';

const TEMPLATE_CATEGORIES: { id: TemplateCategory; name: string; icon?: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', name: '全部' },
  { id: 'featured', name: '精选' },
  { id: 'ecommerce', name: '电商渲染', icon: Video },
  { id: 'drama', name: '短剧漫剧', icon: Heart },
  { id: 'camera', name: '镜头控制', icon: Move },
];

const MOCK_TEMPLATES = [
  { id: 't1', name: '镜像万花筒', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=120&fit=crop', category: 'featured' as TemplateCategory },
  { id: 't2', name: '渡鸦华服变装', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=120&fit=crop', category: 'featured' as TemplateCategory },
  { id: 't3', name: '白鸽华服变装', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop', category: 'drama' as TemplateCategory },
  { id: 't4', name: '魂穿姜饼人', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=120&fit=crop', category: 'drama' as TemplateCategory },
  { id: 't5', name: '电商场景渲染', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=200&h=120&fit=crop', category: 'ecommerce' as TemplateCategory },
  { id: 't6', name: '镜头推拉变焦', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=120&fit=crop', category: 'camera' as TemplateCategory },
  { id: 't7', name: '星河梦境', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=120&fit=crop', category: 'featured' as TemplateCategory },
  { id: 't8', name: '古风仙侠转场', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=120&fit=crop', category: 'drama' as TemplateCategory },
  { id: 't9', name: '产品 360 展示', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&h=120&fit=crop', category: 'ecommerce' as TemplateCategory },
  { id: 't10', name: '慢动作特写', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=200&h=120&fit=crop', category: 'camera' as TemplateCategory },
  { id: 't11', name: '赛博霓虹', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=120&fit=crop', category: 'featured' as TemplateCategory },
  { id: 't12', name: '霸道总裁开场', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop', category: 'drama' as TemplateCategory },
  { id: 't13', name: '美妆产品高光', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1596462502278-f27b506603fe?w=200&h=120&fit=crop', category: 'ecommerce' as TemplateCategory },
  { id: 't14', name: '环绕运镜', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=200&h=120&fit=crop', category: 'camera' as TemplateCategory },
  { id: 't15', name: '水墨晕染', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&h=120&fit=crop', category: 'featured' as TemplateCategory },
  { id: 't16', name: '重生逆袭回忆', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=200&h=120&fit=crop', category: 'drama' as TemplateCategory },
  { id: 't17', name: '服饰平铺展示', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1558769132-cb1aeaede002?w=200&h=120&fit=crop', category: 'ecommerce' as TemplateCategory },
  { id: 't18', name: '跟随跟拍', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=200&h=120&fit=crop', category: 'camera' as TemplateCategory },
  { id: 't19', name: '粒子光效', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&h=120&fit=crop', category: 'featured' as TemplateCategory },
  { id: 't20', name: '甜宠对视镜头', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&h=120&fit=crop', category: 'drama' as TemplateCategory },
  { id: 't21', name: '食品特写渲染', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=120&fit=crop', category: 'ecommerce' as TemplateCategory },
  { id: 't22', name: '俯拍升降', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=120&fit=crop', category: 'camera' as TemplateCategory },
  { id: 't23', name: '梦幻气泡', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop', category: 'featured' as TemplateCategory },
  { id: 't24', name: '悬疑暗调转场', tag: 'Vidu Q2', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=120&fit=crop', category: 'drama' as TemplateCategory },
];

function buildTemplatePrompt(name: string, category: TemplateCategory): string {
  if (category === 'ecommerce') {
    return `请基于参考图制作${name}风格的电商展示短视频，突出产品主体与材质细节，镜头节奏清晰，画面干净高级，适合商品详情页。`;
  }
  if (category === 'drama') {
    return `请生成${name}风格的剧情短视频片段，人物情绪明确，镜头有起承转合，光影电影感，适合短剧开场或转场。`;
  }
  if (category === 'camera') {
    return `请生成${name}风格的运镜视频，镜头平滑稳定，主体始终清晰，突出空间层次与景深变化，适合产品或人物展示。`;
  }
  return `请生成${name}风格的视频，画面精致、氛围感强、主体清晰，镜头语言自然，成片可直接用于社媒内容发布。`;
}

interface GeneratedItem {
  id: string;
  thumbnailUrl: string;
  prompt: string;
  modelTag?: string;
  modelVersionId?: string;
  inputMode?: 'reference' | 'first_last_frame';
  duration?: string;
  resolution?: string;
  createdAt: number;
  sourceImageUrl?: string;
  sourceImageUrls?: string[];
  referencePreviewUrl?: string;
  remoteTaskId?: string;
  taskStatus?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'submitted';
  videoUrl?: string;
  errorMessage?: string;
  klingAspectRatio?: string;
  klingDuration?: string;
  klingMode?: string;
}

const KLING_ASPECT = ['16:9', '9:16', '1:1'] as const;
const KLING_DURATION = ['5', '10'] as const;
const KLING_MODE = ['std', 'pro'] as const;
const VIDEO_MODEL_OPTIONS = [{ id: 'kling-video-o1', label: 'Kling O1' }] as const;
const VIDEO_INPUT_MODE_OPTIONS = [
  { id: 'reference', label: '参考图' },
  { id: 'first_last_frame', label: '首尾帧' },
] as const;
type VideoModelVersionId = (typeof VIDEO_MODEL_OPTIONS)[number]['id'];
type VideoInputMode = (typeof VIDEO_INPUT_MODE_OPTIONS)[number]['id'];

function getModelLabel(modelVersionId: string): string {
  const model = VIDEO_MODEL_OPTIONS.find((m) => m.id === modelVersionId);
  return model?.label || modelVersionId;
}

function isItemGenerating(item: GeneratedItem) {
  return item.taskStatus === 'pending' || item.taskStatus === 'processing';
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return '刚刚';
  if (s < 3600) return `${Math.floor(s / 60)} 分钟前`;
  if (s < 86400) return `${Math.floor(s / 3600)} 小时前`;
  if (s < 604800) return `${Math.floor(s / 86400)} 天前`;
  return `${Math.floor(s / 604800)} 周前`;
}

const AI_VIDEO_HISTORY_KEY = 'ai-video-history-v1';
const AI_VIDEO_HISTORY_MAX = 100;

function loadHistoryFromStorage(): GeneratedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AI_VIDEO_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GeneratedItem[];
    return Array.isArray(parsed) ? parsed.slice(-AI_VIDEO_HISTORY_MAX) : [];
  } catch {
    return [];
  }
}

function saveHistoryToStorage(list: GeneratedItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const toSave = list.slice(-AI_VIDEO_HISTORY_MAX);
    localStorage.setItem(AI_VIDEO_HISTORY_KEY, JSON.stringify(toSave));
  } catch {
    /* ignore */
  }
}

/** 统一聚焦环（键盘 focus-visible），与 slate / teal 体系一致 */
const FV =
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600';

/** 输入框、下拉、图标按钮、主/次按钮 — 减少同类控件 class 分叉 */
const uiInput = `w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors ${FV}`;

const uiInputSearch = `h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 transition-colors ${FV}`;

const uiSelect = `h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors ${FV}`;

const uiIconBtn =
  `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-600 transition-colors hover:bg-slate-100 hover:text-teal-700 active:bg-slate-200/80 ${FV} disabled:opacity-50 disabled:pointer-events-none`;

const uiIconBtnOnPanel =
  `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-500 transition-colors hover:bg-white hover:text-slate-900 ${FV}`;

const uiIconOutlineBtn =
  `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 ${FV}`;

const uiToolTileBase =
  `flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border text-[11px] transition-colors sm:h-12 sm:w-12 ${FV}`;

const uiHeaderGhost =
  `inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${FV}`;

const uiPrimary =
  'inline-flex h-10 min-w-[88px] items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 font-semibold text-sm text-white shadow-md shadow-teal-600/20 transition-colors hover:bg-teal-700 disabled:opacity-50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/90';

const uiSecondary =
  `inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 ${FV}`;

const uiSecondaryCompact =
  `inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 ${FV}`;

const uiPillBase =
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all';

const uiPillActive =
  'bg-teal-600 text-white shadow-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80';

const uiPillInactive =
  `text-slate-500 hover:text-slate-800 bg-slate-100/80 hover:bg-slate-100 ${FV}`;

const uiLinkBack =
  `inline-flex items-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-teal-700 sm:text-sm ${FV}`;

const uiTextLink =
  `inline-flex items-center justify-center rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 ${FV}`;

const uiPromptTextarea =
  'w-full bg-transparent px-0 py-1 text-[15px] leading-relaxed text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-0 focus-visible:outline-none';

const uiTextMuted = 'text-xs text-slate-500 leading-relaxed';

const uiAssetActionBtn =
  `inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-transparent text-slate-400 transition-colors hover:bg-slate-100 hover:text-teal-700 ${FV}`;

function sidebarAssetRowClass(isActive: boolean) {
  return isActive
    ? 'flex items-center gap-1.5 rounded-xl border-2 border-teal-600 bg-teal-50/90 px-1.5 py-1 transition-colors'
    : 'flex items-center gap-1.5 rounded-xl border-2 border-transparent bg-slate-50/80 px-1.5 py-1 transition-colors hover:bg-slate-100/80';
}

export default function AIVideoPage() {
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const filteredTemplates =
    templateCategory === 'all'
      ? MOCK_TEMPLATES
      : MOCK_TEMPLATES.filter((t) => t.category === templateCategory);
  const selectedTemplate = useMemo(
    () => MOCK_TEMPLATES.find((t) => t.id === selectedTemplateId) || null,
    [selectedTemplateId]
  );
  const [historySearch, setHistorySearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedModelVersionId, setSelectedModelVersionId] = useState<VideoModelVersionId>(VIDEO_MODEL_OPTIONS[0].id);
  const [selectedInputMode, setSelectedInputMode] = useState<VideoInputMode>('reference');
  const [klingAspectRatio, setKlingAspectRatio] = useState<(typeof KLING_ASPECT)[number]>('16:9');
  const [klingDuration, setKlingDuration] = useState<(typeof KLING_DURATION)[number]>('5');
  const [klingMode, setKlingMode] = useState<(typeof KLING_MODE)[number]>('std');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pollTimersRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  const [generatedList, setGeneratedList] = useState<GeneratedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playerById, setPlayerById] = useState<Record<string, { progress: number; playing: boolean }>>({});
  const taskScrollRef = useRef<HTMLDivElement>(null);
  const scrollFromSidebarRef = useRef(false);
  const [showDailyScrollHint, setShowDailyScrollHint] = useState(false);
  const [inputBarCollapsed, setInputBarCollapsed] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  /** 小屏下左侧模板栏、右侧资产栏展开态（lg 及以上始终展示，不依赖此状态） */
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [aigcForm, setAigcForm] = useState<Partial<AivideoAigcConfig>>({});
  const REFERENCE_IMAGE_MAX = 7;
  const [referenceImages, setReferenceImages] = useState<{ file: File; previewUrl: string }[]>([]);
  /** 编辑任务时带入的参考图 URL（无 File，直接用于请求） */
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const referenceImagesRef = useRef(referenceImages);
  referenceImagesRef.current = referenceImages;

  useEffect(() => {
    if (!settingsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [settingsOpen]);

  useEffect(() => {
    const stored = loadAivideoAigcConfig();
    setAigcForm({ ...AIVIDEO_AIGC_DEFAULTS, ...stored });
  }, []);

  useEffect(() => {
    return () => {
      referenceImagesRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    };
  }, []);

  const persistAigcForm = () => {
    const m = mergeAigcFormWithStored(aigcForm);
    saveAivideoAigcConfig({
      callback_url: m.callback_url?.trim() || '',
      user_id: m.user_id?.trim() || '',
      app_id: m.app_id,
      tenant_id: m.tenant_id,
      model_version_id: m.model_version_id,
      task_query_url: m.task_query_url,
      api_key: m.api_key,
    });
    setSettingsOpen(false);
  };

  /** 生成前：合并弹窗未保存的输入；若已有 callback+user_id 则写入本机，便于轮询读到 */
  const getAigcForApi = () => {
    const m = mergeAigcFormWithStored(aigcForm);
    if (m.callback_url?.trim() && m.user_id?.trim()) {
      saveAivideoAigcConfig({
        callback_url: m.callback_url.trim(),
        user_id: m.user_id.trim(),
        app_id: m.app_id,
        tenant_id: m.tenant_id,
        model_version_id: m.model_version_id,
        task_query_url: m.task_query_url,
        api_key: m.api_key,
      });
    }
    return m;
  };

  const handleTaskScroll = () => {
    const el = taskScrollRef.current;
    if (!el || generatedList.length === 0) {
      setInputBarCollapsed(false);
      return;
    }
    const maxScroll = el.scrollHeight - el.clientHeight;
    const distFromBottom = maxScroll - el.scrollTop;
    setInputBarCollapsed(distFromBottom > 120);
  };

  const scrollToLatestTask = () => {
    const el = taskScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior: 'smooth' });
    setInputBarCollapsed(false);
  };

  useEffect(() => {
    try {
      const key = 'ai-video-daily-scroll-hint';
      const today = new Date().toISOString().slice(0, 10);
      if (typeof window !== 'undefined' && localStorage.getItem(key) !== today) {
        setShowDailyScrollHint(true);
        localStorage.setItem(key, today);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const didSaveOnce = useRef(false);
  useEffect(() => {
    if (!didSaveOnce.current) {
      didSaveOnce.current = true;
      return;
    }
    saveHistoryToStorage(generatedList);
  }, [generatedList]);

  const handleLoadHistory = () => {
    const loaded = loadHistoryFromStorage();
    setGeneratedList(loaded);
    setSelectedId(loaded.length > 0 ? loaded[loaded.length - 1]!.id : null);
  };

  /** 进入页默认滚到底部（最新一条） */
  const didInitialScrollBottom = useRef(false);
  useEffect(() => {
    if (didInitialScrollBottom.current || generatedList.length === 0) return;
    const el = taskScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight - el.clientHeight;
      didInitialScrollBottom.current = true;
    });
  }, [generatedList.length]);

  const selectedItem = selectedId ? generatedList.find((i) => i.id === selectedId) : null;
  const newestId = generatedList.length ? generatedList[generatedList.length - 1]!.id : null;

  /** 侧栏：与中间栏一致，最新在底部；可选搜索过滤 */
  const sidebarItems = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    if (!q) return [...generatedList];
    return generatedList.filter((i) => i.prompt.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  }, [generatedList, historySearch]);

  const copyAssetLink = (item: GeneratedItem) => {
    const url = item.videoUrl || item.thumbnailUrl;
    void navigator.clipboard?.writeText(url).then(() => {
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId((id) => (id === item.id ? null : id)), 2000);
    });
  };

  const downloadAssetThumb = (item: GeneratedItem) => {
    const a = document.createElement('a');
    a.href = item.thumbnailUrl;
    a.download = `asset-${item.id}.jpg`;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.click();
  };
  const formatTime = (s: number) => `0:${String(s).padStart(2, '0')}`;

  const getDurationSec = (item: GeneratedItem) =>
    parseInt(item.duration?.replace(/\D/g, '') || '5', 10) || 5;

  const getPlayer = (id: string) => playerById[id] ?? { progress: 0, playing: false };
  const setPlayer = (id: string, patch: Partial<{ progress: number; playing: boolean }>) => {
    setPlayerById((prev) => ({
      ...prev,
      [id]: {
        progress: patch.progress ?? prev[id]?.progress ?? 0,
        playing: patch.playing ?? prev[id]?.playing ?? false,
      },
    }));
  };

  /** 中间栏滚动时，以视口顶部线为基准：选中「顶部已越过该线」的最后一条任务，与右侧高亮一一对应 */
  useEffect(() => {
    const root = taskScrollRef.current;
    if (!root || generatedList.length === 0) return;
    const update = () => {
      if (scrollFromSidebarRef.current) return;
      const slides = root.querySelectorAll<HTMLElement>('[data-task-slide]');
      const viewportTop = root.scrollTop + root.clientHeight * 0.25;
      let current: HTMLElement | null = null;
      for (const el of slides) {
        if (el.offsetTop <= viewportTop) current = el;
      }
      const id = current?.getAttribute('data-task-id') ?? slides[0]?.getAttribute('data-task-id');
      if (id) setSelectedId(id);
    };
    update();
    root.addEventListener('scroll', update, { passive: true });
    return () => root.removeEventListener('scroll', update);
  }, [generatedList]);

  const scrollTaskIntoView = (id: string) => {
    const safe = id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const el = taskScrollRef.current?.querySelector(`[data-task-id="${safe}"]`);
    scrollFromSidebarRef.current = true;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      scrollFromSidebarRef.current = false;
    }, 500);
  };

  useEffect(() => {
    return () => {
      pollTimersRef.current.forEach((t) => clearInterval(t));
      pollTimersRef.current.clear();
    };
  }, []);

  const stopPoll = (localId: string) => {
    const t = pollTimersRef.current.get(localId);
    if (t) {
      clearInterval(t);
      pollTimersRef.current.delete(localId);
    }
  };

  /** 最多轮询 120 次（3 s × 120 = 6 min）后自动停止，切为"已提交"状态 */
  const POLL_MAX = 120;
  const pollCountRef = useRef<Map<string, number>>(new Map());

  const startPollTask = (localId: string, taskId: string) => {
    pollCountRef.current.set(localId, 0);

    const tick = async () => {
      const count = (pollCountRef.current.get(localId) ?? 0) + 1;
      pollCountRef.current.set(localId, count);

      if (count > POLL_MAX) {
        stopPoll(localId);
        setGeneratedList((prev) =>
          prev.map((x) =>
            x.id === localId
              ? {
                  ...x,
                  taskStatus: 'submitted' as const,
                  errorMessage:
                    '轮询超时（已查询约 6 分钟），上游查询接口未返回视频地址。结果将由 callback_url 推送到你的服务端；若需在此页自动展示，请确认查询接口会在完成时返回视频 URL。',
                }
              : x
          )
        );
        return;
      }

      try {
        const c = loadAivideoAigcConfig();
        const qp = new URLSearchParams({ task_id: taskId });
        if (c.task_query_url?.trim()) {
          qp.set('poll_url', encodeURIComponent(c.task_query_url.trim()));
        }
        if (c.api_key?.trim()) qp.set('api_key', c.api_key.trim());
        const r = await fetch(`/api/video/kling-o1?${qp.toString()}`);
        const j = (await r.json()) as {
          status?: string;
          video_url?: string | null;
          thumbnail_url?: string | null;
          error?: string | null;
          raw_status?: string;
          hint?: string;
        };
        if (j.raw_status === 'no_poll_url') {
          stopPoll(localId);
          setGeneratedList((prev) =>
            prev.map((x) =>
              x.id === localId
                ? {
                    ...x,
                    taskStatus: 'submitted' as const,
                    errorMessage: j.hint || '任务已创建，请配置 AIGC_TASK_QUERY_URL 以在此页拉取成片，或通过回调服务接收结果。',
                  }
                : x
            )
          );
          return;
        }
        if (!r.ok) {
          stopPoll(localId);
          setGeneratedList((prev) =>
            prev.map((x) =>
              x.id === localId
                ? { ...x, taskStatus: 'failed' as const, errorMessage: j.error || `查询失败 (${r.status})` }
                : x
            )
          );
          return;
        }
        if (j.status === 'submitted') {
          stopPoll(localId);
          setGeneratedList((prev) =>
            prev.map((x) =>
              x.id === localId
                ? {
                    ...x,
                    taskStatus: 'submitted' as const,
                    errorMessage:
                      j.hint ||
                      '任务已提交上游，但查询接口未返回可播放地址；请通过 callback_url 接收结果或检查查询接口返回字段。',
                  }
                : x
            )
          );
          return;
        }
        if (j.status === 'succeeded' && j.video_url) {
          stopPoll(localId);
          setGeneratedList((prev) =>
            prev.map((x) =>
              x.id === localId
                ? {
                    ...x,
                    taskStatus: 'succeeded' as const,
                    videoUrl: j.video_url!,
                    thumbnailUrl: j.thumbnail_url || x.thumbnailUrl,
                  }
                : x
            )
          );
          return;
        }
        if (j.status === 'failed') {
          stopPoll(localId);
          setGeneratedList((prev) =>
            prev.map((x) =>
              x.id === localId
                ? { ...x, taskStatus: 'failed' as const, errorMessage: j.error || '生成失败' }
                : x
            )
          );
        }
      } catch {
        stopPoll(localId);
        setGeneratedList((prev) =>
          prev.map((x) =>
            x.id === localId ? { ...x, taskStatus: 'failed' as const, errorMessage: '网络异常' } : x
          )
        );
      }
    };
    void tick();
    const iv = setInterval(() => void tick(), 3000);
    pollTimersRef.current.set(localId, iv);
  };

  /** 生视频：有参考图时为图生图（先上传 Crevibe 再创建任务），否则文生视频 */
  const handleCreate = async (sourceItem?: GeneratedItem) => {
    const text = (sourceItem ? sourceItem.prompt : prompt).trim();
    if (!text || isSubmitting) return;
    const cfg = getAigcForApi();
    const ar = (sourceItem?.klingAspectRatio as (typeof KLING_ASPECT)[number]) || klingAspectRatio;
    const dur = (sourceItem?.klingDuration as (typeof KLING_DURATION)[number]) || klingDuration;
    const md = (sourceItem?.klingMode as (typeof KLING_MODE)[number]) || klingMode;
    const modelVersionId = sourceItem?.modelVersionId || selectedModelVersionId;
    const inputMode = sourceItem?.inputMode || selectedInputMode;
    const localId = `gen-${Date.now()}`;
    const thumbFallback =
      referenceImages[0]?.previewUrl ||
      referenceImageUrls[0] ||
      sourceItem?.thumbnailUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop';
    const newItem: GeneratedItem = {
      id: localId,
      thumbnailUrl: thumbFallback,
      prompt: text.slice(0, 2500),
      modelTag: getModelLabel(modelVersionId),
      modelVersionId,
      inputMode,
      duration: `${dur}s`,
      resolution: ar,
      createdAt: Date.now(),
      taskStatus: 'pending',
      klingAspectRatio: ar,
      klingDuration: dur,
      klingMode: md,
      referencePreviewUrl: referenceImages[0]?.previewUrl ?? referenceImageUrls[0],
    };
    setGeneratedList((prev) => [...prev, newItem]);
    setSelectedId(localId);
    setIsSubmitting(true);
    setTimeout(() => {
      const el = taskScrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior: 'smooth' });
    }, 80);
    try {
      let imageUrls = referenceImageUrls.slice(0, REFERENCE_IMAGE_MAX);
      if (referenceImages.length > 0) {
        const form = new FormData();
        referenceImages.forEach((r) => form.append('images', r.file, r.file.name || 'image.jpg'));
        const uploadRes = await fetch('/api/upload/crevibe-batch-images', { method: 'POST', body: form });
        const uploadJ = (await uploadRes.json()) as { error?: string; urls?: string[] };
        if (!uploadRes.ok || !uploadJ.urls?.length) {
          setGeneratedList((prev) =>
            prev.map((x) =>
              x.id === localId
                ? { ...x, taskStatus: 'failed' as const, errorMessage: uploadJ.error || '参考图上传失败' }
                : x
            )
          );
          return;
        }
        imageUrls = [...imageUrls, ...uploadJ.urls].slice(0, REFERENCE_IMAGE_MAX);
      }
      const res = await fetch('/api/video/kling-o1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_task: sourceItem ? `${sourceItem.id}-regen-${Date.now()}` : localId,
          prompt: text.slice(0, 2500),
          aspect_ratio: ar,
          duration: dur,
          mode: md,
          category: imageUrls.length > 0 ? 'image_to_image' : 'text_to_video',
          input_images: imageUrls.length > 0 ? imageUrls : undefined,
          callback_url: cfg.callback_url?.trim(),
          user_id: cfg.user_id?.trim(),
          app_id: cfg.app_id?.trim() || undefined,
          tenant_id: cfg.tenant_id?.trim() || undefined,
          model_version_id: modelVersionId,
          api_key: cfg.api_key?.trim() || undefined,
        }),
      });
      const j = (await res.json()) as { error?: string; task_id?: string };
      if (!res.ok) {
        stopPoll(localId);
        setGeneratedList((prev) =>
          prev.map((x) =>
            x.id === localId
              ? { ...x, taskStatus: 'failed' as const, errorMessage: j.error || `请求失败 (${res.status})` }
              : x
          )
        );
        return;
      }
      if (!j.task_id) {
        setGeneratedList((prev) =>
          prev.map((x) =>
            x.id === localId
              ? { ...x, taskStatus: 'failed' as const, errorMessage: j.error || '未返回任务 ID' }
              : x
          )
        );
        return;
      }
      setGeneratedList((prev) =>
        prev.map((x) =>
          x.id === localId
            ? {
                ...x,
                remoteTaskId: j.task_id,
                taskStatus: 'processing' as const,
                sourceImageUrl: imageUrls[0],
                sourceImageUrls: imageUrls.length > 0 ? imageUrls : undefined,
              }
            : x
        )
      );
      startPollTask(localId, j.task_id);
    } catch {
      setGeneratedList((prev) =>
        prev.map((x) =>
          x.id === localId ? { ...x, taskStatus: 'failed' as const, errorMessage: '网络错误' } : x
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /** 删除任务：停止轮询 + 从列表中移除 */
  const handleDeleteTask = (item: GeneratedItem) => {
    stopPoll(item.id);
    setGeneratedList((prev) => prev.filter((x) => x.id !== item.id));
  };

  /** 将当前任务内容带入下方输入框，便于重新编辑后生成 */
  const handleEditTask = (item: GeneratedItem) => {
    setPrompt(item.prompt);
    setKlingAspectRatio((item.klingAspectRatio as (typeof KLING_ASPECT)[number]) || '16:9');
    setKlingDuration((item.klingDuration as (typeof KLING_DURATION)[number]) || '5');
    setKlingMode((item.klingMode as (typeof KLING_MODE)[number]) || 'std');
    setSelectedInputMode((item.inputMode as VideoInputMode) || 'reference');
    const modelVersionId = item.modelVersionId || VIDEO_MODEL_OPTIONS[0].id;
    setSelectedModelVersionId(
      (VIDEO_MODEL_OPTIONS.find((m) => m.id === modelVersionId)?.id || VIDEO_MODEL_OPTIONS[0].id) as VideoModelVersionId
    );
    const urls = item.sourceImageUrls?.length ? item.sourceImageUrls : item.sourceImageUrl ? [item.sourceImageUrl] : [];
    setReferenceImageUrls(urls);
    setReferenceImages([]);
    setInputBarCollapsed(false);
  };

  /** 失败任务原地重试（不新增一条） */
  const handleRetryTask = async (item: GeneratedItem) => {
    const localId = item.id;
    const text = item.prompt.trim();
    if (!text || isSubmitting) return;
    const cfg = getAigcForApi();
    const ar = (item.klingAspectRatio as (typeof KLING_ASPECT)[number]) || '16:9';
    const dur = (item.klingDuration as (typeof KLING_DURATION)[number]) || '5';
    const md = (item.klingMode as (typeof KLING_MODE)[number]) || 'std';
    const modelVersionId = item.modelVersionId || selectedModelVersionId;
    stopPoll(localId);
    setGeneratedList((prev) =>
      prev.map((x) =>
        x.id === localId
          ? {
              ...x,
              taskStatus: 'pending' as const,
              errorMessage: undefined,
              videoUrl: undefined,
              remoteTaskId: undefined,
            }
          : x
      )
    );
    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        id_task: `${localId}-retry-${Date.now()}`,
        prompt: text.slice(0, 2500),
        aspect_ratio: ar,
        duration: dur,
        mode: md,
        callback_url: cfg.callback_url?.trim(),
        user_id: cfg.user_id?.trim(),
        app_id: cfg.app_id?.trim(),
        tenant_id: cfg.tenant_id?.trim(),
        model_version_id: modelVersionId,
        api_key: cfg.api_key?.trim(),
      };
      const refUrls = item.sourceImageUrls?.length
        ? item.sourceImageUrls
        : item.sourceImageUrl
          ? [item.sourceImageUrl]
          : [];
      if (refUrls.length > 0) {
        body.category = 'image_to_image';
        body.input_images = refUrls;
      }
      const res = await fetch('/api/video/kling-o1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = (await res.json()) as { error?: string; task_id?: string };
      if (!res.ok || !j.task_id) {
        setGeneratedList((prev) =>
          prev.map((x) =>
            x.id === localId
              ? {
                  ...x,
                  taskStatus: 'failed' as const,
                  errorMessage: j.error || `请求失败 (${res.status})`,
                  modelVersionId,
                  modelTag: getModelLabel(modelVersionId),
                }
              : x
          )
        );
        return;
      }
      setGeneratedList((prev) =>
        prev.map((x) =>
          x.id === localId ? { ...x, remoteTaskId: j.task_id, taskStatus: 'processing' as const } : x
        )
      );
      startPollTask(localId, j.task_id);
    } catch {
      setGeneratedList((prev) =>
        prev.map((x) =>
          x.id === localId ? { ...x, taskStatus: 'failed' as const, errorMessage: '网络错误' } : x
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900 antialiased overscroll-none selection:bg-teal-100 selection:text-teal-900" data-page="ai-video">
      <header className="flex-shrink-0 h-12 sm:h-[52px] px-3 sm:px-4 md:px-5 lg:px-6 flex items-center justify-between border-b border-slate-200/80 bg-white shadow-sm z-50">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[15px] sm:text-[17px] font-semibold tracking-tight text-slate-900 truncate">AI Studio</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 leading-none hidden sm:block">PhotoGrid</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* 小屏展开/收起侧栏（lg 以上隐藏） */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => { setRightDrawerOpen(false); setLeftDrawerOpen((v) => !v); }}
              className={uiIconBtn}
              title="模板"
              aria-label="展开模板"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { setLeftDrawerOpen(false); setRightDrawerOpen((v) => !v); }}
              className={uiIconBtn}
              title="资产"
              aria-label="展开资产栏"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setAigcForm((prev) => mergeAigcFormWithStored(prev));
              setSettingsOpen(true);
            }}
            className={`${uiHeaderGhost} px-2.5 sm:px-3 h-8 sm:h-9`}
            title="AIGC 回调、用户 ID、轮询地址等"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">接口设置</span>
          </button>
          <button
            type="button"
            className={`${uiHeaderGhost} gap-1 sm:gap-1.5 pl-2.5 sm:pl-3 pr-2 sm:pr-3 h-8 sm:h-9`}
            aria-label="收藏，当前 0"
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline tabular-nums">0</span>
          </button>
          <button
            type="button"
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-xs font-medium text-white shadow-sm ring-2 ring-white transition-all hover:brightness-[1.03] sm:h-10 sm:w-10 sm:text-sm ${FV}`}
            title="用户"
            aria-label="用户"
          >
            F
            <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[18px] px-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
              Pro
            </span>
          </button>
        </div>
      </header>

      {/* 小屏下抽屉打开时的遮罩，点击关闭 */}
      {(leftDrawerOpen || rightDrawerOpen) && (
        <button
          type="button"
          aria-label="关闭侧栏"
          className="fixed inset-0 top-12 sm:top-[52px] z-30 bg-slate-900/25 backdrop-blur-[2px] lg:hidden"
          onClick={() => { setLeftDrawerOpen(false); setRightDrawerOpen(false); }}
        />
      )}

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="aigc-settings-title"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xl shadow-slate-200/50 sm:max-h-[90vh] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 id="aigc-settings-title" className="text-lg font-semibold text-slate-900">
                接口设置（存本机浏览器）
              </h2>
              <button type="button" onClick={() => setSettingsOpen(false)} className={`rounded-lg px-2 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 ${FV}`}>
                关闭
              </button>
            </div>
            <p className={uiTextMuted}>
              与 curl 一致：<strong className="text-slate-700">callback_url</strong> 与 <strong className="text-slate-700">user_id</strong> 至少二选一来源：本页填写或服务端 .env。点「保存」会写入本机；不点保存直接点「生成」也会用当前输入框里的内容发请求。
              任务查询 URL 须含 <code className="text-teal-600">{'{task_id}'}</code>。
            </p>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600">callback_url</span>
              <input
                className={uiInput}
                placeholder="https://你的服务/aigc/callback"
                value={aigcForm.callback_url ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, callback_url: e.target.value }))}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600">user_id</span>
              <input className={uiInput} placeholder="如 12343211" value={aigcForm.user_id ?? ''} onChange={(e) => setAigcForm((f) => ({ ...f, user_id: e.target.value }))} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="text-xs text-slate-600">app_id（可选）</span>
                <input className={uiInput} placeholder="arena" value={aigcForm.app_id ?? ''} onChange={(e) => setAigcForm((f) => ({ ...f, app_id: e.target.value }))} />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-slate-600">tenant_id（可选）</span>
                <input className={uiInput} placeholder="arena" value={aigcForm.tenant_id ?? ''} onChange={(e) => setAigcForm((f) => ({ ...f, tenant_id: e.target.value }))} />
              </label>
            </div>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600">model_version_id（可选，默认 kling-video-o1）</span>
              <input
                className={uiInput}
                placeholder="kling-video-o1"
                value={aigcForm.model_version_id ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, model_version_id: e.target.value }))}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600">任务查询 URL（轮询，须含 {'{task_id}'}；不填则用默认）</span>
              <input
                className={uiInput}
                placeholder="https://artface.linkv.live/api/v1/task/detail/query/{task_id}"
                value={aigcForm.task_query_url ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, task_query_url: e.target.value }))}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600">API Key（可选，Bearer；创建与轮询共用）</span>
              <input
                type="password"
                className={uiInput}
                placeholder="留空则用服务端环境变量"
                value={aigcForm.api_key ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, api_key: e.target.value }))}
                autoComplete="off"
              />
            </label>
            <div className="flex flex-wrap gap-2 pt-2">
              <button type="button" onClick={persistAigcForm} className={`${uiPrimary} min-w-[80px] flex-1`}>
                保存
              </button>
              <button
                type="button"
                onClick={() => {
                  const restored = { ...aigcForm, ...AIVIDEO_AIGC_DEFAULTS };
                  setAigcForm(restored);
                  saveAivideoAigcConfig({
                    callback_url: restored.callback_url ?? '',
                    user_id: restored.user_id ?? '',
                    app_id: restored.app_id,
                    tenant_id: restored.tenant_id,
                    model_version_id: restored.model_version_id,
                    task_query_url: restored.task_query_url,
                    api_key: restored.api_key,
                  });
                }}
                className={uiSecondary}
                title="将 callback_url、user_id 恢复为当前默认并写入本机"
              >
                恢复默认
              </button>
              <button type="button" onClick={() => setSettingsOpen(false)} className={uiSecondary}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex min-h-0 overflow-hidden min-w-0 relative">
      {/* 左侧：小屏为抽屉，lg 及以上为常驻 */}
      <aside
        className={`fixed lg:relative left-0 top-12 sm:top-[52px] lg:top-0 bottom-0 z-40 lg:z-auto w-72 max-w-[85vw] lg:w-[300px] xl:w-[380px] lg:max-w-none flex-shrink-0 flex flex-col min-h-0 border-r border-slate-200/80 bg-white shadow-[2px_0_12px_-4px_rgba(15,23,42,0.06)] pr-0 overflow-hidden transition-transform duration-200 ease-out ${
          leftDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50 px-2.5 py-1.5 sm:px-3 sm:py-2">
          <Link
            href="/editor"
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-teal-700 ${FV}`}
            title="返回编辑器"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            返回
          </Link>
          <button
            type="button"
            onClick={() => setLeftDrawerOpen(false)}
            className={`${uiIconBtnOnPanel} lg:hidden`}
            title="收起"
            aria-label="收起模板栏"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-shrink-0 bg-white px-3 pt-2 text-xs font-medium text-slate-500 sm:px-3.5">模板库</div>
        <div className="flex-shrink-0 overflow-x-auto bg-white">
          <div className="flex gap-2 p-3 min-w-0">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const isActive = templateCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setTemplateCategory(cat.id)}
                  className={`${uiPillBase} ${isActive ? uiPillActive : uiPillInactive}`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'opacity-95' : 'opacity-70'}`} />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50/40 p-2.5 sm:p-3 sidebar-scrollbar">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                className="group/card rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-sm hover:shadow-md hover:border-teal-200/60 transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplateId(t.id);
                    setPrompt(buildTemplatePrompt(t.name, t.category));
                    setInputBarCollapsed(false);
                    setPromptExpanded(true);
                    setLeftDrawerOpen(false);
                  }}
                  className={`block w-full appearance-none border-0 bg-transparent p-0 text-left align-top ${FV}`}
                  aria-label={`使用模板 ${t.name}`}
                >
                  <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                    <img src={t.thumb} alt={t.name} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-300" />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 bg-slate-900/10">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-800 shadow-md">
                        使用
                      </span>
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center min-h-[2rem] py-1.5 px-2 bg-gradient-to-t from-black/55 to-transparent">
                      <p className="text-xs font-medium text-white leading-tight line-clamp-2 text-center w-full drop-shadow-sm">
                        {t.name}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
          {filteredTemplates.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">该分类暂无模板</div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-slate-50 relative">
        <div className="pointer-events-none absolute inset-0 z-0 bg-lovart-canvas-dots" aria-hidden />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(20,184,166,0.045),transparent)]" aria-hidden />
        <div className="w-full max-w-3xl mx-auto min-w-0 flex-1 min-h-0 relative z-[1] px-3 sm:px-4 md:px-5">
          <div
            ref={taskScrollRef}
            onScroll={handleTaskScroll}
            className="h-full min-h-0 overflow-y-auto overflow-x-hidden sidebar-scrollbar snap-y snap-mandatory scroll-smooth pb-[min(260px,32vh)] sm:pb-[min(300px,38vh)]"
          >
            {generatedList.length === 0 ? (
              <div className="flex min-h-[44vh] flex-col items-center justify-center px-3">
                <div className="w-full max-w-sm rounded-2xl border border-dashed border-slate-200 bg-white/80 px-5 py-8 text-center shadow-sm">
                  <p className="text-slate-500 text-sm leading-relaxed">暂无生成记录</p>
                  <p className="text-slate-400 text-xs mt-2">在下方输入提示词后点击生成</p>
                </div>
              </div>
            ) : (
              generatedList.map((item) => {
                const { progress, playing } = getPlayer(item.id);
                const dur = getDurationSec(item);
                const cur = Math.round((progress / 100) * dur);
                const gen = isItemGenerating(item);
                const failed = item.taskStatus === 'failed';
                const submitted = item.taskStatus === 'submitted';
                const showVideo = Boolean(item.videoUrl) && item.taskStatus === 'succeeded';
                const refImg = item.sourceImageUrl || item.sourceImageUrls?.[0] || item.referencePreviewUrl;
                const tags = [
                  item.modelTag,
                  item.resolution,
                  item.klingMode ? (item.klingMode === 'pro' ? '1080p' : '720p') : null,
                  item.duration,
                ].filter(Boolean);
                return (
                  <section
                    key={item.id}
                    data-task-id={item.id}
                    data-task-slide
                    className="snap-start snap-always flex min-h-0 flex-col border-b border-slate-100 pb-6 last:border-0 sm:pb-8"
                  >
                    {/* ── 元信息行：左侧缩略图+prompt，右侧操作按钮（与视频左右边线对齐） ── */}
                    <div className="flex items-start justify-between gap-3 py-3">
                      <div className="flex min-w-0 flex-1 items-start gap-2 pr-2">
                        {refImg && (
                          <img
                            src={refImg}
                            alt="参考图"
                            className="mt-0.5 h-8 w-8 shrink-0 rounded-md border border-slate-200 object-cover"
                          />
                        )}
                        <p className="min-w-0 flex-1 text-sm leading-6 text-slate-800 line-clamp-3">{item.prompt}</p>
                      </div>
                      <div className="flex shrink-0 items-center self-start pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleEditTask(item)}
                          className={uiAssetActionBtn}
                          title="编辑：带到下方输入框"
                          aria-label="编辑任务"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCreate(item)}
                          disabled={isSubmitting}
                          className={uiAssetActionBtn}
                          title="再次生成"
                          aria-label="再次生成"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(item)}
                          className={`${uiAssetActionBtn} hover:text-red-500`}
                          title="删除任务"
                          aria-label="删除任务"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {tags.length > 0 && (
                      <div className="-mt-1 flex flex-wrap gap-1 pb-2">
                        {tags.map((t) => (
                          <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ── 视频 / 状态区（所有状态统一 aspect-video 高度）── */}
                    {failed ? (
                      <div className="flex w-full items-center justify-center bg-red-50" style={{ aspectRatio: '16/9' }}>
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-center text-sm text-red-600">{item.errorMessage || '生成失败'}</p>
                          <button
                            type="button"
                            onClick={() => void handleRetryTask(item)}
                            disabled={isSubmitting}
                            className={uiSecondaryCompact}
                          >
                            重试
                          </button>
                        </div>
                      </div>
                    ) : submitted ? (
                      <div className="flex w-full items-center justify-center border-y border-teal-100 bg-teal-50/60" style={{ aspectRatio: '16/9' }}>
                        <div className="flex flex-col items-center gap-2 px-6">
                          <p className="text-sm font-medium text-teal-800">任务已提交上游</p>
                          {item.remoteTaskId && (
                            <p className="break-all text-center font-mono text-xs text-slate-500">task_id: {item.remoteTaskId}</p>
                          )}
                          <p className="max-w-sm text-center text-xs leading-relaxed text-slate-500">
                            {item.errorMessage || '成片由上游推送到 callback_url；若需本页自动展示，请在设置中配置查询地址。'}
                          </p>
                        </div>
                      </div>
                    ) : gen ? (
                      <div className="flex w-full items-center justify-center bg-slate-100" style={{ aspectRatio: '16/9' }}>
                        <div className="flex flex-col items-center gap-2.5 text-teal-600">
                          <Loader2 className="h-10 w-10 animate-spin opacity-80" />
                          <span className="text-xs text-slate-500">生成中，可关闭页面稍后查看历史</span>
                        </div>
                      </div>
                    ) : showVideo ? (
                      <div
                        className="relative w-full shrink-0 overflow-hidden rounded-2xl bg-black"
                        style={{ maxHeight: 'min(56vh, 520px)', aspectRatio: '16/9' }}
                      >
                        <video
                          src={item.videoUrl}
                          poster={item.thumbnailUrl}
                          controls
                          playsInline
                          className="h-full w-full bg-black object-contain"
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          className="relative w-full shrink-0 overflow-hidden rounded-2xl bg-black"
                          style={{ maxHeight: 'min(56vh, 520px)', aspectRatio: '16/9' }}
                        >
                          <img src={item.thumbnailUrl} alt="" className="h-full w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setPlayer(item.id, { playing: !playing })}
                            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/10 to-transparent transition-all hover:via-black/20 ${FV}`}
                            aria-label={playing ? '暂停' : '播放'}
                          >
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-transform hover:scale-105">
                              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                            </span>
                          </button>
                        </div>
                        {/* 进度条 */}
                        <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-2">
                          <button
                            type="button"
                            onClick={() => setPlayer(item.id, { playing: !playing })}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 ${FV}`}
                            aria-label={playing ? '暂停' : '播放'}
                          >
                            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                          </button>
                          <span className="w-8 shrink-0 text-xs tabular-nums text-slate-400">{formatTime(cur)}</span>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={progress}
                            onChange={(e) => setPlayer(item.id, { progress: Number(e.target.value) })}
                            className={`h-1 min-w-[60px] flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-teal-600 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 ${FV}`}
                            aria-label="播放进度"
                          />
                          <span className="w-8 shrink-0 text-xs tabular-nums text-slate-400">{formatTime(dur)}</span>
                        </div>
                      </>
                    )}

                    {showDailyScrollHint && newestId === item.id && (
                      <p className={`${uiTextMuted} shrink-0 py-2 text-center`}>上下滑动切换任务</p>
                    )}
                  </section>
                );
              })
            )}
          </div>

          {/* 悬浮输入层：展开时底部极淡渐变防文字贴边；收起时不铺渐变避免挡视线 */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-3 sm:px-4 pb-2 sm:pb-3 ${
              inputBarCollapsed && generatedList.length > 0
                ? 'pt-2 sm:pt-3'
                : 'pt-6 sm:pt-8 bg-gradient-to-t from-slate-50/45 to-transparent'
            }`}
          >
            {inputBarCollapsed && generatedList.length > 0 && (
              <div className="pointer-events-auto flex flex-col items-end w-full max-w-3xl mx-auto mb-1">
                <button
                  type="button"
                  onClick={scrollToLatestTask}
                  className={`flex items-center gap-1 py-1 pr-1 text-xs text-slate-500 transition-colors hover:text-teal-700 ${FV}`}
                >
                  回到底部
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div
              className={`pointer-events-auto w-full max-w-3xl mx-auto border border-slate-200/90 bg-white shadow-lg shadow-slate-200/40 backdrop-blur-sm ${
                inputBarCollapsed && generatedList.length > 0
                  ? 'rounded-2xl px-2 sm:px-2.5 py-1.5'
                  : 'rounded-2xl overflow-hidden'
              }`}
            >
              {inputBarCollapsed && generatedList.length > 0 ? (
                <div className="flex min-h-[46px] items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInputBarCollapsed(false)}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 ${FV}`}
                    title="展开"
                    aria-label="展开输入框"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputBarCollapsed(false)}
                    className={`min-w-0 flex-1 truncate py-2 text-left text-sm text-slate-500 ${FV}`}
                  >
                    {prompt.trim() || '试试描述一段简短的故事情节…'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCreate()}
                    disabled={isSubmitting || !prompt.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm transition-colors hover:bg-teal-700 disabled:opacity-50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/90"
                    title="生成"
                    aria-label="生成"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <div className="relative space-y-2.5 p-3 sm:p-3.5">
                  <button
                    type="button"
                    onClick={() => setPromptExpanded((v) => !v)}
                    className={`absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 ${FV}`}
                    title={promptExpanded ? '收起输入框' : '展开输入框'}
                    aria-label={promptExpanded ? '收起提示词输入框' : '展开提示词输入框'}
                  >
                    {promptExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                  <div className="overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2 pb-2">
                      {selectedTemplate ? (
                        <div className="group relative flex-shrink-0">
                          <img
                            src={selectedTemplate.thumb}
                            alt={selectedTemplate.name}
                            className="h-11 w-11 rounded-xl border border-slate-200 object-cover sm:h-12 sm:w-12"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedTemplateId(null)}
                            className={`absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-md border border-slate-200 bg-white/95 text-slate-500 shadow-sm opacity-0 transition-all duration-150 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-red-50 hover:text-red-500 ${FV}`}
                            title="移除模板"
                            aria-label="移除模板"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={`${uiToolTileBase} border-slate-200/80 bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-700`}
                          title="模板"
                        >
                          <Plus className="h-4 w-4" />
                          模版
                        </button>
                      )}
                      <input
                        ref={referenceInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
                          if (files.length === 0) {
                            e.target.value = '';
                            return;
                          }
                          setReferenceImages((prev) => {
                            const maxNew = REFERENCE_IMAGE_MAX - referenceImageUrls.length;
                            const next = [...prev];
                            for (const f of files) {
                              if (next.length >= maxNew) break;
                              next.push({ file: f, previewUrl: URL.createObjectURL(f) });
                            }
                            return next.slice(0, maxNew);
                          });
                          e.target.value = '';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => referenceInputRef.current?.click()}
                        disabled={referenceImages.length + referenceImageUrls.length >= REFERENCE_IMAGE_MAX}
                        className={`${uiToolTileBase} border transition-colors disabled:opacity-50 ${
                          referenceImages.length > 0 || referenceImageUrls.length > 0
                            ? 'border-teal-200/80 bg-teal-50 text-teal-800'
                            : 'border-slate-200/80 bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-700'
                        }`}
                        title="选择参考图后为图生图模式，最多 7 张"
                      >
                        <ImagePlus className="w-4 h-4" />
                        参考
                      </button>
                      {referenceImageUrls.map((url, idx) => (
                        <div key={`url-${idx}`} className="group relative flex-shrink-0">
                          <img
                            src={url}
                            alt={`参考图 ${idx + 1}`}
                            className="h-11 w-11 rounded-xl border border-slate-200 object-cover sm:h-12 sm:w-12"
                          />
                          <button
                            type="button"
                            onClick={() => setReferenceImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                            className={`absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-md border border-slate-200 bg-white/95 text-slate-500 shadow-sm opacity-0 transition-all duration-150 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-red-50 hover:text-red-500 ${FV}`}
                            title="移除参考图"
                            aria-label="移除参考图"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {referenceImages.map((r, idx) => (
                        <div key={idx} className="group relative flex-shrink-0">
                          <img
                            src={r.previewUrl}
                            alt={`参考图 ${idx + 1}`}
                            className="h-11 w-11 rounded-xl border border-slate-200 object-cover sm:h-12 sm:w-12"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(r.previewUrl);
                              setReferenceImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className={`absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-md border border-slate-200 bg-white/95 text-slate-500 shadow-sm opacity-0 transition-all duration-150 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-red-50 hover:text-red-500 ${FV}`}
                            title="移除参考图"
                            aria-label="移除参考图"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value.slice(0, 2500))}
                      placeholder="正向提示词（文生视频），主体、环境、时间、风格等，最多 2500 字"
                      className={`${uiPromptTextarea} ${promptExpanded ? 'min-h-[220px] sm:min-h-[280px]' : 'min-h-[72px]'}`}
                      maxLength={2500}
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="order-2 flex flex-wrap items-center gap-2 sm:order-1">
                      <select
                        value={selectedModelVersionId}
                        onChange={(e) => setSelectedModelVersionId(e.target.value as VideoModelVersionId)}
                        className={uiSelect}
                        title="模型"
                      >
                        {VIDEO_MODEL_OPTIONS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedInputMode}
                        onChange={(e) => setSelectedInputMode(e.target.value as VideoInputMode)}
                        className={uiSelect}
                        title="输入模式"
                      >
                        {VIDEO_INPUT_MODE_OPTIONS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={klingAspectRatio}
                        onChange={(e) => setKlingAspectRatio(e.target.value as (typeof KLING_ASPECT)[number])}
                        className={uiSelect}
                        title="画幅 → 请求 parameters.aspect_ratio（与 Postman/curl 一致）"
                      >
                        {KLING_ASPECT.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      <select
                        value={klingDuration}
                        onChange={(e) => setKlingDuration(e.target.value as (typeof KLING_DURATION)[number])}
                        className={uiSelect}
                        title="时长(秒)"
                      >
                        {KLING_DURATION.map((d) => (
                          <option key={d} value={d}>
                            {d}s
                          </option>
                        ))}
                      </select>
                      <select
                        value={klingMode}
                        onChange={(e) => setKlingMode(e.target.value as (typeof KLING_MODE)[number])}
                        className={uiSelect}
                        title="模式"
                      >
                        <option value="std">720p</option>
                        <option value="pro">1080p</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt('');
                          setSelectedTemplateId(null);
                          setSelectedModelVersionId(VIDEO_MODEL_OPTIONS[0].id);
                          setSelectedInputMode('reference');
                          setKlingAspectRatio('16:9');
                          setKlingDuration('5');
                          setKlingMode('std');
                          referenceImages.forEach((r) => URL.revokeObjectURL(r.previewUrl));
                          setReferenceImages([]);
                          setReferenceImageUrls([]);
                        }}
                        className={`${uiIconOutlineBtn} border-slate-200 bg-slate-50`}
                        title="恢复输入框到默认"
                        aria-label="重置输入"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="order-1 flex items-center justify-between gap-2 sm:order-2 sm:justify-end">
                      <span className="tabular-nums text-xs text-slate-500">{prompt.length}/2500</span>
                      <button
                        type="button"
                        onClick={() => void handleCreate()}
                        disabled={isSubmitting || !prompt.trim()}
                        className={`${uiPrimary} sm:min-w-0`}
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        生成
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 右侧：小屏为抽屉，lg 及以上为常驻 */}
      <aside
        className={`fixed lg:relative right-0 top-12 sm:top-[52px] lg:top-0 bottom-0 z-40 lg:z-auto w-72 max-w-[85vw] lg:w-56 xl:w-72 lg:max-w-none flex-shrink-0 flex flex-col min-h-0 border-l border-slate-200/80 bg-white shadow-[-4px_0_16px_-6px_rgba(15,23,42,0.06)] transition-transform duration-200 ease-out ${
          rightDrawerOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-shrink-0 flex-col space-y-2 border-b border-slate-100 bg-slate-50/40 px-2.5 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                <FolderOpen className="w-4 h-4" aria-hidden />
              </div>
              <span className="text-sm font-semibold text-slate-900">资产</span>
            </div>
            <button
              type="button"
              onClick={() => setRightDrawerOpen(false)}
              className={`${uiIconBtnOnPanel} shrink-0 lg:hidden`}
              title="收起"
              aria-label="收起资产栏"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className={uiTextMuted}>拖拽缩略图到桌面或应用；复制链接可粘贴到剪贴板。</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="搜索资产…"
                className={uiInputSearch}
                aria-label="搜索资产"
              />
            </div>
            <button type="button" className={`${uiIconOutlineBtn} shrink-0 text-slate-400 hover:text-slate-700`} title="日期" aria-label="按日期筛选">
              <Calendar className="h-4 w-4" />
            </button>
          </div>
          {generatedList.length === 0 && (
            <button
              type="button"
              onClick={handleLoadHistory}
              className={`${uiSecondaryCompact} w-full text-xs text-slate-600 hover:border-teal-200 hover:text-teal-700 hover:bg-teal-50/50`}
            >
              加载历史
            </button>
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto bg-white px-2.5 py-2 sidebar-scrollbar">
          {generatedList.length === 0 ? (
            <div className="space-y-2.5 px-2 py-8 text-center">
              <p className="text-sm text-slate-600">暂无记录</p>
              <button type="button" onClick={handleLoadHistory} className={uiTextLink}>
                加载历史
              </button>
            </div>
          ) : sidebarItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">无匹配项</div>
          ) : (
            <ul className="space-y-1.5">
              {sidebarItems.map((item) => {
                const isActive = selectedId === item.id;
                const isGeneratingThis = isItemGenerating(item);
                return (
                  <li key={item.id}>
                    <div className={sidebarAssetRowClass(isActive)}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(item.id);
                          scrollTaskIntoView(item.id);
                          setRightDrawerOpen(false);
                        }}
                        className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                      >
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          {isGeneratingThis ? (
                            <div className="absolute inset-0 z-[1] flex items-center justify-center bg-black/50">
                              <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                            </div>
                          ) : null}
                          <img
                            src={item.thumbnailUrl}
                            alt=""
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = 'copy';
                              e.dataTransfer.setData('text/uri-list', item.thumbnailUrl);
                              e.dataTransfer.setData('text/plain', item.thumbnailUrl);
                            }}
                            className="h-full w-full object-cover cursor-grab active:cursor-grabbing"
                            title="拖到桌面或其他应用"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs leading-tight text-slate-800">{item.prompt}</p>
                          <p className="mt-0 text-xs text-slate-500">{timeAgo(item.createdAt)}</p>
                        </div>
                      </button>
                      <div className="flex shrink-0 flex-col gap-0.5">
                        <button
                          type="button"
                          title="复制图片链接"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyAssetLink(item);
                          }}
                          className={uiAssetActionBtn}
                          aria-label="复制图片链接"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title="下载封面"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadAssetThumb(item);
                          }}
                          className={uiAssetActionBtn}
                          aria-label="下载封面"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {copiedId === item.id && (
                      <p className="pr-1 pb-1 text-right text-xs text-teal-600">已复制链接</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
      </div>
    </div>
  );
}
