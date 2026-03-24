'use client';

/**
 * AI 视频页设计规范（统一暗色主题）：
 * - 圆角：小控件 rounded-lg(8px)、卡片/按钮 rounded-xl(12px)、大面板 rounded-2xl(16px)
 * - 间距：gap-2(8px) / gap-3(12px)，内边距 p-2 / p-3 / p-4
 * - 边框：默认 border-white/[0.08]，强调 border-white/[0.12]
 * - 表面：输入/底 bg-white/[0.04]，悬停 bg-white/[0.06]
 * - 文字：辅助 text-zinc-500 text-xs，正文 text-zinc-300 text-sm
 * - 强调色：teal，焦点 ring-teal-500/20
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
  Clock,
  FolderOpen,
  Settings,
  X,
  PanelLeft,
  List,
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

interface GeneratedItem {
  id: string;
  thumbnailUrl: string;
  prompt: string;
  modelTag?: string;
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

export default function AIVideoPage() {
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const filteredTemplates =
    templateCategory === 'all'
      ? MOCK_TEMPLATES
      : MOCK_TEMPLATES.filter((t) => t.category === templateCategory);
  const [historySearch, setHistorySearch] = useState('');
  const [rightPanelMode, setRightPanelMode] = useState<'history' | 'assets'>('history');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  /** 小屏下左侧模板栏、右侧历史栏展开态（lg 及以上始终展示，不依赖此状态） */
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

  const startPollTask = (localId: string, taskId: string) => {
    const tick = async () => {
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
      modelTag: 'Kling O1',
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
          model_version_id: cfg.model_version_id?.trim() || undefined,
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

  /** 将当前任务内容带入下方输入框，便于重新编辑后生成 */
  const handleEditTask = (item: GeneratedItem) => {
    setPrompt(item.prompt);
    setKlingAspectRatio((item.klingAspectRatio as (typeof KLING_ASPECT)[number]) || '16:9');
    setKlingDuration((item.klingDuration as (typeof KLING_DURATION)[number]) || '5');
    setKlingMode((item.klingMode as (typeof KLING_MODE)[number]) || 'std');
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
        model_version_id: cfg.model_version_id?.trim(),
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
    <div className="h-screen overflow-hidden flex flex-col bg-[#0c0e12] text-zinc-100 antialiased overscroll-none" data-page="ai-video">
      {/* 顶栏：与整体深色影院风格统一 */}
      <header className="flex-shrink-0 h-12 sm:h-[52px] px-3 sm:px-4 md:px-5 lg:px-6 flex items-center justify-between border-b border-white/[0.08] bg-[#0a0c10]/95 backdrop-blur-md">
        <div className="flex flex-col gap-0 min-w-0">
          <span className="text-[15px] sm:text-[17px] font-bold tracking-tight text-white italic truncate">AI Studio</span>
          <span className="text-[10px] sm:text-[11px] text-zinc-500 leading-none hidden sm:block">powered by PhotoGrid</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* 小屏展开/收起侧栏（lg 以上隐藏） */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => { setRightDrawerOpen(false); setLeftDrawerOpen((v) => !v); }}
              className="h-8 w-8 rounded-xl bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center transition-colors"
              title="模板"
              aria-label="展开模板"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { setLeftDrawerOpen(false); setRightDrawerOpen((v) => !v); }}
              className="h-8 w-8 rounded-xl bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center transition-colors"
              title="历史"
              aria-label="展开历史"
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
            className="flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-3 rounded-xl bg-white/[0.04] text-sm font-medium text-zinc-300 hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
            title="AIGC 回调、用户 ID、轮询地址等"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">接口设置</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 pl-2 sm:pl-3.5 pr-2 sm:pr-4 rounded-xl bg-white/[0.04] text-sm font-medium text-zinc-300 hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">0</span>
          </button>
          <button
            type="button"
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold bg-gradient-to-br from-zinc-500 to-teal-700 shadow-lg shadow-black/30 hover:brightness-110 transition-all"
            title="用户"
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
          className="fixed inset-0 top-12 sm:top-[52px] z-30 bg-black/50 lg:hidden"
          onClick={() => { setLeftDrawerOpen(false); setRightDrawerOpen(false); }}
        />
      )}

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="aigc-settings-title"
        >
          <div className="w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0e1118] shadow-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 id="aigc-settings-title" className="text-lg font-semibold text-white">
                接口设置（存本机浏览器）
              </h2>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                关闭
              </button>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              与 curl 一致：<strong className="text-zinc-400">callback_url</strong> 与{' '}
              <strong className="text-zinc-400">user_id</strong> 至少二选一来源：本页填写或服务端 .env。点「保存」会写入本机；不点保存直接点「生成」也会用当前输入框里的内容发请求。
              任务查询 URL 须含 <code className="text-teal-400/90">{'{task_id}'}</code>。
            </p>
            <label className="block space-y-1">
              <span className="text-xs text-zinc-400">callback_url</span>
              <input
                className="w-full rounded-lg bg-black/30 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
                placeholder="https://你的服务/aigc/callback"
                value={aigcForm.callback_url ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, callback_url: e.target.value }))}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-zinc-400">user_id</span>
              <input
                className="w-full rounded-lg bg-black/30 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100"
                placeholder="如 12343211"
                value={aigcForm.user_id ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, user_id: e.target.value }))}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="text-xs text-zinc-400">app_id（可选）</span>
                <input
                  className="w-full rounded-lg bg-black/30 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100"
                  placeholder="arena"
                  value={aigcForm.app_id ?? ''}
                  onChange={(e) => setAigcForm((f) => ({ ...f, app_id: e.target.value }))}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-zinc-400">tenant_id（可选）</span>
                <input
                  className="w-full rounded-lg bg-black/30 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100"
                  placeholder="arena"
                  value={aigcForm.tenant_id ?? ''}
                  onChange={(e) => setAigcForm((f) => ({ ...f, tenant_id: e.target.value }))}
                />
              </label>
            </div>
            <label className="block space-y-1">
              <span className="text-xs text-zinc-400">model_version_id（可选，默认 kling-video-o1）</span>
              <input
                className="w-full rounded-lg bg-black/30 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100"
                placeholder="kling-video-o1"
                value={aigcForm.model_version_id ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, model_version_id: e.target.value }))}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-zinc-400">任务查询 URL（轮询，须含 {'{task_id}'}；不填则用默认）</span>
              <input
                className="w-full rounded-lg bg-black/30 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
                placeholder="https://artface.linkv.live/api/v1/task/detail/query/{task_id}"
                value={aigcForm.task_query_url ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, task_query_url: e.target.value }))}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-zinc-400">API Key（可选，Bearer；创建与轮询共用）</span>
              <input
                type="password"
                className="w-full rounded-lg bg-black/30 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100"
                placeholder="留空则用服务端环境变量"
                value={aigcForm.api_key ?? ''}
                onChange={(e) => setAigcForm((f) => ({ ...f, api_key: e.target.value }))}
                autoComplete="off"
              />
            </label>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={persistAigcForm}
                className="flex-1 min-w-[80px] h-10 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium"
              >
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
                className="h-10 px-4 rounded-xl border border-white/[0.08] text-zinc-300 text-sm hover:bg-white/[0.06] transition-colors"
                title="将 callback_url、user_id 恢复为当前默认并写入本机"
              >
                恢复默认
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="h-10 px-4 rounded-xl border border-white/[0.08] text-zinc-300 text-sm hover:bg-white/[0.06] transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex min-h-0 overflow-hidden min-w-0 relative">
      {/* 左侧：小屏为抽屉，lg 及以上为常驻 */}
      <aside
        className={`fixed lg:relative left-0 top-12 sm:top-[52px] lg:top-0 bottom-0 z-40 lg:z-auto w-72 max-w-[85vw] lg:w-[300px] xl:w-[380px] lg:max-w-none flex-shrink-0 flex flex-col min-h-0 border-r border-white/[0.08] bg-[#0a0c10] pr-0 overflow-hidden transition-transform duration-200 ease-out ${
          leftDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-2 sm:px-3 py-2 sm:py-3 border-b border-white/[0.08] flex-shrink-0 flex items-center justify-between gap-2">
          <Link
            href="/editor"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-teal-400 text-xs sm:text-sm font-medium py-1.5 px-2 -ml-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            title="返回编辑器"
          >
            <ChevronLeft className="w-4 h-4" />
            返回
          </Link>
          <button
            type="button"
            onClick={() => setLeftDrawerOpen(false)}
            className="lg:hidden h-8 w-8 rounded-lg bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center"
            title="收起"
            aria-label="收起模板栏"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-shrink-0 overflow-x-auto border-b border-white/[0.08]">
          <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-3 min-w-0">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const isActive = templateCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setTemplateCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-400 ring-1 ring-teal-400/30'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar p-2 sm:p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                className="group/card rounded-xl overflow-hidden ring-1 ring-white/[0.08] hover:ring-2 hover:ring-teal-400/50 hover:shadow-[0_0_24px_-6px_rgba(45,212,191,0.25)] transition-all duration-200 hover:scale-[1.02]"
              >
                <button
                  type="button"
                  className="w-full text-left block"
                >
                  <div className="relative aspect-[4/5] bg-zinc-800 overflow-hidden rounded-xl">
                    <img src={t.thumb} alt={t.name} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                      <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/30">
                        使用
                      </span>
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center min-h-[2rem] py-1.5 px-2 bg-black/55 backdrop-blur-sm">
                      <p className="text-xs font-medium text-zinc-300 leading-tight line-clamp-2 text-center w-full">
                        {t.name}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-zinc-600 text-xs">该分类暂无模板</div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-[#0c0e12] relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.08),transparent)]" aria-hidden />
        <div className="w-full max-w-5xl mx-auto min-w-0 flex-1 min-h-0 relative z-[1] px-2 sm:px-3 md:px-4">
          <div
            ref={taskScrollRef}
            onScroll={handleTaskScroll}
            className="h-full min-h-0 overflow-y-auto overflow-x-hidden sidebar-scrollbar snap-y snap-mandatory scroll-smooth pb-[min(260px,32vh)] sm:pb-[min(300px,38vh)]"
          >
            {generatedList.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-full text-zinc-600 text-sm px-4">
                <p className="text-center max-w-xs leading-relaxed">暂无生产历史，在下方输入后生成</p>
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
                return (
                  <section
                    key={item.id}
                    data-task-id={item.id}
                    data-task-slide
                    className="snap-start snap-always min-h-0 flex flex-col box-border py-2 sm:py-3 pr-1"
                  >
                    <div className="shrink-0 mb-1.5 sm:mb-2 space-y-2">
                      <div className="flex gap-3 items-start">
                        {(item.sourceImageUrl || item.sourceImageUrls?.[0] || item.referencePreviewUrl) && (
                          <img
                            src={item.sourceImageUrl || item.sourceImageUrls?.[0] || item.referencePreviewUrl}
                            alt="参考图"
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg sm:rounded-xl object-cover border border-white/[0.08]"
                          />
                        )}
                        <p className="text-sm sm:text-[15px] text-zinc-300 leading-relaxed line-clamp-3 flex-1 min-w-0">{item.prompt}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                        {item.modelTag && (
                          <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-xs text-zinc-400 border border-white/[0.08]">{item.modelTag}</span>
                        )}
                        {item.resolution && (
                          <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-xs text-zinc-400 border border-white/[0.08]">
                            {item.resolution}
                          </span>
                        )}
                        {item.klingMode && (
                          <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-xs text-zinc-400 border border-white/[0.08]">
                            {item.klingMode === 'pro' ? '1080p' : '720p'}
                          </span>
                        )}
                        {item.duration && (
                          <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-xs text-zinc-400 border border-white/[0.08]">{item.duration}</span>
                        )}
                        <span className="flex items-center gap-1 sm:gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={() => handleEditTask(item)}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center transition-colors"
                            title="编辑：带到下方输入框"
                          >
                            <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCreate(item)}
                            disabled={isSubmitting}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center transition-colors disabled:opacity-50"
                            title="再次生成"
                          >
                            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1.5 sm:mt-2 min-h-0">
                      <div className="w-full max-w-full mx-auto rounded-2xl ring-1 ring-white/[0.08] bg-zinc-950/95 shadow-xl flex flex-col overflow-hidden">
                        {failed ? (
                          <div className="aspect-video max-h-[min(56vh,500px)] lg:max-h-[min(48vh,480px)] flex flex-col items-center justify-center gap-3 bg-zinc-900/90 px-6 rounded-2xl">
                            <p className="text-sm text-red-400/90 text-center">{item.errorMessage || '生成失败'}</p>
                            <button
                              type="button"
                              onClick={() => void handleRetryTask(item)}
                              disabled={isSubmitting}
                              className="h-9 px-4 rounded-xl bg-white/[0.06] text-sm text-zinc-300 hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
                            >
                              重试
                            </button>
                          </div>
                        ) : submitted ? (
                          <div className="aspect-video max-h-[min(56vh,500px)] lg:max-h-[min(48vh,480px)] flex flex-col items-center justify-center gap-3 bg-zinc-900/90 px-6 rounded-2xl border border-teal-500/20">
                            <p className="text-sm text-teal-400/90 text-center font-medium">任务已提交上游</p>
                            {item.remoteTaskId && (
                              <p className="text-xs text-zinc-500 font-mono break-all text-center">task_id: {item.remoteTaskId}</p>
                            )}
                            <p className="text-xs text-zinc-400 text-center leading-relaxed max-w-md">
                              {item.errorMessage}
                            </p>
                            <p className="text-xs text-zinc-500 text-center">
                              成片由上游 POST 到你在服务端配置的 callback_url；若需本页自动出视频，请在 .env 配置 AIGC_TASK_QUERY_URL。
                            </p>
                          </div>
                        ) : gen ? (
                          <div className="aspect-video max-h-[min(56vh,500px)] lg:max-h-[min(48vh,480px)] flex items-center justify-center bg-zinc-900/80 w-full overflow-hidden rounded-2xl">
                            <div className="flex flex-col items-center gap-3 text-teal-400">
                              <Loader2 className="w-12 h-12 animate-spin opacity-90" />
                              <span className="text-sm text-zinc-400">生成中，可关闭页面稍后查看历史</span>
                            </div>
                          </div>
                        ) : showVideo ? (
                          <div className="flex flex-col overflow-hidden rounded-2xl">
                            <video
                              src={item.videoUrl}
                              poster={item.thumbnailUrl}
                              controls
                              playsInline
                              className="w-full max-h-[min(56vh,500px)] lg:max-h-[min(48vh,480px)] bg-black object-contain rounded-2xl"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="relative w-full aspect-video max-h-[min(56vh,500px)] lg:max-h-[min(48vh,480px)] bg-black overflow-hidden rounded-t-2xl shrink-0">
                              <img src={item.thumbnailUrl} alt="" className="w-full h-full object-contain" />
                              <button
                                type="button"
                                onClick={() => setPlayer(item.id, { playing: !playing })}
                                className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/10 to-transparent hover:via-black/20 transition-all"
                                aria-label={playing ? '暂停' : '播放'}
                              >
                                <span className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-xl shadow-black/40 hover:scale-105 transition-transform">
                                  {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                                </span>
                              </button>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 backdrop-blur-xl bg-zinc-950/95 border-t border-white/[0.08] flex-wrap rounded-b-2xl">
                              <button
                                type="button"
                                onClick={() => setPlayer(item.id, { playing: !playing })}
                                className="flex-shrink-0 w-9 h-9 rounded-full bg-white/[0.1] flex items-center justify-center text-white hover:bg-white/[0.18] border border-white/[0.08]"
                                aria-label={playing ? '暂停' : '播放'}
                              >
                                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                              </button>
                              <span className="text-xs text-zinc-500 tabular-nums flex-shrink-0 w-8">{formatTime(cur)}</span>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={progress}
                                onChange={(e) => setPlayer(item.id, { progress: Number(e.target.value) })}
                                className="flex-1 min-w-[72px] h-1 rounded-full appearance-none bg-zinc-700/80 accent-teal-400 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                              />
                              <span className="text-xs text-zinc-500 tabular-nums flex-shrink-0 w-8">{formatTime(dur)}</span>
                              <div className="flex items-center flex-shrink-0 w-full sm:w-auto sm:ml-auto justify-end">
                                <button type="button" className="h-8 w-8 rounded-xl bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center transition-colors" title="更多">
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {showDailyScrollHint && newestId === item.id && (
                      <p className="shrink-0 text-center text-xs text-zinc-500 mt-2 sm:mt-3 pb-1">
                        上下滑动切换任务
                      </p>
                    )}
                  </section>
                );
              })
            )}
          </div>

          {/* 悬浮输入层：上滑浏览历史时收起的胶囊条 / 默认展开大面板 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-2 sm:px-0 pb-2 sm:pb-3 pt-6 sm:pt-8 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/95 to-transparent">
            {inputBarCollapsed && generatedList.length > 0 && (
              <div className="pointer-events-auto flex flex-col items-end w-full max-w-2xl px-1 mb-1">
                <button
                  type="button"
                  onClick={scrollToLatestTask}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-teal-400 py-1 pr-1 transition-colors"
                >
                  回到底部
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div
              className={`pointer-events-auto w-full border border-white/[0.08] ring-1 ring-white/[0.06] backdrop-blur-2xl ${
                inputBarCollapsed && generatedList.length > 0
                  ? 'max-w-2xl rounded-2xl border-white/[0.08] bg-[#0e1118]/95 shadow-xl px-2 sm:px-3 py-1.5 sm:py-2'
                  : 'rounded-xl sm:rounded-2xl bg-[#0e1118]/95 shadow-xl overflow-hidden'
              }`}
            >
              {inputBarCollapsed && generatedList.length > 0 ? (
                <div className="flex items-center gap-2 min-h-[44px]">
                  <button
                    type="button"
                    onClick={() => setInputBarCollapsed(false)}
                    className="flex-shrink-0 w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:bg-white/[0.12]"
                    title="展开"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputBarCollapsed(false)}
                    className="flex-1 min-w-0 text-left text-sm text-zinc-400 truncate py-2"
                  >
                    {prompt.trim() || '试试描述一段简短的故事情节…'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCreate()}
                    disabled={isSubmitting || !prompt.trim()}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white disabled:opacity-50 shadow-md"
                    title="生成"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="overflow-hidden">
                    <div className="flex gap-2 sm:gap-2.5 px-0 pt-0 pb-2 sm:pb-3 flex-wrap items-center">
                      <button type="button" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl bg-white/[0.04] text-zinc-500 hover:text-teal-400 hover:bg-teal-500/10 text-xs flex flex-col items-center justify-center gap-0.5 border border-white/[0.08] transition-colors">
                        <Plus className="w-4 h-4" />
                        特效
                      </button>
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
                        className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl text-xs flex flex-col items-center justify-center gap-0.5 border transition-colors disabled:opacity-50 ${
                          referenceImages.length > 0 || referenceImageUrls.length > 0
                            ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
                            : 'bg-white/[0.04] text-zinc-500 hover:text-teal-400 hover:bg-teal-500/10 border-white/[0.08]'
                        }`}
                        title="选择参考图后为图生图模式，最多 7 张"
                      >
                        <ImagePlus className="w-4 h-4" />
                        参考
                      </button>
                      {referenceImageUrls.map((url, idx) => (
                        <div key={`url-${idx}`} className="relative flex-shrink-0">
                          <img
                            src={url}
                            alt={`参考图 ${idx + 1}`}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover border border-white/[0.08] ring-1 ring-white/[0.04]"
                          />
                          <button
                            type="button"
                            onClick={() => setReferenceImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-zinc-800/95 border border-white/[0.12] flex items-center justify-center text-zinc-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            title="移除参考图"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {referenceImages.map((r, idx) => (
                        <div key={idx} className="relative flex-shrink-0">
                          <img
                            src={r.previewUrl}
                            alt={`参考图 ${idx + 1}`}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover border border-white/[0.08] ring-1 ring-white/[0.04]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(r.previewUrl);
                              setReferenceImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-zinc-800/95 border border-white/[0.12] flex items-center justify-center text-zinc-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            title="移除参考图"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value.slice(0, 2500))}
                      placeholder="正向提示词（文生视频），主体、环境、时间、风格等，最多 2500 字"
                      className="w-full min-h-[88px] px-1 py-2 bg-transparent text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none text-[15px] leading-relaxed"
                      maxLength={2500}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 pt-2 sm:pt-1 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap order-2 sm:order-1">
                      <span className="text-xs text-zinc-500 shrink-0 hidden sm:inline">Kling O1</span>
                      <select
                        value={klingAspectRatio}
                        onChange={(e) => setKlingAspectRatio(e.target.value as (typeof KLING_ASPECT)[number])}
                        className="h-9 px-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
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
                        className="h-9 px-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
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
                        className="h-9 px-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
                        title="模式"
                      >
                        <option value="std">720p</option>
                        <option value="pro">1080p</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt('');
                          setKlingAspectRatio('16:9');
                          setKlingDuration('5');
                          setKlingMode('std');
                          referenceImages.forEach((r) => URL.revokeObjectURL(r.previewUrl));
                          setReferenceImages([]);
                          setReferenceImageUrls([]);
                        }}
                        className="h-9 w-9 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] flex items-center justify-center transition-colors"
                        title="恢复输入框到默认"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 order-1 sm:order-2">
                      <span className="text-xs text-zinc-600 tabular-nums">{prompt.length}/2500</span>
                      <button
                        type="button"
                        onClick={() => void handleCreate()}
                        disabled={isSubmitting || !prompt.trim()}
                        className="h-10 min-w-[88px] sm:min-w-0 px-4 sm:px-6 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-colors"
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
        className={`fixed lg:relative right-0 top-12 sm:top-[52px] lg:top-0 bottom-0 z-40 lg:z-auto w-72 max-w-[85vw] lg:w-56 xl:w-72 lg:max-w-none flex-shrink-0 flex flex-col min-h-0 border-l border-white/[0.08] bg-[#0a0c10] transition-transform duration-200 ease-out ${
          rightDrawerOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-3 py-3 border-b border-white/[0.08] flex-shrink-0 space-y-3 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.08] flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setRightPanelMode('history')}
              className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors ${
                rightPanelMode === 'history'
                  ? 'bg-white/[0.08] text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              历史
            </button>
            <button
              type="button"
              onClick={() => setRightPanelMode('assets')}
              className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors ${
                rightPanelMode === 'assets'
                  ? 'bg-white/[0.08] text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              资产
            </button>
            </div>
            <button
              type="button"
              onClick={() => setRightDrawerOpen(false)}
              className="lg:hidden h-8 w-8 rounded-lg bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center shrink-0"
              title="收起"
              aria-label="收起历史栏"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {rightPanelMode === 'assets' && (
            <p className="text-xs text-zinc-500 leading-relaxed px-0.5">
              拖拽缩略图到桌面或应用；复制链接可粘贴到剪贴板。
            </p>
          )}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder={rightPanelMode === 'assets' ? '搜索资产…' : '搜索'}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
              />
            </div>
            <button type="button" className="h-9 w-9 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] flex items-center justify-center shrink-0 transition-colors" title="日期">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          {generatedList.length === 0 && (
            <button
              type="button"
              onClick={handleLoadHistory}
              className="w-full h-8 rounded-xl border border-white/[0.08] bg-white/[0.04] text-xs font-medium text-zinc-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors"
            >
              加载历史
            </button>
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar px-3 py-3">
          {generatedList.length === 0 ? (
            <div className="text-center py-10 px-2 space-y-3">
              <p className="text-zinc-600 text-xs">暂无记录</p>
              <button
                type="button"
                onClick={handleLoadHistory}
                className="text-sm font-medium text-teal-400 hover:text-teal-300 border border-teal-500/30 hover:bg-teal-500/10 rounded-xl px-4 py-2 transition-colors"
              >
                加载历史
              </button>
            </div>
          ) : sidebarItems.length === 0 ? (
            <div className="text-center py-10 text-zinc-600 text-xs">无匹配项</div>
          ) : rightPanelMode === 'history' ? (
            <ul className="space-y-2.5">
              {sidebarItems.map((item) => {
                const isActive = selectedId === item.id;
                const isGeneratingThis = isItemGenerating(item);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id);
                        scrollTaskIntoView(item.id);
                        setRightDrawerOpen(false);
                      }}
                      className={`relative w-full rounded-xl overflow-hidden text-left transition-colors ${
                        isActive
                          ? 'bg-teal-500/10 ring-2 ring-teal-400/50'
                          : 'bg-white/[0.04] hover:bg-white/[0.06] ring-1 ring-white/[0.08] hover:ring-white/[0.1]'
                      }`}
                    >
                      <div className="aspect-video bg-zinc-800 relative">
                        {isGeneratingThis ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1]">
                            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                          </div>
                        ) : null}
                        <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-zinc-300 line-clamp-2 leading-snug">{item.prompt}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                          {item.modelTag && <span>{item.modelTag}</span>}
                          <span className="ml-auto">{timeAgo(item.createdAt)}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = selectedId === item.id;
                const isGeneratingThis = isItemGenerating(item);
                return (
                  <li key={item.id}>
                    <div
                      className={`flex items-center gap-2 rounded-xl px-2 py-2 transition-colors ${
                        isActive
                          ? 'bg-teal-500/10 ring-2 ring-teal-400/50'
                          : 'bg-white/[0.04] hover:bg-white/[0.06] ring-1 ring-transparent border border-transparent'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(item.id);
                          scrollTaskIntoView(item.id);
                          setRightDrawerOpen(false);
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-white/[0.08]">
                          {isGeneratingThis ? (
                            <div className="absolute inset-0 z-[1] flex items-center justify-center bg-black/50">
                              <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
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
                          <p className="truncate text-xs leading-tight text-zinc-300">{item.prompt}</p>
                          <p className="mt-0.5 text-xs text-zinc-500">{timeAgo(item.createdAt)}</p>
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
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.08] hover:text-teal-400 transition-colors"
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
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.08] hover:text-teal-400 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {copiedId === item.id && (
                      <p className="pr-1 pb-1 text-right text-xs text-teal-500/90">已复制链接</p>
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
