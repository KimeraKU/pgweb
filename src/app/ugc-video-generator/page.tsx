'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Download,
  ImagePlus,
  Languages,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  Upload,
  Video,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Language } from '@/lib/i18n';
import {
  loadUGCVideoHistory,
  saveUGCVideoHistory,
} from '@/lib/ugc-video-history-idb';

type AssetMode = 'none' | 'preset' | 'custom';
type TaskStatus = 'draft' | 'image_generating' | 'image_ready' | 'image_confirmed' | 'video_prompting' | 'video_reviewing' | 'video_generating' | 'submitted' | 'completed' | 'failed';

type PresetAsset = {
  id: string;
  name: string;
  imageUrl: string;
};

type GeneratedCandidate = {
  id: string;
  imageUrl?: string;
  prompt: string;
  status: 'pending' | 'success' | 'failed';
  errorMessage?: string;
};

type ImageGenerationRun = {
  id: string;
  createdAt: number;
  creativePrompt: string;
  candidates: GeneratedCandidate[];
  status: Extract<TaskStatus, 'image_generating' | 'image_ready' | 'failed'>;
  selectedCandidateId: string | null;
  generationCount: number;
  aspectRatio: string;
  errorMessage?: string;
};

type VideoTask = {
  id: string;
  productName: string;
  sourceImageUrl: string;
  videoUrl?: string;
  coverUrl?: string;
  prompt: string;
  status: Extract<TaskStatus, 'video_prompting' | 'video_reviewing' | 'video_generating' | 'submitted' | 'completed' | 'failed'>;
  remoteTaskId?: string;
  errorMessage?: string;
  createdAt: number;
};

type FlowStep = 'image' | 'video';
type PickerKind = 'model' | 'scene' | null;
type PromptModalKind = 'image' | 'video' | null;

const MODEL_PRESETS: PresetAsset[] = [
  {
    id: 'model-01',
    name: '模特 1',
    imageUrl: 'https://liveme-aiphoto-test.oss-us-east-1.aliyuncs.com/system/ac38faffe84db84c1b49d9885f56668d.png',
  },
  {
    id: 'model-02',
    name: '模特 2',
    imageUrl: 'https://liveme-aiphoto-test.oss-us-east-1.aliyuncs.com/system/d977f2cf1c45ed5b87bf55843bd7500b.png',
  },
  {
    id: 'model-03',
    name: '模特 3',
    imageUrl: 'https://liveme-aiphoto-test.oss-us-east-1.aliyuncs.com/system/f7940ba598498591c54d881cf6e2d2be.png',
  },
  {
    id: 'model-04',
    name: '模特 4',
    imageUrl: 'https://liveme-aiphoto-test.oss-us-east-1.aliyuncs.com/system/111d66c03b4fffaea51c118ade7b5f6a.png',
  },
  {
    id: 'model-05',
    name: '模特 5',
    imageUrl: 'https://liveme-aiphoto-test.oss-us-east-1.aliyuncs.com/system/05d9b25a307cc041b04f942d82940204.png',
  },
  {
    id: 'model-06',
    name: '模特 6',
    imageUrl: 'https://liveme-aiphoto-test.oss-us-east-1.aliyuncs.com/system/fcbe16b1cd546732bec8b21cc5c2bcf8.png',
  },
  {
    id: 'model-07',
    name: '模特 7',
    imageUrl: 'https://liveme-aiphoto-test.oss-us-east-1.aliyuncs.com/system/80089cb127d50560afb35c0a239759ca.jpg',
  },
];

const SCENE_PRESETS: PresetAsset[] = [
  {
    id: 'scene-forest',
    name: '森林',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=240&h=240&fit=crop',
  },
  {
    id: 'scene-studio',
    name: '影棚',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=240&h=240&fit=crop',
  },
  {
    id: 'scene-street',
    name: '街景',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=240&h=240&fit=crop',
  },
];

const PLACEHOLDER_PRODUCTS = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=720&h=720&fit=crop',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=720&h=720&fit=crop',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=720&h=720&fit=crop',
];

const ASPECT_RATIO_OPTIONS = ['1:1', '3:4', '4:3', '9:16', '16:9', '4:5', '5:4', '2:3', '3:2'] as const;

