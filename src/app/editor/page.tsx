'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Upload, X, ArrowLeftRight, Check, Loader2 } from 'lucide-react';
import { EditorHeader } from '@/components/editor/editor-header';
import { LeftSidebar } from '@/components/editor/left-sidebar';
import { TabContent } from '@/components/editor/tab-content';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { RightSidebar } from '@/components/editor/right-sidebar';

type SidebarTab =
  | 'apps'
  | 'ratio'
  | 'templates'
  | 'upload'
  | 'text'
  | 'image'
  | 'assets'
  | 'background';

// 背景图层（特殊图层，始终存在）
const BACKGROUND_LAYER_ID = 'background-layer';

/** 动态打开的 App Tab（如 AI 生图），可关闭 */
export type OpenAppTab = { id: string; label: string };

/** Image Enhancer / Background remover 共用入口弹窗：无选中图时显示，可选上传或从画板选择；forApp 决定标题等文案 */
function ImageEnhancerModal({
  open,
  onClose,
  layers,
  onConfirm,
  forApp = 'image-enhancer',
}: {
  open: boolean;
  onClose: () => void;
  layers: Array<{ id: string; type?: string; name?: string; imageUrl?: string }>;
  onConfirm: (url: string, label: string) => void;
  forApp?: 'image-enhancer' | 'background-remover';
}) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageLayers = layers.filter((l) => l.type === 'image' && l.imageUrl);
  const modalTitle = forApp === 'background-remover' ? t.removeBgModalTitle : t.imageEnhancerModalTitle;
  const confirmLabel = forApp === 'background-remover' ? t.removeBg : t.imageEnhancer;

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onConfirm(url, confirmLabel);
    }
    e.target.value = '';
  };

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} aria-hidden />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-xl shadow-xl border border-gray-200 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{modalTitle}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium"
          >
            <Upload className="w-5 h-5" />
            {t.imageEnhancerUploadImage}
          </button>
          {imageLayers.length > 0 && (
            <>
              <p className="text-xs font-medium text-gray-500">{t.imageEnhancerImagesOnArtboard}</p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {imageLayers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => onConfirm(layer.imageUrl!, confirmLabel)}
                    className="flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-gray-50 hover:border-teal-300 hover:bg-teal-50/50 text-left"
                  >
                    <div className="w-full aspect-square bg-gray-200">
                      <img src={layer.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    <p className="px-1.5 py-1 text-xs font-medium text-gray-800 truncate">{layer.name || 'Image'}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/** AI Removal 入口弹窗：无选中图时显示，可选上传或从画板选择 */
function AIRemovalModal({
  open,
  onClose,
  layers,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  layers: Array<{ id: string; type?: string; name?: string; imageUrl?: string }>;
  onConfirm: (url: string, label: string) => void;
}) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageLayers = layers.filter((l) => l.type === 'image' && l.imageUrl);

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onConfirm(url, t.aiRemoval);
    }
    e.target.value = '';
  };

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} aria-hidden />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-xl shadow-xl border border-gray-200 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{t.aiRemovalModalTitle}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium"
          >
            <Upload className="w-5 h-5" />
            {t.aiRemovalUploadImage}
          </button>
          {imageLayers.length > 0 && (
            <>
              <p className="text-xs font-medium text-gray-500">{t.aiRemovalImagesOnArtboard}</p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {imageLayers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => onConfirm(layer.imageUrl!, t.aiRemoval)}
                    className="flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-gray-50 hover:border-teal-300 hover:bg-teal-50/50 text-left"
                  >
                    <div className="w-full aspect-square bg-gray-200">
                      <img src={layer.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    <p className="px-1.5 py-1 text-xs font-medium text-gray-800 truncate">{layer.name || 'Image'}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/** 画板上的 Image Enhancer 完成弹窗：直接复用 AI Removal 结果弹窗结构（同一套 DOM + ComparisonResultContent，After 尺寸乘 4） */
function ImageEnhancerComparisonPopup({ sourceUrl, onClose }: { sourceUrl: string; onClose?: () => void }) {
  const { t } = useLanguage();
  const boxRef = useRef<HTMLDivElement>(null);
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 p-6 overflow-auto">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div
          ref={boxRef}
          className="relative w-full flex-shrink-0 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shadow-xl"
          style={{ aspectRatio: '3/4', maxHeight: '70vh' }}
        >
          <ComparisonResultContent sourceUrl={sourceUrl} containerRef={boxRef} afterDimensionsMultiplier={4} />
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium text-sm"
            aria-label={t.imageEnhancerDiscard}
          >
            <X className="w-5 h-5" />
            <span>{t.imageEnhancerDiscard}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm"
            aria-label={t.confirm}
          >
            <Check className="w-5 h-5" />
            <span>{t.confirm}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** 前后对比内容（AI Removal / Image Enhancer 共用）：滑杆 + 左上 Before / 右上 After；showDimensions 为 false 时不显示分辨率数字（用于 AI Removal） */
function ComparisonResultContent({
  sourceUrl,
  containerRef,
  afterDimensionsMultiplier = 1,
  showDimensions = true,
}: {
  sourceUrl: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  afterDimensionsMultiplier?: number;
  showDimensions?: boolean;
}) {
  const { t } = useLanguage();
  const [beforeDimensions, setBeforeDimensions] = useState<{ width: number; height: number } | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isSliding, setIsSliding] = useState(false);

  const afterDimensions = beforeDimensions
    ? { width: Math.round(beforeDimensions.width * afterDimensionsMultiplier), height: Math.round(beforeDimensions.height * afterDimensionsMultiplier) }
    : null;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setBeforeDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    }
  };

  useEffect(() => {
    if (!isSliding) return;
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      setSliderPosition(x);
    };
    const onUp = () => setIsSliding(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isSliding, containerRef]);

  return (
    <>
      <img
        src={sourceUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-contain"
      />
      <img
        src={sourceUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-contain z-[1]"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        onLoad={handleImageLoad}
      />
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-gray-100/95 text-gray-700 text-sm font-medium z-10">
        {t.imageEnhancerBefore}{showDimensions && beforeDimensions ? ` ${beforeDimensions.width} * ${beforeDimensions.height}` : ''}
      </span>
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-gray-100/95 text-gray-700 text-sm font-medium z-10">
        {t.imageEnhancerAfter}{showDimensions && afterDimensions ? ` ${afterDimensions.width} * ${afterDimensions.height}` : ''}
      </span>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      />
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setIsSliding(true); }}
        className="absolute top-1/2 z-20 w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-ew-resize -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${sliderPosition}%` }}
        aria-label="拖动对比"
      >
        <ArrowLeftRight className="w-5 h-5" />
      </button>
    </>
  );
}

/** AI Removal 弹窗内的前后对比：直接复用 ComparisonResultContent（After 尺寸与 Before 一致） */
function AIRemovalComparisonContent({
  sourceUrl,
  containerRef,
}: {
  sourceUrl: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return <ComparisonResultContent sourceUrl={sourceUrl} containerRef={containerRef} />;
}

/** AI Removal 图片上的笔刷选区：红色半透明笔刷光标 + 拖拽绘制选区；可传入 containerRef 以填入父级 box；onStroke 在用户绘制时回调用于启用 Remove */
function AIRemovalBrushCanvas({
  sourceUrl,
  brushSize,
  containerRef: externalContainerRef,
  onStroke,
}: {
  sourceUrl: string;
  brushSize: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onStroke?: () => void;
}) {
  const internalContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = externalContainerRef ?? internalContainerRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number; over: boolean }>({ x: 0, y: 0, over: false });
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const brushRadiusPx = (brushSize / 100) * 40 + 4;
  const fillParent = Boolean(externalContainerRef);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const syncSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [containerRef]);

  const drawLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = brushRadiusPx * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouse({ x, y, over: true });

    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const last = lastPosRef.current;
    if (last) {
      drawLine(ctx, last.x, last.y, x, y);
      onStroke?.();
    }
    lastPosRef.current = { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    lastPosRef.current = { x, y };
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.arc(x, y, brushRadiusPx, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fill();
      }
      onStroke?.();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  useEffect(() => {
    if (!isDrawing) return;
    const onUp = () => handleMouseUp();
    document.addEventListener('mouseup', onUp);
    return () => document.removeEventListener('mouseup', onUp);
  }, [isDrawing]);

  const content = (
    <>
      <img
        src={sourceUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ left: 0, top: 0 }}
      />
      {mouse.over && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-red-500 bg-red-500/40"
          style={{
            left: mouse.x - brushRadiusPx,
            top: mouse.y - brushRadiusPx,
            width: brushRadiusPx * 2,
            height: brushRadiusPx * 2,
          }}
        />
      )}
    </>
  );

  if (fillParent) {
    return (
      <div
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => setMouse((m) => ({ ...m, over: false }))}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      ref={internalContainerRef}
      className="relative w-full max-w-3xl flex-shrink-0 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shadow-xl cursor-crosshair"
      style={{ aspectRatio: '3/4', maxHeight: '70vh' }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseLeave={() => setMouse((m) => ({ ...m, over: false }))}
    >
      {content}
    </div>
  );
}