function formatTime(ts: number, language: Language) {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(ts);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const VIDEO_POLL_MAX = 600;
const IMAGE_POLL_MAX = 600;
const IMAGE_POLL_INTERVAL_MS = 3000;
const IMAGE_QUERY_RETRY_LIMIT = 10;

function UGCVideoGeneratorPageContent() {
  const { language, setLanguage, t } = useLanguage();
  const productInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const sceneInputRef = useRef<HTMLInputElement>(null);
  const modelPickerRef = useRef<HTMLDivElement>(null);
  const scenePickerRef = useRef<HTMLDivElement>(null);
  const imageFormSectionRef = useRef<HTMLElement>(null);
  const videoPollTimersRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  const videoPollCountRef = useRef<Map<string, number>>(new Map());

  const [status, setStatus] = useState<TaskStatus>('draft');
  const [productName, setProductName] = useState('');
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [productImagePublicUrl, setProductImagePublicUrl] = useState<string | null>(null);
  const [productFileName, setProductFileName] = useState('');
  const [modelMode, setModelMode] = useState<AssetMode>('none');
  const [modelPresetId, setModelPresetId] = useState(MODEL_PRESETS[0].id);
  const [customModelFile, setCustomModelFile] = useState<File | null>(null);
  const [customModelUrl, setCustomModelUrl] = useState<string | null>(null);
  const [sceneMode, setSceneMode] = useState<AssetMode>('none');
  const [scenePresetId, setScenePresetId] = useState(SCENE_PRESETS[0].id);
  const [customSceneFile, setCustomSceneFile] = useState<File | null>(null);
  const [customSceneUrl, setCustomSceneUrl] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<PickerKind>(null);
  const [aspectRatio, setAspectRatio] = useState<(typeof ASPECT_RATIO_OPTIONS)[number]>('1:1');
  const [generationCount, setGenerationCount] = useState(3);
  const [imageCandidates, setImageCandidates] = useState<GeneratedCandidate[]>([]);
  const [imageRuns, setImageRuns] = useState<ImageGenerationRun[]>([]);
  const [activeImageRunId, setActiveImageRunId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [confirmedCandidateId, setConfirmedCandidateId] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<FlowStep>('image');
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [promptModal, setPromptModal] = useState<PromptModalKind>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoTasks, setVideoTasks] = useState<VideoTask[]>([]);
  const [activeVideoTaskId, setActiveVideoTaskId] = useState<string | null>(null);
  const [imageStageHeight, setImageStageHeight] = useState<number | null>(null);
  const [historyHydrated, setHistoryHydrated] = useState(false);

  const selectedModelPreset = MODEL_PRESETS.find((item) => item.id === modelPresetId) || MODEL_PRESETS[0];
  const selectedScenePreset = SCENE_PRESETS.find((item) => item.id === scenePresetId) || SCENE_PRESETS[0];

  const activeImageRun = imageRuns.find((item) => item.id === activeImageRunId) || null;
  const activeVideoTask = videoTasks.find((item) => item.id === activeVideoTaskId) || null;
  const displayedCandidates = activeImageRun?.candidates || imageCandidates;
  const displayedImageStatus = activeImageRun?.status || status;
  const selectedCandidate = displayedCandidates.find((item) => item.id === selectedCandidateId) || null;
  const activePreviewImage =
    selectedCandidate?.imageUrl || productImageUrl || PLACEHOLDER_PRODUCTS[0];
  const currentModelLabel =
    modelMode === 'preset' ? selectedModelPreset.name : modelMode === 'custom' ? t.ugcVideoCustomModel : t.ugcVideoNone;
  const currentSceneLabel =
    sceneMode === 'preset' ? selectedScenePreset.name : sceneMode === 'custom' ? t.ugcVideoCustomScene : t.ugcVideoNone;
  const currentModelImage = modelMode === 'preset' ? selectedModelPreset.imageUrl : customModelUrl;
  const currentSceneImage = sceneMode === 'preset' ? selectedScenePreset.imageUrl : customSceneUrl;
  const activePickerPresets = pickerOpen === 'model' ? MODEL_PRESETS : SCENE_PRESETS;
  const activePickerSelectedId = pickerOpen === 'model' ? (modelMode === 'preset' ? modelPresetId : null) : sceneMode === 'preset' ? scenePresetId : null;
  const creativePromptPlaceholder = t.ugcVideoCreativePromptPlaceholder;
  const isUserCreativePrompt = (candidateValue: string, candidates: Array<{ prompt: string }>) => {
    const next = candidateValue.trim();
    if (!next) return false;
    return !candidates.some((candidate) => candidate.prompt.trim() === next);
  };

  useEffect(() => {
    return () => {
      videoPollTimersRef.current.forEach((timer) => clearInterval(timer));
      videoPollTimersRef.current.clear();
      videoPollCountRef.current.clear();
    };
  }, []);

  useEffect(() => {
    return () => {
      [productImageUrl, customModelUrl, customSceneUrl].forEach((url) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [productImageUrl, customModelUrl, customSceneUrl]);

  useEffect(() => {
    if (status === 'video_prompting' || status === 'video_reviewing' || status === 'video_generating' || status === 'submitted' || status === 'completed') {
      setActiveFlow('video');
    }
  }, [status]);

  useEffect(() => {
    if (!promptModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [promptModal]);

  useEffect(() => {
    if (activeFlow !== 'image') return;
    const el = imageFormSectionRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const update = () => setImageStageHeight(el.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeFlow, productImageUrl, productName, modelMode, sceneMode, pickerOpen, generationCount, aspectRatio]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const activeRef = pickerOpen === 'model' ? modelPickerRef.current : scenePickerRef.current;
      if (activeRef && !activeRef.contains(target)) {
        setPickerOpen(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [pickerOpen]);

  useEffect(() => {
    let cancelled = false;

    const hydrateHistory = async () => {
      const snapshot = await loadUGCVideoHistory();
      if (cancelled) return;

      if (snapshot) {
        const allCandidates = snapshot.imageRuns.flatMap((run) => run.candidates);
        if (isUserCreativePrompt(snapshot.creativePrompt || '', allCandidates)) {
          setProductName(snapshot.creativePrompt);
        }
        setImageRuns(snapshot.imageRuns);
        setVideoTasks(snapshot.videoTasks);

        const firstRun = snapshot.imageRuns[0];
        if (firstRun) {
          setActiveImageRunId(firstRun.id);
          if (isUserCreativePrompt(firstRun.creativePrompt || '', firstRun.candidates)) {
            setProductName((prev) => (prev.trim() ? prev : firstRun.creativePrompt || ''));
          }
          const candidateId = firstRun.selectedCandidateId || firstRun.candidates[0]?.id || null;
          setSelectedCandidateId(candidateId);

          const promptCandidate =
            firstRun.candidates.find((item) => item.id === candidateId && item.prompt) ||
            firstRun.candidates.find((item) => item.prompt);
          if (promptCandidate?.prompt) {
            setImagePrompt(promptCandidate.prompt);
          }
        }

        const firstVideoTask = snapshot.videoTasks[0];
        if (firstVideoTask) {
          setActiveVideoTaskId(firstVideoTask.id);
        }
      }

      setHistoryHydrated(true);
    };

    void hydrateHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!historyHydrated) return;

    const timer = window.setTimeout(() => {
      void saveUGCVideoHistory({ creativePrompt: productName, imageRuns, videoTasks });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [historyHydrated, productName, imageRuns, videoTasks]);

  const handleLocalUpload = (
    file: File | undefined,
    setter: (url: string | null) => void,
    previousUrl: string | null,
    nameSetter?: (value: string) => void,
    fileSetter?: (value: File | null) => void
  ) => {
    if (!file) return;
    if (previousUrl?.startsWith('blob:')) URL.revokeObjectURL(previousUrl);
    const objectUrl = URL.createObjectURL(file);
    setter(objectUrl);
    nameSetter?.(file.name);
    fileSetter?.(file);
  };

  const clearAssetSelection = (kind: Exclude<PickerKind, null>) => {
    if (kind === 'model') {
      if (customModelUrl?.startsWith('blob:')) URL.revokeObjectURL(customModelUrl);
      setCustomModelUrl(null);
      setCustomModelFile(null);
      setModelMode('none');
    } else {
      if (customSceneUrl?.startsWith('blob:')) URL.revokeObjectURL(customSceneUrl);
      setCustomSceneUrl(null);
      setCustomSceneFile(null);
      setSceneMode('none');
    }
    setPickerOpen(null);
  };

  const renderAssetPicker = (kind: Exclude<PickerKind, null>) => {
    if (pickerOpen !== kind) return null;
    const presets = kind === 'model' ? MODEL_PRESETS : SCENE_PRESETS;
    const selectedId = kind === 'model' ? (modelMode === 'preset' ? modelPresetId : null) : sceneMode === 'preset' ? scenePresetId : null;
    const isCustomSelected = kind === 'model' ? modelMode === 'custom' : sceneMode === 'custom';
    return (
      <div className="absolute top-full left-0 right-0 z-20 mt-2 rounded-[20px] border border-white/10 bg-[#2b2b2f] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-white/90">{kind === 'model' ? t.ugcVideoPickerModel : t.ugcVideoPickerScene}</p>
          <button
            type="button"
            onClick={() => clearAssetSelection(kind)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 hover:bg-white/10"
          >
            {t.ugcVideoSetNone}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => (kind === 'model' ? modelInputRef.current?.click() : sceneInputRef.current?.click())}
              className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[10px] border transition-colors ${
                isCustomSelected ? 'border-white bg-white/[0.08]' : 'border-transparent bg-white/10 hover:bg-white/15'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-white/80">
                <Upload className="h-5 w-5" />
              </div>
              {isCustomSelected && <div className="pointer-events-none absolute inset-0 rounded-[10px] ring-2 ring-inset ring-white" />}
            </button>
            <p className={`text-center text-[14px] ${isCustomSelected ? 'text-white' : 'text-white/70'}`}>{t.ugcVideoCustomization}</p>
          </div>
          {presets.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <div key={item.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (kind === 'model') {
                      setModelPresetId(item.id);
                      setModelMode('preset');
                    } else {
                      setScenePresetId(item.id);
                      setSceneMode('preset');
                    }
                    setPickerOpen(null);
                  }}
                  className={`relative aspect-square w-full overflow-hidden rounded-[10px] border transition-colors ${
                    isSelected ? 'border-white' : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  {isSelected && <div className="pointer-events-none absolute inset-0 rounded-[10px] ring-2 ring-inset ring-white" />}
                </button>
                <p className={`text-center text-[14px] ${isSelected ? 'text-white' : 'text-white/70'}`}>{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const uploadPublicAsset = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file, file.name || 'image.jpg');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !json.url) {
      throw new Error(json.error || '上传图片失败');
    }
    return json.url;
  };

  const refineCreativePrompt = async (candidateIndex: number, totalCount: number) => {
    let lastError = '创意提示词优化失败';
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const res = await fetch('/api/ugc/refine-image-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creativePrompt: productName,
          modelName: modelMode === 'preset' ? selectedModelPreset.name : modelMode === 'custom' ? t.ugcVideoCustomModel : '',
          sceneName: sceneMode === 'preset' ? selectedScenePreset.name : sceneMode === 'custom' ? t.ugcVideoCustomScene : '',
          aspectRatio,
          candidateIndex,
          totalCount,
        }),
      });
      const json = (await res.json()) as { prompt?: string; error?: string };
      if (res.ok && json.prompt) {
        return json.prompt;
      }
      lastError = json.error || lastError;
      if (attempt < 2) {
        await sleep(500 * (attempt + 1));
      }
    }
    throw new Error(lastError);
  };

  const waitForGeminiResult = async (idTask: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let transientErrors = 0;
    for (let i = 0; i < IMAGE_POLL_MAX; i += 1) {
      try {
        const res = await fetch('/api/query-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_task: idTask, model: 'gemini-3-pro-image-preview' }),
        });
        const json = (await res.json()) as { status?: string; image_url?: string | null; error?: string };
        if (!res.ok) {
          transientErrors += 1;
          if (transientErrors >= IMAGE_QUERY_RETRY_LIMIT) {
            await sleep(IMAGE_POLL_INTERVAL_MS);
            continue;
          }
          await sleep(1500);
          continue;
        }
        transientErrors = 0;
        const statusText = (json.status || '').trim().toLowerCase();
        const statusTokens = statusText.split(/[^a-z0-9]+/).filter(Boolean);
        const failedTokens = new Set(['failed', 'fail', 'canceled', 'cancelled', 'cancel', 'aborted']);
        const isFailedStatus =
          statusText === 'error' ||
          statusTokens.some((token) => failedTokens.has(token));
        const isSuccessStatus =
          statusText.includes('completed') ||
          statusText.includes('succeeded') ||
          statusText.includes('success') ||
          statusText.includes('done') ||
          statusText.includes('finished');
        const isProcessingStatus =
          statusText.includes('processing') ||
          statusText.includes('pending') ||
          statusText.includes('running') ||
          statusText.includes('queue') ||
          statusText.includes('wait') ||
          statusText.includes('submitted') ||
          statusText.includes('review');

        // Some providers return "succeeded/success/done" instead of "completed".
        // Only treat result URL as ready when status is success-like (or empty/unknown but non-processing).
        if (json.image_url && (isSuccessStatus || (!statusText || !isProcessingStatus) && !isFailedStatus)) {
          return json.image_url;
        }
        if (isFailedStatus) {
          throw new Error('Gemini 3 Pro 生成失败');
        }
      } catch (error) {
        transientErrors += 1;
        if (transientErrors >= IMAGE_QUERY_RETRY_LIMIT) {
          await sleep(IMAGE_POLL_INTERVAL_MS);
          continue;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, IMAGE_POLL_INTERVAL_MS));
    }
    throw new Error('任务仍在处理中，请稍后再试');
  };

  const collectInputImages = async () => {
    const inputImages: string[] = [];
    if (!productImageFile) {
      throw new Error('请先上传商品图片');
    }
    inputImages.push(await uploadPublicAsset(productImageFile));
    if (modelMode === 'custom' && customModelFile) {
      inputImages.push(await uploadPublicAsset(customModelFile));
    } else if (modelMode === 'preset') {
      inputImages.push(selectedModelPreset.imageUrl);
    }
    if (sceneMode === 'custom' && customSceneFile) {
      inputImages.push(await uploadPublicAsset(customSceneFile));
    } else if (sceneMode === 'preset') {
      inputImages.push(selectedScenePreset.imageUrl);
    }
    return inputImages;
  };

  const computeRunStatus = (candidates: GeneratedCandidate[]): Extract<TaskStatus, 'image_generating' | 'image_ready' | 'failed'> => {
    if (candidates.some((item) => item.status === 'pending')) return 'image_generating';
    if (candidates.some((item) => item.status === 'success')) return 'image_ready';
    return 'failed';
  };

  const createGeminiCandidate = async (prompt: string, inputImages: string[]) => {
    let lastError = '创建 Gemini 3 Pro 任务失败';
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const res = await fetch('/api/create-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          input_images: inputImages,
          aspect_ratio: aspectRatio,
          size: '2K',
        }),
      });
      const json = (await res.json()) as { id_task?: string; image_url?: string | null; error?: string };
      if (res.ok && json.id_task) {
        if (json.image_url) {
          return json.image_url;
        }
        return waitForGeminiResult(json.id_task);
      }
      lastError = json.error || lastError;
      if (attempt < 2) {
        await sleep(500 * (attempt + 1));
      }
    }
    throw new Error(lastError);
  };

  const resolveProductReferenceUrl = async () => {
    if (productImagePublicUrl) return productImagePublicUrl;
    if (productImageUrl && !productImageUrl.startsWith('blob:')) return productImageUrl;
    if (!productImageFile) return null;
    const uploadedUrl = await uploadPublicAsset(productImageFile);
    setProductImagePublicUrl(uploadedUrl);
    return uploadedUrl;
  };

  const refineVideoPrompt = async (creativePromptSeed: string) => {
    let lastError = '视频提示词优化失败';
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const res = await fetch('/api/ugc/refine-video-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creativePrompt: creativePromptSeed,
          modelName: modelMode === 'preset' ? selectedModelPreset.name : modelMode === 'custom' ? t.ugcVideoCustomModel : '',
          sceneName: sceneMode === 'preset' ? selectedScenePreset.name : sceneMode === 'custom' ? t.ugcVideoCustomScene : '',
          aspectRatio: 'adaptive',
          duration: 15,
        }),
      });
      const json = (await res.json()) as { prompt?: string; error?: string };
      if (res.ok && json.prompt) {
        return json.prompt;
      }
      lastError = json.error || lastError;
      if (attempt < 2) {
        await sleep(500 * (attempt + 1));
      }
    }
    throw new Error(lastError);
  };

  const generateCandidates = async () => {
    if (!productName.trim() || !productImageUrl || !productImageFile) return;
    let runId = '';
    const sourceCreativePrompt = productName.trim();

    setActiveFlow('image');
    setStatus('image_generating');
    setImageCandidates([]);
    setSelectedCandidateId(null);
    setConfirmedCandidateId(null);
    setVideoUrl(null);
    setVideoPrompt('');
    setImageError(null);

    try {
      const inputImages = await collectInputImages();

      const candidateTotal = Math.min(4, Math.max(1, generationCount));
      const requestBase = Date.now();
      runId = `image-run-${requestBase}`;
      const pendingCandidates: GeneratedCandidate[] = Array.from({ length: candidateTotal }, (_, index) => ({
        id: `candidate-${requestBase}-${index}`,
        prompt: '',
        status: 'pending',
      }));

      setImageCandidates(pendingCandidates);
      setSelectedCandidateId(pendingCandidates[0].id);
      setActiveImageRunId(runId);
      setImageRuns((prev) => [
        {
          id: runId,
          createdAt: Date.now(),
          creativePrompt: sourceCreativePrompt,
          candidates: pendingCandidates,
          status: 'image_generating',
          selectedCandidateId: pendingCandidates[0].id,
          generationCount: candidateTotal,
          aspectRatio,
        },
        ...prev,
      ]);

      let firstSuccessId: string | null = null;
      let firstPrompt = '';
      const nextCandidates = [...pendingCandidates];

      const updateRunProgress = () => {
        const settledCount = nextCandidates.filter((item) => item.status !== 'pending').length;
        const isFinished = settledCount === candidateTotal;
        setImageCandidates([...nextCandidates]);
        setImageRuns((prev) =>
          prev.map((run) =>
            run.id === runId
              ? {
                  ...run,
                  candidates: [...nextCandidates],
                  status: isFinished ? (firstSuccessId ? 'image_ready' : 'failed') : 'image_generating',
                  selectedCandidateId: firstSuccessId || run.selectedCandidateId,
                  errorMessage: isFinished && !firstSuccessId ? 'Gemini 3 Pro 没有返回可用图片' : undefined,
                }
              : run
          )
        );
      };

      await Promise.all(
        pendingCandidates.map(async (candidate, index) => {
          try {
            await sleep(index * 200);
            const refinedPrompt = await refineCreativePrompt(index, candidateTotal);
            const imageUrl = await createGeminiCandidate(refinedPrompt, inputImages);
            nextCandidates[index] = {
              ...candidate,
              imageUrl,
              prompt: refinedPrompt,
              status: 'success',
            };
            if (!firstSuccessId) firstSuccessId = candidate.id;
            if (!firstPrompt) firstPrompt = refinedPrompt;
          } catch (error) {
            nextCandidates[index] = {
              ...candidate,
              status: 'failed',
              errorMessage: error instanceof Error ? error.message : '生成失败',
            };
          }
          updateRunProgress();
        })
      );

      setImageCandidates(nextCandidates);
      setImagePrompt(firstPrompt);
      setImageRuns((prev) =>
        prev.map((run) =>
          run.id === runId
            ? {
                ...run,
                candidates: nextCandidates,
                status: firstSuccessId ? 'image_ready' : 'failed',
                selectedCandidateId: firstSuccessId || run.selectedCandidateId,
                errorMessage: firstSuccessId ? undefined : 'Gemini 3 Pro 没有返回可用图片',
              }
            : run
        )
      );

      if (!firstSuccessId) {
        setStatus('failed');
        setImageError('Gemini 3 Pro 没有返回可用图片');
        return;
      }

      setSelectedCandidateId((prev) => {
        const current = nextCandidates.find((item) => item.id === prev);
        return current && current.status === 'success' ? prev : firstSuccessId;
      });
      setStatus('image_ready');
    } catch (error) {
      setStatus('failed');
      const message = error instanceof Error ? error.message : '生成图片失败';
      setImageError(message);
      setImageRuns((prev) =>
        prev.map((run) =>
          run.id === runId
            ? {
                ...run,
                status: 'failed',
                errorMessage: message,
              }
            : run
        )
      );
    }
  };

  const regenerateSelectedCandidate = async () => {
    if (!selectedCandidateId) return;
    const run =
      imageRuns.find((item) => item.id === activeImageRunId) ||
      imageRuns.find((item) => item.candidates.some((candidate) => candidate.id === selectedCandidateId));
    if (!run) return;

    const candidateIndex = run.candidates.findIndex((item) => item.id === selectedCandidateId);
    if (candidateIndex < 0) return;

    const pendingCandidates = run.candidates.map((item) =>
      item.id === selectedCandidateId
        ? { ...item, imageUrl: undefined, prompt: '', status: 'pending' as const, errorMessage: undefined }
        : item
    );

    setStatus('image_generating');
    setImageCandidates(pendingCandidates);
    setActiveImageRunId(run.id);
    setImageRuns((prev) =>
      prev.map((item) =>
        item.id === run.id
          ? {
              ...item,
              candidates: pendingCandidates,
              status: computeRunStatus(pendingCandidates),
              selectedCandidateId,
            }
          : item
      )
    );

    try {
      const inputImages = await collectInputImages();
      const refinedPrompt = await refineCreativePrompt(candidateIndex, run.generationCount);
      const imageUrl = await createGeminiCandidate(refinedPrompt, inputImages);
      const nextCandidates = pendingCandidates.map((item) =>
        item.id === selectedCandidateId
          ? { ...item, imageUrl, prompt: refinedPrompt, status: 'success' as const }
          : item
      );
      const nextStatus = computeRunStatus(nextCandidates);
      setImagePrompt(refinedPrompt);
      setImageCandidates(nextCandidates);
      setImageRuns((prev) =>
        prev.map((item) =>
          item.id === run.id
            ? {
                ...item,
                candidates: nextCandidates,
                status: nextStatus,
                selectedCandidateId,
                errorMessage: undefined,
              }
            : item
        )
      );
      setStatus(nextStatus);
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成失败';
      const nextCandidates = pendingCandidates.map((item) =>
        item.id === selectedCandidateId
          ? { ...item, status: 'failed' as const, errorMessage: message }
          : item
      );
      const nextStatus = computeRunStatus(nextCandidates);
      setImageCandidates(nextCandidates);
      setImageRuns((prev) =>
        prev.map((item) =>
          item.id === run.id
            ? {
                ...item,
                candidates: nextCandidates,
                status: nextStatus,
                selectedCandidateId,
                errorMessage: message,
              }
            : item
        )
      );
      setStatus(nextStatus);
      setImageError(message);
    }
  };

  const stopVideoPoll = (localTaskId: string) => {
    const timer = videoPollTimersRef.current.get(localTaskId);
    if (timer) {
      clearInterval(timer);
      videoPollTimersRef.current.delete(localTaskId);
    }
    videoPollCountRef.current.delete(localTaskId);
  };

  const startVideoTaskPolling = (localTaskId: string, remoteTaskId: string) => {
    stopVideoPoll(localTaskId);
    videoPollCountRef.current.set(localTaskId, 0);

    const tick = async () => {
      const count = (videoPollCountRef.current.get(localTaskId) ?? 0) + 1;
      videoPollCountRef.current.set(localTaskId, count);

      if (count > VIDEO_POLL_MAX) {
        stopVideoPoll(localTaskId);
        setStatus('submitted');
        setVideoTasks((prev) =>
          prev.map((task) =>
            task.id === localTaskId
              ? {
                  ...task,
                  status: 'submitted',
                  errorMessage: '视频任务已提交，已轮询约 30 分钟仍未拿到可播放地址，请稍后查看回调结果。',
                }
              : task
          )
        );
        return;
      }

      try {
        const res = await fetch(`/api/video/ima-pro?task_id=${encodeURIComponent(remoteTaskId)}`);
        const json = (await res.json()) as {
          status?: 'processing' | 'succeeded' | 'failed' | 'submitted';
          video_url?: string | null;
          thumbnail_url?: string | null;
          error?: string | null;
          hint?: string | null;
        };

        if (!res.ok) {
          stopVideoPoll(localTaskId);
          setStatus('failed');
          setVideoTasks((prev) =>
            prev.map((task) =>
              task.id === localTaskId
                ? {
                    ...task,
                    status: 'failed',
                    errorMessage: json.error || `查询失败 (${res.status})`,
                  }
                : task
            )
          );
          return;
        }

        if (json.status === 'succeeded' && json.video_url) {
          stopVideoPoll(localTaskId);
          setVideoUrl(json.video_url);
          setStatus('completed');
          setVideoTasks((prev) =>
            prev.map((task) =>
              task.id === localTaskId
                ? {
                    ...task,
                    status: 'completed',
                    videoUrl: json.video_url || undefined,
                    coverUrl: json.thumbnail_url || task.coverUrl || task.sourceImageUrl,
                    errorMessage: undefined,
                  }
                : task
            )
          );
          return;
        }

        if (json.status === 'failed') {
          stopVideoPoll(localTaskId);
          setStatus('failed');
          setVideoTasks((prev) =>
            prev.map((task) =>
              task.id === localTaskId
                ? {
                    ...task,
                    status: 'failed',
                    errorMessage: json.error || '视频生成失败',
                  }
                : task
            )
          );
          return;
        }

        if (json.status === 'submitted') {
          setStatus('submitted');
          setVideoTasks((prev) =>
            prev.map((task) =>
              task.id === localTaskId
                ? {
                  ...task,
                  status: 'submitted',
                  errorMessage: json.hint || '任务已提交，继续轮询中，等待查询接口返回可播放地址。',
                }
                : task
            )
          );
        }
      } catch (error) {
        stopVideoPoll(localTaskId);
        setStatus('failed');
        setVideoTasks((prev) =>
          prev.map((task) =>
            task.id === localTaskId
              ? {
                  ...task,
                  status: 'failed',
                  errorMessage: error instanceof Error ? error.message : '网络错误',
                }
              : task
          )
        );
      }
    };

    void tick();
    const interval = setInterval(() => {
      void tick();
    }, 3000);
    videoPollTimersRef.current.set(localTaskId, interval);
  };

  const confirmCandidate = async () => {
    if (!selectedCandidateId) return;
    const chosen = displayedCandidates.find((item) => item.id === selectedCandidateId);
    if (!chosen || !chosen.imageUrl) return;

    const selectedRun =
      imageRuns.find((run) => run.id === activeImageRunId) ||
      imageRuns.find((run) => run.candidates.some((candidate) => candidate.id === selectedCandidateId));
    const seedCreativePrompt =
      selectedRun?.creativePrompt?.trim() ||
      productName.trim() ||
      activeVideoTask?.productName?.trim() ||
      videoTasks.find((task) => task.productName?.trim())?.productName?.trim() ||
      '';
    if (!seedCreativePrompt) {
      window.alert(language === 'zh' ? '请先输入 Creative Prompt，再生成视频。' : 'Please enter a creative prompt before generating the video.');
      return;
    }

    const seedVideoPrompt = seedCreativePrompt;
    const taskId = `video-task-${Date.now()}`;
    const pendingTask: VideoTask = {
      id: taskId,
      productName: seedCreativePrompt,
      sourceImageUrl: chosen.imageUrl,
      coverUrl: chosen.imageUrl,
      prompt: seedVideoPrompt,
      status: 'video_prompting',
      createdAt: Date.now(),
    };

    setProductName((prev) => (prev.trim() ? prev : seedCreativePrompt));
    setVideoPrompt(seedVideoPrompt);
    setConfirmedCandidateId(chosen.id);
    setActiveVideoTaskId(taskId);
    setActiveFlow('video');
    setStatus('video_prompting');
    setVideoUrl(null);
    setVideoTasks((prev) => [pendingTask, ...prev].slice(0, 20));

    try {
      const currentVideoPrompt = await refineVideoPrompt(seedCreativePrompt);
      setVideoPrompt(currentVideoPrompt);
      setVideoTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                prompt: currentVideoPrompt,
                status: 'video_reviewing',
                errorMessage: undefined,
              }
            : task
        )
      );
      setStatus('video_reviewing');

      const reviewRes = await fetch('/api/ugc/review-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: chosen.imageUrl,
          name: `ugc-candidate-${chosen.id}`,
        }),
      });
      const reviewJson = (await reviewRes.json()) as {
        passed?: boolean;
        status?: 'Active' | 'Failed' | 'Processing' | 'Unknown';
        reason?: string;
      };

      if (!reviewRes.ok || !reviewJson.passed) {
        setStatus('failed');
        setVideoTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: 'failed',
                  errorMessage: reviewJson.reason || '图片审核失败',
                }
              : task
          )
        );
        return;
      }

      setStatus('video_generating');
      setVideoTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: 'video_generating',
                errorMessage: undefined,
              }
            : task
        )
      );

      const referenceImageUrls = [chosen.imageUrl];
      const productReferenceUrl = await resolveProductReferenceUrl();
      if (productReferenceUrl && !referenceImageUrls.includes(productReferenceUrl)) {
        referenceImageUrls.push(productReferenceUrl);
      }

      const res = await fetch('/api/video/ima-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'image_to_video',
          element_list: [
            {
              reference_type: 'text',
              prompt: currentVideoPrompt,
            },
            ...referenceImageUrls.map((url) => ({
              reference_type: 'image',
              image: { url },
              reference_role: 'reference_image',
            })),
          ],
          aspect_ratio: 'adaptive',
          duration: 15,
          audio: true,
          model_version_id: 'ima-pro',
        }),
      });

      const json = (await res.json()) as { task_id?: string; error?: string };
      if (!res.ok || !json.task_id) {
        setStatus('failed');
        setVideoTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: 'failed',
                  errorMessage: json.error || `创建视频任务失败 (${res.status})`,
                }
              : task
          )
        );
        return;
      }

      setVideoTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                remoteTaskId: json.task_id,
                status: 'video_generating',
                errorMessage: undefined,
              }
            : task
        )
      );
      startVideoTaskPolling(taskId, json.task_id);
    } catch (error) {
      setStatus('failed');
      setVideoTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: 'failed',
                errorMessage: error instanceof Error ? error.message : '网络错误',
              }
            : task
        )
      );
    }
  };

  const canSubmit = productName.trim().length > 0 && Boolean(productImageUrl);
  const isVideoBusy = status === 'video_prompting' || status === 'video_reviewing' || status === 'video_generating';
  const confirmedCandidate = imageCandidates.find((item) => item.id === confirmedCandidateId) || null;
  const canEnterVideoFlow = true;
  const activeImagePrompt = selectedCandidate?.prompt || imagePrompt;
  const activeVideoPrompt = activeVideoTask?.prompt || videoPrompt;
  const showTaskSidebar = imageRuns.length > 0 || videoTasks.length > 0;
  const activeVideoUrl = activeVideoTask?.videoUrl || videoUrl;
  const imageTaskItems = imageRuns.flatMap((run) =>
    run.candidates.map((candidate, index) => ({
      runId: run.id,
      candidateId: candidate.id,
      createdAt: run.createdAt,
      aspectRatio: run.aspectRatio,
      status: candidate.status,
      imageUrl: candidate.imageUrl,
      errorMessage: candidate.errorMessage,
      title: `${t.ugcVideoCandidatePrefix} ${index + 1}`,
    }))
  );
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    if (activeImageRunId) {
      setImageRuns((prev) =>
        prev.map((run) =>
          run.id === activeImageRunId
            ? { ...run, selectedCandidateId: candidateId }
            : run
        )
      );
    }
  };

  const handleSelectImageRun = (runId: string) => {
    const run = imageRuns.find((item) => item.id === runId);
    if (!run) return;
    setActiveImageRunId(runId);
    if (isUserCreativePrompt(run.creativePrompt || '', run.candidates)) {
      setProductName(run.creativePrompt);
    }
    setSelectedCandidateId(run.selectedCandidateId || run.candidates[0]?.id || null);
    const promptCandidate =
      run.candidates.find((item) => item.id === run.selectedCandidateId && item.prompt) ||
      run.candidates.find((item) => item.prompt);
    if (promptCandidate?.prompt) {
      setImagePrompt(promptCandidate.prompt);
    }
  };

  const handleSelectHistoryItem = (runId: string, candidateId: string) => {
    const run = imageRuns.find((item) => item.id === runId);
    const candidate = run?.candidates.find((item) => item.id === candidateId);
    handleSelectImageRun(runId);
    setSelectedCandidateId(candidateId);
    if (candidate?.prompt) {
      setImagePrompt(candidate.prompt);
    }
    setImageRuns((prev) =>
      prev.map((currentRun) =>
        currentRun.id === runId
          ? { ...currentRun, selectedCandidateId: candidateId }
          : currentRun
      )
    );
  };

  const handleSelectVideoTask = (taskId: string) => {
    const task = videoTasks.find((item) => item.id === taskId);
    if (!task) return;
    setActiveVideoTaskId(taskId);
    setVideoPrompt(task.prompt);
    setVideoUrl(task.videoUrl || null);
    setStatus(task.status);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen bg-[#111114] text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3 text-sm text-white/60">
              <Link href="/editor" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
                {t.ugcVideoBackToEditor}
              </Link>
              <h1 className="text-lg font-semibold tracking-tight text-white">{t.ugcVideoTitle}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/10"
            title={t.language}
          >
            <Languages className="h-4 w-4" />
            <span>{language === 'zh' ? '简中' : 'English'}</span>
          </button>
        </div>

        <div className="mb-6 px-1">
          <div className="relative flex items-start justify-start gap-12">
            <div className="pointer-events-none absolute left-[28px] top-5 h-px w-[180px] bg-white/10" />
            {([
              {
                id: 'image' as FlowStep,
                index: '01',
                title: t.ugcVideoStepImage,
                description: t.ugcVideoStepImage,
                enabled: true,
              },
              {
                id: 'video' as FlowStep,
                index: '02',
                title: t.ugcVideoStepVideo,
                description: t.ugcVideoStepVideo,
                enabled: canEnterVideoFlow,
              },
            ]).map((step, index, arr) => {
              const isActive = activeFlow === step.id;
              const isDone = step.id === 'image' ? canEnterVideoFlow : status === 'completed';
              return (
                <div
                  key={step.id}
                  className={`relative z-10 flex flex-col items-start text-left transition-opacity ${
                    step.enabled ? 'hover:opacity-100' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => step.enabled && setActiveFlow(step.id)}
                    disabled={!step.enabled}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'border-white bg-white text-[#17171c] shadow-[0_10px_30px_rgba(255,255,255,0.10)] scale-105'
                        : isDone
                        ? 'border-white/20 bg-white/85 text-[#17171c]'
                        : 'border-white/10 bg-transparent text-white/35'
                    }`}
                  >
                    {step.id === 'image' ? '1' : '2'}
                  </button>
                  <div className="mt-3 min-w-[148px]">
                    <p className={`text-[11px] leading-4 transition-colors ${isActive ? 'text-white/70' : 'text-white/32'}`}>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`grid gap-5 ${showTaskSidebar ? 'xl:grid-cols-[0.86fr_1fr_0.58fr]' : 'xl:grid-cols-[0.92fr_1.08fr]'}`}>
              <section ref={imageFormSectionRef} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => productInputRef.current?.click()}
                  className="flex min-h-[162px] w-full flex-col items-center justify-center gap-3 rounded-[18px] bg-white/[0.05] text-center text-white/80 transition-colors hover:bg-white/[0.08]"
                >
                  {productImageUrl ? (
                    <img src={productImageUrl} alt="" className="h-full max-h-[162px] w-full rounded-[18px] object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="h-7 w-7" />
                      <div>
                        <p className="text-lg font-medium">{t.ugcVideoUploadProductImage}</p>
                        <p className="mt-1 text-sm text-white/45">{t.ugcVideoUploadSupportFormats}</p>
                      </div>
                    </>
                  )}
                </button>
                <input
                  ref={productInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setProductImagePublicUrl(null);
                    handleLocalUpload(
                      e.target.files?.[0],
                      setProductImageUrl,
                      productImageUrl,
                      setProductFileName,
                      setProductImageFile
                    );
                  }}
                />

                      <input
                        ref={modelInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleLocalUpload(e.target.files?.[0], setCustomModelUrl, customModelUrl, undefined, setCustomModelFile);
                          if (e.target.files?.[0]) {
                            setModelMode('custom');
                            setPickerOpen(null);
                    }
                  }}
                />

                <div ref={modelPickerRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setPickerOpen((prev) => (prev === 'model' ? null : 'model'))}
                    className="flex w-full items-center gap-3 rounded-[18px] bg-white/[0.05] px-4 py-3.5 text-left transition-colors hover:bg-white/[0.08]"
                  >
                    {currentModelImage ? (
                      <img src={currentModelImage} alt={currentModelLabel} className="h-10 w-10 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/60">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">{t.ugcVideoModel}</p>
                      <p className="mt-1 truncate text-base text-white/85">{currentModelLabel}</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-white/35 transition-transform ${pickerOpen === 'model' ? 'rotate-90' : ''}`} />
                  </button>
                  {renderAssetPicker('model')}
                </div>

                      <input
                        ref={sceneInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleLocalUpload(e.target.files?.[0], setCustomSceneUrl, customSceneUrl, undefined, setCustomSceneFile);
                          if (e.target.files?.[0]) {
                            setSceneMode('custom');
                            setPickerOpen(null);
                    }
                  }}
                />

                <div ref={scenePickerRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setPickerOpen((prev) => (prev === 'scene' ? null : 'scene'))}
                    className="flex w-full items-center gap-3 rounded-[18px] bg-white/[0.05] px-4 py-3.5 text-left transition-colors hover:bg-white/[0.08]"
                  >
                    {currentSceneImage ? (
                      <img src={currentSceneImage} alt={currentSceneLabel} className="h-10 w-10 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/60">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">{t.ugcVideoBackgroundLabel}</p>
                      <p className="mt-1 truncate text-base text-white/85">{currentSceneLabel}</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-white/35 transition-transform ${pickerOpen === 'scene' ? 'rotate-90' : ''}`} />
                  </button>
                  {renderAssetPicker('scene')}
                </div>

                <div className="grid gap-3 sm:grid-cols-[0.92fr_1.08fr]">
                  <div className="rounded-[18px] bg-white/[0.05] px-4 py-3">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/35">{t.ugcVideoGenerateCount}</p>
                    <div className="flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <button
                        type="button"
                        onClick={() => setGenerationCount((prev) => Math.max(1, prev - 1))}
                        className="flex h-full w-11 items-center justify-center text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="h-5 w-px bg-white/10" />
                      <input
                        type="number"
                        min={1}
                        max={4}
                        value={generationCount}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          if (Number.isNaN(next)) return;
                          setGenerationCount(Math.min(4, Math.max(1, next)));
                        }}
                        className="h-full w-full bg-transparent px-3 text-center text-sm font-medium text-white focus:outline-none"
                      />
                      <div className="h-5 w-px bg-white/10" />
                      <button
                        type="button"
                        onClick={() => setGenerationCount((prev) => Math.min(4, prev + 1))}
                        className="flex h-full w-11 items-center justify-center text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-white/30">{t.ugcVideoGenerateCountHint}</p>
                  </div>

                  <div className="rounded-[18px] bg-white/[0.05] px-4 py-3">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/35">{t.ugcVideoAspectRatio}</p>
                    <div className="relative">
                      <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as (typeof ASPECT_RATIO_OPTIONS)[number])}
                        className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-3 pr-10 text-sm text-white focus:outline-none"
                      >
                        {ASPECT_RATIO_OPTIONS.map((ratio) => (
                          <option key={ratio} value={ratio} className="text-black">
                            {ratio}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-white/40" />
                    </div>
                    <p className="mt-2 text-xs text-white/30">{t.ugcVideoAspectRatioHint}</p>
                  </div>
                </div>

                <div className="rounded-[18px] bg-white/[0.05] px-4 py-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">{t.ugcVideoCreativePrompt}</p>
                    <span className="text-xs text-white/30">{productName.length}/1000</span>
                  </div>
                  <textarea
                    value={productName}
                    onChange={(e) => setProductName(e.target.value.slice(0, 1000))}
                    placeholder={creativePromptPlaceholder}
                    className="min-h-[140px] w-full resize-none bg-transparent text-sm leading-5 text-white placeholder:text-xs placeholder:text-white/30 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={generateCandidates}
                  disabled={!canSubmit || status === 'image_generating' || isVideoBusy}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-semibold text-[#17171c] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === 'image_generating' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  {t.ugcVideoGenerateSceneImage}
                </button>
              </div>
              </section>

              <section
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm"
                style={imageStageHeight ? { height: imageStageHeight } : undefined}
              >
                <div className="flex h-full flex-col gap-4">
                  <div className="min-h-0 flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-[#232327]">
                    {activeFlow === 'image' && selectedCandidate?.status === 'pending' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white/[0.04] text-center text-white/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white/85">{t.ugcVideoImageSkillRunning}</p>
                          <p className="mt-2 text-sm leading-6 text-white/45">{t.ugcVideoImageSkillEta}</p>
                        </div>
                      </div>
                    ) : activeFlow === 'image' && selectedCandidate?.status === 'failed' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white/[0.04] px-8 text-center text-white/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                          <RefreshCw className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white/85">{t.ugcVideoCandidateFailed}</p>
                          <p className="mt-2 text-sm leading-6 text-white/45">{selectedCandidate.errorMessage || t.ugcVideoCandidateFailedHint}</p>
                        </div>
                      </div>
                    ) : activeFlow === 'video' && activeVideoTask?.status === 'video_prompting' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white/[0.04] text-center text-white/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white/85">{t.ugcVideoVideoSkillRunning}</p>
                          <p className="mt-2 text-sm leading-6 text-white/45">{t.ugcVideoVideoSkillEta}</p>
                        </div>
                      </div>
                    ) : activeFlow === 'video' && activeVideoTask?.status === 'video_reviewing' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white/[0.04] text-center text-white/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white/85">{t.ugcVideoReviewingImage}</p>
                          <p className="mt-2 text-sm leading-6 text-white/45">{t.ugcVideoReviewingImageHint}</p>
                        </div>
                      </div>
                    ) : activeFlow === 'video' && activeVideoTask?.status === 'video_generating' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white/[0.04] text-center text-white/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white/85">{t.ugcVideoGeneratingVideo}</p>
                          <p className="mt-2 text-sm leading-6 text-white/45">{t.ugcVideoGeneratingVideoHint}</p>
                        </div>
                      </div>
                    ) : activeFlow === 'video' && activeVideoTask?.status === 'submitted' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white/[0.04] px-8 text-center text-white/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white/85">{t.ugcVideoVideoTaskSubmitted}</p>
                          <p className="mt-2 text-sm leading-6 text-white/45">
                            {activeVideoTask.errorMessage || t.ugcVideoVideoTaskSubmittedHint}
                          </p>
                        </div>
                      </div>
                    ) : activeFlow === 'video' && activeVideoTask?.status === 'failed' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white/[0.04] px-8 text-center text-white/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                          <RefreshCw className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white/85">{t.ugcVideoVideoFailed}</p>
                          <p className="mt-2 text-sm leading-6 text-white/45">{activeVideoTask.errorMessage || t.ugcVideoVideoFailedHint}</p>
                        </div>
                      </div>
                    ) : activeFlow === 'video' && activeVideoUrl ? (
                      <div className="flex h-full w-full items-center justify-center bg-[#232327]">
                        <video src={activeVideoUrl} controls className="h-full w-full object-contain" />
                      </div>
                    ) : activeFlow === 'video' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white/[0.04] text-center text-white/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                          <Video className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white/85">{t.ugcVideoVideoPreview}</p>
                          <p className="mt-2 text-sm leading-6 text-white/45">{t.ugcVideoVideoPreviewHint}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#232327]">
                        <img src={activePreviewImage} alt="" className="h-full w-full object-contain" />
                      </div>
                    )}
                  </div>

                  {activeFlow === 'image' && displayedCandidates.length > 0 && (
                    <div className="pt-1">
                    <div className="flex items-stretch gap-3">
                      <button
                        type="button"
                        onClick={() => setPromptModal('image')}
                        className="inline-flex h-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-cyan-200"
                      >
                        {t.ugcVideoViewPrompt}
                      </button>
                      <button
                        type="button"
                        onClick={regenerateSelectedCandidate}
                        disabled={!selectedCandidateId || !selectedCandidate || selectedCandidate.status === 'pending' || isVideoBusy}
                        className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {t.ugcVideoRegenerate}
                      </button>
                      <button
                        type="button"
                        onClick={confirmCandidate}
                        disabled={!selectedCandidateId || !selectedCandidate?.imageUrl || isVideoBusy}
                        className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 text-sm font-semibold text-[#111114] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isVideoBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        {t.ugcVideoGenerate15sVideo}
                      </button>
                    </div>

                    </div>
                  )}

                  {activeFlow === 'image' && imageError && displayedCandidates.length === 0 && displayedImageStatus === 'failed' && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/45">
                      {imageError}
                    </div>
                  )}

                  {activeFlow === 'video' && (
                    <div className="pt-1">
                      <div className="flex items-stretch gap-3">
                        <button
                          type="button"
                          onClick={() => setPromptModal('video')}
                          className="inline-flex h-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-cyan-200"
                        >
                          {t.ugcVideoViewPrompt}
                        </button>
                        <button
                          type="button"
                          onClick={confirmCandidate}
                          disabled={!confirmedCandidate || isVideoBusy}
                          className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 text-sm font-semibold text-[#111114] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isVideoBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                          {t.ugcVideoRegenerateVideo}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {showTaskSidebar && (
                <aside
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm"
                  style={imageStageHeight ? { height: imageStageHeight } : undefined}
                >
                  <div className="flex h-full flex-col">
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{t.ugcVideoTaskList}</h2>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/45">
                          {activeFlow === 'image' ? imageTaskItems.length : videoTasks.length} {t.ugcVideoTaskCountUnit}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/35 truncate">{activeFlow === 'image' ? t.ugcVideoTaskListImageHint : t.ugcVideoTaskListVideoHint}</p>
                    </div>
                    <div className="mb-3 flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">
                      <button
                        type="button"
                        onClick={() => setActiveFlow('image')}
                        className={`flex-1 rounded-xl px-3 py-2 text-sm transition-colors ${activeFlow === 'image' ? 'bg-white text-[#17171c]' : 'text-white/60 hover:bg-white/[0.05]'}`}
                      >
                        {t.ugcVideoImageTab}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveFlow('video')}
                        className={`flex-1 rounded-xl px-3 py-2 text-sm transition-colors ${activeFlow === 'video' ? 'bg-white text-[#17171c]' : 'text-white/60 hover:bg-white/[0.05]'}`}
                      >
                        {t.ugcVideoVideoTab}
                      </button>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                      {activeFlow === 'image' ? imageTaskItems.map((item) => {
                        return (
                          <button
                            key={item.candidateId}
                            type="button"
                            onClick={() => handleSelectHistoryItem(item.runId, item.candidateId)}
                            className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                              selectedCandidateId === item.candidateId
                                ? 'border-cyan-400 bg-cyan-400/10'
                                : item.status === 'failed'
                                ? 'border-red-400/30 bg-white/[0.02]'
                                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 overflow-hidden rounded-xl bg-white/[0.05]">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-white/35">
                                    {item.status === 'pending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{item.title}</p>
                                <p className="mt-1 text-xs text-white/35">{formatTime(item.createdAt, language)}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <span className="text-white/45">{item.aspectRatio}</span>
                              <span className={`${item.status === 'success' ? 'text-emerald-300' : item.status === 'failed' ? 'text-red-300' : 'text-white/45'}`}>
                                {item.status === 'success' ? t.ugcVideoStatusDone : item.status === 'failed' ? t.ugcVideoStatusFailed : t.ugcVideoStatusProcessing}
                              </span>
                            </div>
                          </button>
                        );
                      }) : videoTasks.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-white/45">
                          {t.ugcVideoNoVideoTasks}
                        </div>
                      ) : (
                        videoTasks.map((task, index) => (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => handleSelectVideoTask(task.id)}
                            className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                              activeVideoTaskId === task.id
                                ? 'border-cyan-400 bg-cyan-400/10'
                                : task.status === 'failed'
                                ? 'border-red-400/30 bg-white/[0.02]'
                                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 overflow-hidden rounded-xl bg-white/[0.05]">
                                {task.coverUrl ? (
                                  <img src={task.coverUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-white/35">
                                    {task.status === 'video_generating' || task.status === 'video_reviewing' || task.status === 'video_prompting' ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : task.status === 'submitted' ? (
                                      <Upload className="h-4 w-4" />
                                    ) : (
                                      <Video className="h-4 w-4" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{t.ugcVideoTaskPrefix} {videoTasks.length - index}</p>
                                <p className="mt-1 text-xs text-white/35">{formatTime(task.createdAt, language)}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <span className="text-white/45">15s</span>
                              <span className={`${task.status === 'completed' ? 'text-emerald-300' : task.status === 'failed' ? 'text-red-300' : task.status === 'submitted' ? 'text-amber-200' : task.status === 'video_reviewing' ? 'text-cyan-200' : task.status === 'video_prompting' ? 'text-violet-200' : 'text-white/45'}`}>
                                {task.status === 'completed' ? t.ugcVideoStatusDone : task.status === 'failed' ? t.ugcVideoStatusFailed : task.status === 'submitted' ? t.ugcVideoStatusSubmitted : task.status === 'video_reviewing' ? t.ugcVideoStatusReviewing : task.status === 'video_prompting' ? t.ugcVideoStatusPrompting : t.ugcVideoStatusProcessing}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </aside>
              )}
          </div>
        </div>
      {promptModal && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
            onClick={() => setPromptModal(null)}
            aria-hidden
          />
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-6">
            <div className="w-[min(90vw,860px)] rounded-[24px] border border-white/12 bg-[#17171c] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{promptModal === 'image' ? t.ugcVideoImagePromptTitle : t.ugcVideoVideoPromptTitle}</h3>
                  <p className="mt-1 text-sm text-white/45">
                    {promptModal === 'image' ? t.ugcVideoImagePromptDesc : t.ugcVideoVideoPromptDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPromptModal(null)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/75 hover:bg-white/[0.08]"
                >
                  {t.ugcVideoClose}
                </button>
              </div>
              <pre className="mt-5 max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-[20px] bg-black/20 p-5 text-sm leading-7 text-white/70">
                {promptModal === 'image'
                  ? activeImagePrompt || t.ugcVideoNoImagePrompt
                  : activeVideoPrompt || t.ugcVideoNoVideoPrompt}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function UGCVideoGeneratorPage() {
  return (
    <LanguageProvider>
      <UGCVideoGeneratorPageContent />
    </LanguageProvider>
  );
}