/** AI Removal 统一弹窗：discard 回到选区步骤；右上角叉关闭 tab 回 apps；confirm 新增/更新画布图片；点击 Remove 后先显示弹窗内加载态再出对比图 */
function AIRemovalUnifiedPopup({
  sourceUrl,
  brushSize,
  comparisonVisible,
  boxRef,
  onDiscard,
  onConfirm,
  onClose,
  onStroke,
}: {
  sourceUrl: string;
  brushSize: number;
  comparisonVisible: boolean;
  boxRef: React.RefObject<HTMLDivElement | null>;
  onDiscard: () => void;
  onConfirm: () => void;
  onClose: () => void;
  onStroke?: () => void;
}) {
  const { t } = useLanguage();
  const [comparisonImageReady, setComparisonImageReady] = useState(false);

  useEffect(() => {
    if (!comparisonVisible) {
      setComparisonImageReady(false);
      return;
    }
    const id = setTimeout(() => setComparisonImageReady(true), 2000);
    return () => clearTimeout(id);
  }, [comparisonVisible]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-6 overflow-auto">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div
          ref={boxRef as React.RefObject<HTMLDivElement>}
          className="relative w-full flex-shrink-0 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shadow-xl"
          style={{ aspectRatio: '3/4', maxHeight: '70vh' }}
        >
          {!comparisonVisible ? (
            <AIRemovalBrushCanvas
              containerRef={boxRef}
              sourceUrl={sourceUrl}
              brushSize={brushSize}
              onStroke={onStroke}
            />
          ) : !comparisonImageReady ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-100">
              <Loader2 className="w-10 h-10 text-teal-500 animate-spin flex-shrink-0" />
              <span className="text-sm text-gray-500">{t.aiRemovalProcessing}</span>
            </div>
          ) : (
            <ComparisonResultContent sourceUrl={sourceUrl} containerRef={boxRef} showDimensions={false} />
          )}
        </div>
        {comparisonVisible && comparisonImageReady && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={onDiscard}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium text-sm"
              aria-label={t.imageEnhancerDiscard}
            >
              <X className="w-5 h-5" />
              <span>{t.imageEnhancerDiscard}</span>
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm"
              aria-label={t.confirm}
            >
              <Check className="w-5 h-5" />
              <span>{t.confirm}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<SidebarTab | string>('ratio');
  const [openAppTabs, setOpenAppTabs] = useState<OpenAppTab[]>([]);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [userStatus, setUserStatus] = useState<'guest' | 'free' | 'pro'>('free');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 });
  const [activeTool, setActiveTool] = useState<string | undefined>();
  const [selectedLayout, setSelectedLayout] = useState<any>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [selectedLayerIds, setSelectedLayerIds] = useState<Set<string>>(new Set()); // 多选图层
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set()); // 展开的分组
  const [isLayoutSelectMode, setIsLayoutSelectMode] = useState(false);
  const [isLeftTabContentCollapsed, setIsLeftTabContentCollapsed] = useState(false);
  // Image Enhancer：无选中图时弹出的选择/上传弹窗；带入工具的图片 URL；画板上前后对比弹窗是否显示
  const [imageEnhancerModalOpen, setImageEnhancerModalOpen] = useState(false);
  /** 当前用「选图/上传」弹窗打开的是哪个 App：image-enhancer 或 background-remover（二者共用同一弹窗） */
  const [imageEnhancerModalForApp, setImageEnhancerModalForApp] = useState<'image-enhancer' | 'background-remover'>('image-enhancer');
  const [imageEnhancerSourceUrl, setImageEnhancerSourceUrl] = useState<string | null>(null);
  const [imageEnhancerComparisonVisible, setImageEnhancerComparisonVisible] = useState(false);
  /** 左侧「增强中」动画是否进行中；为 true 时画板不显示对比弹窗，对应图层显示生成中 */
  const [imageEnhancerEnhancingInProgress, setImageEnhancerEnhancingInProgress] = useState(false);
  // AI Removal：同 Image Enhancer 的入口逻辑；点击 Remove 后在画布显示前后对比弹窗；笔刷大小供画布选区用
  const [aiRemovalModalOpen, setAiRemovalModalOpen] = useState(false);
  const [aiRemovalSourceUrl, setAiRemovalSourceUrl] = useState<string | null>(null);
  const [aiRemovalComparisonVisible, setAiRemovalComparisonVisible] = useState(false);
  const [aiRemovalBrushSize, setAiRemovalBrushSize] = useState(30);
  /** 是否有过笔刷绘制（无有效选区时禁用 Remove） */
  const [aiRemovalHasSelection, setAiRemovalHasSelection] = useState(false);
  /** 从画布选中图层进入 AI Removal 时的图层 id，confirm 时更新该图层；为 null 则 confirm 时新增图片图层 */
  const [aiRemovalSourceLayerId, setAiRemovalSourceLayerId] = useState<string | null>(null);
  const aiRemovalBoxRef = useRef<HTMLDivElement>(null);
  /** Remove BG：点击图层工具栏 Remove BG 后，该图层显示生成中，几秒后完成 */
  const [removeBgSourceUrl, setRemoveBgSourceUrl] = useState<string | null>(null);
  const [removeBgInProgress, setRemoveBgInProgress] = useState(false);
  const removeBgTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (removeBgTimeoutRef.current) clearTimeout(removeBgTimeoutRef.current); }, []);

  // 背景图层状态
  const [backgroundLayer, setBackgroundLayer] = useState({
    id: BACKGROUND_LAYER_ID,
    name: 'Background',
    type: 'background' as const,
    color: '#FFFFFF',
    imageUrl: undefined as string | undefined,
    gradient: undefined as string | undefined,
    visible: true,
    locked: false,
  });

  const handleTabChange = (tab: SidebarTab | string) => {
    setActiveTab(tab);
  };

  const handleOpenAppTab = (appId: string, label: string) => {
    if (appId === 'image-enhancer') {
      const layer = selectedLayerId ? layers.find((l) => l.id === selectedLayerId) : null;
      if (layer?.type === 'image' && layer?.imageUrl) {
        setImageEnhancerSourceUrl(layer.imageUrl);
        setImageEnhancerComparisonVisible(false);
        setImageEnhancerEnhancingInProgress(true);
        setOpenAppTabs((prev) => (prev.some((t) => t.id === appId) ? prev : [...prev, { id: appId, label }]));
        setActiveTab(appId);
      } else {
        setImageEnhancerModalForApp('image-enhancer');
        setImageEnhancerModalOpen(true);
      }
      return;
    }
    if (appId === 'background-remover') {
      const layer = selectedLayerId ? layers.find((l) => l.id === selectedLayerId) : null;
      if (layer?.type === 'image' && layer?.imageUrl) {
        if (removeBgTimeoutRef.current) clearTimeout(removeBgTimeoutRef.current);
        setRemoveBgSourceUrl(layer.imageUrl);
        setRemoveBgInProgress(true);
        removeBgTimeoutRef.current = setTimeout(() => {
          setRemoveBgInProgress(false);
          setRemoveBgSourceUrl(null);
          removeBgTimeoutRef.current = null;
        }, 3000);
        // 无侧边栏内容页，不打开 tab
      } else {
        setImageEnhancerModalForApp('background-remover');
        setImageEnhancerModalOpen(true);
      }
      return;
    }
    if (appId === 'ai-removal') {
      const layer = selectedLayerId ? layers.find((l) => l.id === selectedLayerId) : null;
      if (layer?.type === 'image' && layer?.imageUrl) {
        setAiRemovalSourceUrl(layer.imageUrl);
        setAiRemovalSourceLayerId(layer.id);
        setAiRemovalHasSelection(false);
        setOpenAppTabs((prev) => (prev.some((t) => t.id === appId) ? prev : [...prev, { id: appId, label }]));
        setActiveTab(appId);
      } else {
        setAiRemovalSourceLayerId(null);
        setAiRemovalModalOpen(true);
      }
      return;
    }
    setOpenAppTabs((prev) => {
      if (prev.some((t) => t.id === appId)) return prev;
      return [...prev, { id: appId, label }];
    });
    setActiveTab(appId);
  };

  const openImageEnhancerWithSource = (url: string, label: string) => {
    setImageEnhancerSourceUrl(url);
    setImageEnhancerModalOpen(false);
    setImageEnhancerComparisonVisible(false);
    setImageEnhancerEnhancingInProgress(true);
    const appId = 'image-enhancer';
    setOpenAppTabs((prev) => (prev.some((t) => t.id === appId) ? prev : [...prev, { id: appId, label }]));
    setActiveTab(appId);
  };

  /** Background remover 选图/上传后：先往画板添加图片图层，再复用 Remove BG 生成动画（无侧边栏内容页，不打开 tab） */
  const openBackgroundRemoverWithSource = (url: string, _label: string) => {
    setImageEnhancerModalOpen(false);
    if (removeBgTimeoutRef.current) clearTimeout(removeBgTimeoutRef.current);
    const newId = `image-${Date.now()}`;
    setLayers((prev) => [
      ...prev,
      {
        id: newId,
        name: 'Image',
        type: 'image' as const,
        imageUrl: url,
        visible: true,
        locked: false,
        zIndex: prev.length,
        x: 5 + (prev.length * 3) % 15,
        y: 5 + (prev.length * 3) % 15,
        width: 50,
        height: 50,
      },
    ]);
    setSelectedLayerId(newId);
    setRemoveBgSourceUrl(url);
    setRemoveBgInProgress(true);
    removeBgTimeoutRef.current = setTimeout(() => {
      setRemoveBgInProgress(false);
      setRemoveBgSourceUrl(null);
      removeBgTimeoutRef.current = null;
    }, 3000);
  };

  /** Image Enhancer 弹窗放弃/确认：关闭对比弹窗、关闭 enhancer tab、返回 Apps */
  const handleImageEnhancerClose = () => {
    setImageEnhancerComparisonVisible(false);
    setImageEnhancerEnhancingInProgress(false);
    setOpenAppTabs((prev) => prev.filter((t) => t.id !== 'image-enhancer'));
    setActiveTab('apps');
    setImageEnhancerSourceUrl(null);
  };

  const openAiRemovalWithSource = (url: string, label: string) => {
    setAiRemovalSourceUrl(url);
    setAiRemovalModalOpen(false);
    setAiRemovalSourceLayerId(null);
    setAiRemovalHasSelection(false);
    const appId = 'ai-removal';
    setOpenAppTabs((prev) => (prev.some((t) => t.id === appId) ? prev : [...prev, { id: appId, label }]));
    setActiveTab(appId);
  };

  /** Discard：仅关闭对比，回到选区步骤，不关闭 tab */
  const handleAiRemovalDiscard = () => {
    setAiRemovalComparisonVisible(false);
  };

  /** 弹窗右上角叉：关闭 AI Removal tab，返回 Apps，清空状态 */
  const handleAiRemovalClose = () => {
    setAiRemovalComparisonVisible(false);
    setOpenAppTabs((prev) => prev.filter((t) => t.id !== 'ai-removal'));
    setActiveTab('apps');
    setAiRemovalSourceUrl(null);
    setAiRemovalSourceLayerId(null);
  };

  const handleAiRemovalConfirm = () => {
    const resultImageUrl = aiRemovalSourceUrl; // 实际接入 API 后替换为去除后的图 URL
    if (aiRemovalSourceLayerId) {
      setLayers((prev) =>
        prev.map((layer) =>
          layer.id === aiRemovalSourceLayerId && layer.type === 'image'
            ? { ...layer, imageUrl: resultImageUrl ?? layer.imageUrl }
            : layer
        )
      );
    } else if (resultImageUrl) {
      setLayers((prev) => {
        const newLayer = {
          id: `image-${Date.now()}`,
          name: 'Image',
          type: 'image' as const,
          imageUrl: resultImageUrl,
          visible: true,
          locked: false,
          zIndex: prev.length,
          x: 5 + (prev.length * 3) % 15,
          y: 5 + (prev.length * 3) % 15,
          width: 50,
          height: 50,
        };
        setSelectedLayerId(newLayer.id);
        return [...prev, newLayer];
      });
    }
    setAiRemovalComparisonVisible(false);
    setOpenAppTabs((prev) => prev.filter((t) => t.id !== 'ai-removal'));
    setActiveTab('apps');
    setAiRemovalSourceUrl(null);
    setAiRemovalSourceLayerId(null);
  };

  const handleCloseAppTab = (tabId: string) => {
    if (tabId === 'background-remover') {
      if (removeBgTimeoutRef.current) clearTimeout(removeBgTimeoutRef.current);
      removeBgTimeoutRef.current = null;
      setRemoveBgInProgress(false);
      setRemoveBgSourceUrl(null);
    }
    setOpenAppTabs((prev) => prev.filter((t) => t.id !== tabId));
    setActiveTab((current) => (current === tabId ? 'apps' : current));
  };

  const handleToolSelect = (tool: string) => {
    if (tool === 'adjust') {
      setActiveTab('adjust');
      return;
    }
    if (tool === 'crop') {
      setActiveTab('ratio');
    }
    setActiveTool(tool === activeTool ? undefined : tool);
  };

  // 根据图层类型获取对应的侧边栏 Tab
  const getTabByLayerType = (layerType: string): SidebarTab | null => {
    switch (layerType) {
      case 'text':
        return 'text';
      case 'image':
        return 'image';
      case 'background':
        return 'background';
      case 'shape':
        return 'assets';
      case 'layout':
        return 'templates';
      default:
        return null;
    }
  };

  // 选中图层并自动切换侧边栏
  const handleLayerSelect = (layerId: string | null, multiSelect?: Set<string>) => {
    if (multiSelect && multiSelect.size > 0) {
      // 多选模式 - 过滤掉 background 图层和 group 图层
      const validIds = new Set(Array.from(multiSelect).filter(id => {
        const layer = layers.find(l => l.id === id);
        return layer && 
               layer.type !== 'background' && 
               layer.id !== BACKGROUND_LAYER_ID && 
               !layer.isGroup;
      }));
      
      if (validIds.size > 0) {
        setSelectedLayerIds(validIds);
        setSelectedLayerId(null);
      } else {
        setSelectedLayerId(null);
        setSelectedLayerIds(new Set());
      }
    } else {
      // 单选模式 - 如果是 background 图层，允许选中
      if (layerId && layerId === BACKGROUND_LAYER_ID) {
        setSelectedLayerId(layerId);
        setSelectedLayerIds(new Set());
      } else if (layerId) {
        // 检查是否是 group 图层
        const layer = layers.find(l => l.id === layerId);
        if (layer && layer.isGroup) {
          setSelectedLayerId(layerId);
          setSelectedLayerIds(new Set());
        } else {
          setSelectedLayerId(layerId);
          setSelectedLayerIds(new Set());
        }
      } else {
        setSelectedLayerId(null);
        setSelectedLayerIds(new Set());
      }
    }

    // 如果没有选中任何图层，不切换侧边栏
    if (!layerId && (!multiSelect || multiSelect.size === 0)) {
      return;
    }

    // 根据图层类型切换侧边栏（仅单选时）
    if (layerId && layerId === BACKGROUND_LAYER_ID) {
      setActiveTab('background');
    } else if (layerId) {
      const layer = layers.find(l => l.id === layerId);
      if (layer) {
        const tab = getTabByLayerType(layer.type);
        // AI Filter 页选中图片图层时不切到 image tab，保持展示画板选中图
        if (tab && !(activeTab === 'ai-filter' && tab === 'image')) {
          setActiveTab(tab);
        }
      }
    }
  };

  // 分组图层（参考 Photoshop 的实现）
  const handleGroupLayers = (layerIds: string[]) => {
    if (layerIds.length < 2) return;
    
    // 过滤掉 background 图层和已经是 group 的图层
    const validLayerIds = layerIds.filter(id => {
      const layer = layers.find(l => l.id === id);
      return layer && 
             layer.type !== 'background' && 
             layer.id !== BACKGROUND_LAYER_ID && 
             !layer.isGroup &&
             !(layer as any).groupId;
    });
    
    if (validLayerIds.length < 2) return;
    
    const groupId = `group-${Date.now()}`;
    const groupName = `Group ${layers.filter(l => l.isGroup).length + 1}`;
    
    // 计算子图层的边界框（用于 group 图层的位置和尺寸）
    const childLayers = validLayerIds.map(id => layers.find(l => l.id === id)).filter(Boolean);
    if (childLayers.length === 0) return;
    
    const minX = Math.min(...childLayers.map(l => l!.x ?? 0));
    const minY = Math.min(...childLayers.map(l => l!.y ?? 0));
    const maxX = Math.max(...childLayers.map(l => (l!.x ?? 0) + (l!.width ?? 100)));
    const maxY = Math.max(...childLayers.map(l => (l!.y ?? 0) + (l!.height ?? 100)));
    
    // 创建分组图层（group 图层本身不在画布上渲染，只是一个容器）
    const groupLayer = {
      id: groupId,
      name: groupName,
      type: 'group' as const,
      isGroup: true,
      groupIds: validLayerIds, // 保存子图层 ID 列表
      visible: true,
      locked: false,
      zIndex: Math.max(...validLayerIds.map(id => {
        const layer = layers.find(l => l.id === id);
        return layer?.zIndex ?? 0;
      })),
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
    
    // 更新图层，给子图层添加 groupId 属性
    const updatedLayers = layers.map(layer => {
      if (validLayerIds.includes(layer.id)) {
        return { ...layer, groupId: groupId };
      }
      return layer;
    });
    
    // 将 group 图层插入到所有子图层之后（按 zIndex）
    const maxZIndex = Math.max(...validLayerIds.map(id => {
      const layer = layers.find(l => l.id === id);
      return layer?.zIndex ?? 0;
    }), 0);
    groupLayer.zIndex = maxZIndex + 1;
    
    const finalLayers = [...updatedLayers, groupLayer];
    setLayers(finalLayers);
    setSelectedLayerId(groupId);
    setSelectedLayerIds(new Set());
    // 默认展开新创建的 group
    setExpandedGroups(prev => new Set([...prev, groupId]));
  };

  // 取消分组
  const handleUngroupLayers = (groupId: string) => {
    const groupLayer = layers.find(l => l.id === groupId && l.isGroup);
    if (!groupLayer || !groupLayer.groupIds) return;
    
    // 移除分组图层，并移除子图层的 groupId
    const updatedLayers = layers
      .filter(layer => layer.id !== groupId)
      .map(layer => {
        if (groupLayer.groupIds.includes(layer.id)) {
          // 移除 groupId 属性
          const { groupId: _, ...rest } = layer as any;
          return rest;
        }
        return layer;
      });
    
    setLayers(updatedLayers);
    setSelectedLayerId(null);
    setSelectedLayerIds(new Set());
  };

  // 切换分组展开/折叠
  const handleToggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // 处理 layout 选择模式
  const handleLayoutSelect = () => {
    setIsLayoutSelectMode(true);
    setActiveTab('templates');
  };

  // 处理 layout 选择（从左侧 layout 页面选择）
  const handleLayoutSelectFromSidebar = (layout: any) => {
    if (isLayoutSelectMode && selectedLayerId) {
      const layer = layers.find(l => l.id === selectedLayerId);
      if (layer && layer.type === 'layout') {
        // 更新图层的 layout
        setLayers(layers.map(l => 
          l.id === selectedLayerId 
            ? { ...l, layout: { ...layout, frames: layout.frames.map((f: any) => ({ ...f })) } }
            : l
        ));
        setSelectedLayout(layout);
      }
    }
    setIsLayoutSelectMode(false);
  };

  const handleCreateNew = () => {
    console.log('Create new');
    // 处理创建新项目逻辑
  };

  const handleUndo = () => {
    console.log('Undo');
    // 处理撤销逻辑
  };

  const handleRedo = () => {
    console.log('Redo');
    // 处理重做逻辑
  };

  const handleDownload = () => {
    console.log('Download');
    // 处理下载逻辑
  };

  const handleUpgrade = () => {
    console.log('Upgrade');
    setUserStatus('pro');
  };

  return (
    <LanguageProvider>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden relative">
      <ImageEnhancerModal
        open={imageEnhancerModalOpen}
        onClose={() => setImageEnhancerModalOpen(false)}
        layers={layers}
        forApp={imageEnhancerModalForApp}
        onConfirm={(url, label) => {
          if (imageEnhancerModalForApp === 'background-remover') {
            openBackgroundRemoverWithSource(url, label);
          } else {
            openImageEnhancerWithSource(url, label);
          }
        }}
      />
      <AIRemovalModal
        open={aiRemovalModalOpen}
        onClose={() => setAiRemovalModalOpen(false)}
        layers={layers}
        onConfirm={openAiRemovalWithSource}
      />
      {/* Layout 选择模式蒙层 - 覆盖左侧边栏以外的所有区域 */}
      {isLayoutSelectMode && (
        <div 
          className="fixed inset-0 left-20 bg-black/40 z-30"
          onClick={() => setIsLayoutSelectMode(false)}
        />
      )}

      {/* 编辑器头部 */}
      <EditorHeader
        userStatus={userStatus}
        onCreateNew={handleCreateNew}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownload={handleDownload}
        onUpgrade={handleUpgrade}
        className={isLayoutSelectMode ? 'relative z-40' : ''}
      />

      {/* 主编辑区域 */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* 左侧边栏 */}
        <LeftSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          openAppTabs={openAppTabs}
          onCloseAppTab={handleCloseAppTab}
          highlightTab={isLayoutSelectMode ? 'templates' : undefined}
          className={isLayoutSelectMode ? 'relative z-40' : ''}
        />

        {/* Tab 内容面板 */}
        <TabContent 
          activeTab={activeTab}
          onOpenApp={handleOpenAppTab}
          canvasSize={canvasSize}
          onSizeChange={(width, height) => setCanvasSize({ width, height })}
          isCollapsed={isLeftTabContentCollapsed}
          onToggleCollapse={() => setIsLeftTabContentCollapsed(!isLeftTabContentCollapsed)}
          selectedLayerId={selectedLayerId}
          layers={layers}
          imageEnhancerSourceUrl={imageEnhancerSourceUrl}
          userStatus={userStatus}
          aiRemovalSourceUrl={aiRemovalSourceUrl}
          aiRemovalBrushSize={aiRemovalBrushSize}
          onAiRemovalBrushSizeChange={setAiRemovalBrushSize}
          aiRemovalHasSelection={aiRemovalHasSelection}
          onAiRemovalRemoveClick={() => setAiRemovalComparisonVisible(true)}
          onLayoutSelect={(layout) => {
            // 如果处于 layout 选择模式，更新现有图层
            if (isLayoutSelectMode && selectedLayerId) {
              handleLayoutSelectFromSidebar(layout);
            } else {
              // 否则创建新图层
              const newLayer = {
                id: `layer-${Date.now()}`,
                name: layout.name || 'Layout',
                type: 'layout' as const,
                layout: { ...layout, frames: layout.frames.map((f: any) => ({ ...f })) },
                visible: true,
                locked: false,
                zIndex: layers.length,
                x: 0,
                y: 0,
                width: 100,
                height: 100,
              };
              setLayers([...layers, newLayer]);
              setSelectedLayerId(newLayer.id);
              setSelectedLayout(layout);
            }
          }}
          isLayoutSelectMode={isLayoutSelectMode}
          onCloseAdjust={() => setActiveTab('apps')}
          onImageEnhancerEnhancingComplete={useCallback(() => {
            setImageEnhancerEnhancingInProgress(false);
            setImageEnhancerComparisonVisible(true);
          }, [])}
          onImageEnhancerEnhancingStart={useCallback(() => {
            setImageEnhancerEnhancingInProgress(true);
            setImageEnhancerComparisonVisible(false);
          }, [])}
          onBackToApps={() => setActiveTab('apps')}
          onBackgroundChange={(payload) => setBackgroundLayer((prev) => ({ ...prev, ...payload }))}
          onTextAdd={(textLayer) => {
            // 创建文本图层
            const newLayer = {
              id: textLayer.id,
              name: textLayer.text.substring(0, 20) || 'Text',
              type: 'text' as const,
              text: textLayer.text,
              textStyle: textLayer.style,
              fontSize: textLayer.fontSize || '24px',
              fontWeight: textLayer.fontWeight || 'normal',
              visible: true,
              locked: false,
              zIndex: layers.length,
              x: 10 + (layers.length * 2) % 20, // 稍微错开位置
              y: 10 + (layers.length * 2) % 20,
              width: 80,
              height: 15,
            };
            setLayers([...layers, newLayer]);
            setSelectedLayerId(newLayer.id);
          }}
          onImageAdd={(imageLayer) => {
            // 创建图片图层
            const newLayer = {
              id: imageLayer.id,
              name: imageLayer.name || 'Image',
              type: 'image' as const,
              imageUrl: imageLayer.url,
              visible: true,
              locked: false,
              zIndex: layers.length,
              x: 5 + (layers.length * 3) % 15,
              y: 5 + (layers.length * 3) % 15,
              width: 50,
              height: 50,
            };
            setLayers([...layers, newLayer]);
            setSelectedLayerId(newLayer.id);
          }}
          onShapeAdd={(shapeLayer) => {
            // 创建形状图层
            const newLayer = {
              id: shapeLayer.id,
              name: shapeLayer.label || 'Shape',
              type: 'shape' as const,
              icon: shapeLayer.icon,
              color: shapeLayer.color,
              visible: true,
              locked: false,
              zIndex: layers.length,
              x: 20 + (layers.length * 5) % 30,
              y: 20 + (layers.length * 5) % 30,
              width: 15,
              height: 15,
            };
            setLayers([...layers, newLayer]);
            setSelectedLayerId(newLayer.id);
          }}
        />

        {/* 中间编辑区域 */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          {/* Image Enhancer：画板上前后对比弹窗 */}
          {activeTab === 'image-enhancer' && imageEnhancerSourceUrl && imageEnhancerComparisonVisible && (
            <ImageEnhancerComparisonPopup
              sourceUrl={imageEnhancerSourceUrl}
              onClose={handleImageEnhancerClose}
            />
          )}

          {/* AI Removal 有图时：统一弹窗（同一图片区）；选区时笔刷，点击 Remove 后在同一弹窗内加滑杆 + Before/After 标识 */}
          {activeTab === 'ai-removal' && aiRemovalSourceUrl ? (
            <AIRemovalUnifiedPopup
              sourceUrl={aiRemovalSourceUrl}
              brushSize={aiRemovalBrushSize}
              comparisonVisible={aiRemovalComparisonVisible}
              boxRef={aiRemovalBoxRef}
              onDiscard={handleAiRemovalDiscard}
              onConfirm={handleAiRemovalConfirm}
              onClose={handleAiRemovalClose}
              onStroke={() => setAiRemovalHasSelection(true)}
            />
          ) : (
            <>
              {/* 编辑工具栏 */}
              <EditorToolbar
                onToolSelect={handleToolSelect}
                activeTool={activeTool}
                onFlipHorizontal={() => {}}
                onFlipVertical={() => {}}
                onRotateRight90={() => {}}
                onRotateLeft90={() => {}}
              />

              {/* 画布区域 */}
              <EditorCanvas 
            imageUrl={imageUrl} 
            canvasSize={canvasSize} 
            isCropMode={activeTool === 'crop'}
            onCanvasSizeChange={(width, height) => setCanvasSize({ width, height })}
            selectedLayout={selectedLayout}
            layers={layers}
            selectedLayerId={selectedLayerId}
            selectedLayerIds={selectedLayerIds}
            onLayerSelect={handleLayerSelect}
            backgroundLayer={backgroundLayer}
            onLayoutSelect={handleLayoutSelect}
            onGroupLayers={handleGroupLayers}
            onUngroupLayers={handleUngroupLayers}
            onLayerToolSelect={(tool) => {
              if (tool === 'delete') {
                const idsToDelete = selectedLayerIds.size > 0
                  ? Array.from(selectedLayerIds).filter((id) => id !== BACKGROUND_LAYER_ID)
                  : selectedLayerId && selectedLayerId !== BACKGROUND_LAYER_ID
                    ? [selectedLayerId]
                    : [];
                if (idsToDelete.length === 0) return;
                setLayers((prev) => prev.filter((l) => !idsToDelete.includes(l.id)));
                setSelectedLayerIds(new Set());
                setSelectedLayerId((prev) => (prev && idsToDelete.includes(prev) ? null : prev));
                return;
              }
              if (!selectedLayerId) return;
              const layer = layers.find((l) => l.id === selectedLayerId);
              if (layer?.type !== 'image' || !layer?.imageUrl) return;
              if (tool === 'enhance') {
                openImageEnhancerWithSource(layer.imageUrl, 'Image enhancer');
              } else if (tool === 'ai-removal') {
                setAiRemovalSourceUrl(layer.imageUrl);
                setAiRemovalSourceLayerId(layer.id);
                setAiRemovalHasSelection(false);
                setOpenAppTabs((prev) => (prev.some((t) => t.id === 'ai-removal') ? prev : [...prev, { id: 'ai-removal', label: 'AI Removal' }]));
                setActiveTab('ai-removal');
              } else if (tool === 'remove-bg') {
                if (removeBgTimeoutRef.current) clearTimeout(removeBgTimeoutRef.current);
                setRemoveBgSourceUrl(layer.imageUrl);
                setRemoveBgInProgress(true);
                removeBgTimeoutRef.current = setTimeout(() => {
                  setRemoveBgInProgress(false);
                  setRemoveBgSourceUrl(null);
                  removeBgTimeoutRef.current = null;
                }, 3000);
              } else if (tool === 'adjust') {
                setActiveTab('adjust');
              }
            }}
            onFlipHorizontal={() => {}}
            onFlipVertical={() => {}}
            onRotateRight90={() => {}}
            onRotateLeft90={() => {}}
            imageEnhancerSourceUrl={imageEnhancerSourceUrl}
            imageEnhancerEnhancingInProgress={imageEnhancerEnhancingInProgress}
            removeBgSourceUrl={removeBgSourceUrl}
            removeBgInProgress={removeBgInProgress}
            onLayerResize={(layerId, newSize) => {
              setLayers(layers.map(layer => {
                if (layer.id === layerId) {
                  return { 
                    ...layer, 
                    x: newSize.x,
                    y: newSize.y,
                    width: newSize.width,
                    height: newSize.height,
                  };
                }
                return layer;
              }));
            }}
            onLayoutFrameImageChange={(frameId, imageUrl, layerId) => {
              if (layerId) {
                // 更新指定图层的 layout
                setLayers(layers.map(layer => {
                  if (layer.id === layerId && layer.layout) {
                    return {
                      ...layer,
                      layout: {
                        ...layer.layout,
                        frames: layer.layout.frames.map((f: any) =>
                          f.id === frameId ? { ...f, imageUrl } : f
                        ),
                      },
                    };
                  }
                  return layer;
                }));
                // 如果当前选中的 layout 是这个图层，也更新它
                if (selectedLayout) {
                  const updatedLayout = {
                    ...selectedLayout,
                    frames: selectedLayout.frames.map((f: any) =>
                      f.id === frameId ? { ...f, imageUrl } : f
                    ),
                  };
                  setSelectedLayout(updatedLayout);
                }
              } else if (selectedLayout) {
                const updatedLayout = {
                  ...selectedLayout,
                  frames: selectedLayout.frames.map((f: any) =>
                    f.id === frameId ? { ...f, imageUrl } : f
                  ),
                };
                setSelectedLayout(updatedLayout);
              }
            }}
          />
            </>
          )}
        </div>

        {/* 右侧图层面板 */}
        <RightSidebar
          layers={[
            // 普通图层 - 按 zIndex 降序排列（zIndex 大的在上，小的在下）
            ...layers
              .slice()
              .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0))
              .map(layer => ({
                ...layer, // 传递所有属性，包括 groupId 和 isGroup
                thumbnail: layer.layout ? undefined : layer.imageUrl,
              })),
            // 背景图层（始终在最底部）
            {
              id: backgroundLayer.id,
              name: backgroundLayer.name,
              type: 'background',
              thumbnail: backgroundLayer.imageUrl,
              locked: backgroundLayer.locked,
              visible: backgroundLayer.visible,
              isBackground: true,
            },
          ]}
          selectedLayerId={selectedLayerId}
          onLayerSelect={handleLayerSelect}
          onLayerLockToggle={(layerId) => {
            if (layerId === BACKGROUND_LAYER_ID) {
              setBackgroundLayer(prev => ({ ...prev, locked: !prev.locked }));
            } else {
              setLayers(layers.map(layer =>
                layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
              ));
            }
          }}
          onLayerVisibilityToggle={(layerId) => {
            if (layerId === BACKGROUND_LAYER_ID) {
              setBackgroundLayer(prev => ({ ...prev, visible: !prev.visible }));
            } else {
              setLayers(layers.map(layer =>
                layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
              ));
            }
          }}
          onLayerReorder={(fromLayerId, toLayerId) => {
            // 找到原始索引
            const fromIndex = layers.findIndex(l => l.id === fromLayerId);
            const toIndex = layers.findIndex(l => l.id === toLayerId);
            
            if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
              return;
            }
            
            // 重新排序图层
            const newLayers = [...layers];
            const [movedLayer] = newLayers.splice(fromIndex, 1);
            newLayers.splice(toIndex, 0, movedLayer);
            
            // 更新 zIndex
            const updatedLayers = newLayers.map((layer, index) => ({
              ...layer,
              zIndex: index,
            }));
            
            setLayers(updatedLayers);
          }}
          expandedGroups={expandedGroups}
          onToggleGroup={handleToggleGroup}
          isCollapsed={isRightSidebarCollapsed}
          onToggleCollapse={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
        />
      </div>
    </div>
    </LanguageProvider>
  );
}
