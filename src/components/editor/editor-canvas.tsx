'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Hand, Check, X, Plus, Image as ImageIcon, Star, Heart, Circle, Square, Triangle, Hexagon, Lock, Layers, Ungroup, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { LayerToolbar } from './layer-toolbar';

interface BackgroundLayer {
  id: string;
  name: string;
  type: 'background';
  color?: string;
  imageUrl?: string;
  gradient?: string;
  visible: boolean;
  locked: boolean;
}

const BACKGROUND_LAYER_ID = 'background-layer';

interface EditorCanvasProps {
  imageUrl?: string;
  canvasSize?: { width: number; height: number };
  isCropMode?: boolean;
  onCanvasSizeChange?: (width: number, height: number) => void;
  selectedLayout?: any;
  layers?: any[];
  selectedLayerId?: string | null;
  selectedLayerIds?: Set<string>;
  onLayerSelect?: (layerId: string | null, multiSelect?: Set<string>) => void;
  onLayerResize?: (layerId: string, newSize: { width: number; height: number; x: number; y: number }) => void;
  onLayoutFrameImageChange?: (frameId: string, imageUrl: string, layerId?: string) => void;
  backgroundLayer?: BackgroundLayer;
  onLayoutSelect?: () => void; // 触发 layout 选择模式
  onGroupLayers?: (layerIds: string[]) => void;
  onUngroupLayers?: (groupId: string) => void;
  /** 图层工具栏点击（如 enhance）时回调，用于跳转 App 等 */
  onLayerToolSelect?: (tool: string) => void;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onRotateRight90?: () => void;
  onRotateLeft90?: () => void;
  /** Image Enhancer 正在增强的图片 URL；与 imageEnhancerEnhancingInProgress 一起用于画板图层显示「生成中」 */
  imageEnhancerSourceUrl?: string | null;
  /** 左侧 Image Enhancer「增强中」动画是否进行中；为 true 时对应画板图层显示生成中，且不显示对比弹窗 */
  imageEnhancerEnhancingInProgress?: boolean;
  /** Remove BG 正在处理的图片 URL；与 removeBgInProgress 一起用于画板图层显示「生成中」 */
  removeBgSourceUrl?: string | null;
  /** 点击 Remove BG 后为 true，对应图层显示生成中，几秒后完成 */
  removeBgInProgress?: boolean;
  /** 空画布默认态：新建空白 */
  onCreateBlankCanvas?: () => void;
  /** 空画布默认态：打开图片 */
  onOpenImageToCanvas?: () => void;
  /** 空画布默认态：新建拼图 */
  onCreateCollage?: () => void;
  /** 空画布默认态：打开模板 */
  onOpenTemplateToCanvas?: () => void;
  /** 是否显示画布初始默认入口 */
  showCanvasStarter?: boolean;
}

export function EditorCanvas({ 
  imageUrl, 
  canvasSize = { width: 1080, height: 1080 }, 
  isCropMode = false, 
  onCanvasSizeChange,
  selectedLayout,
  layers = [],
  selectedLayerId,
  selectedLayerIds = new Set(),
  onLayerSelect,
  onLayerResize,
  onLayoutFrameImageChange,
  backgroundLayer,
  onLayoutSelect,
  onGroupLayers,
  onUngroupLayers,
  onLayerToolSelect,
  onFlipHorizontal,
  onFlipVertical,
  onRotateRight90,
  onRotateLeft90,
  imageEnhancerSourceUrl,
  imageEnhancerEnhancingInProgress = false,
  removeBgSourceUrl,
  removeBgInProgress = false,
  onCreateBlankCanvas,
  onOpenImageToCanvas,
  onCreateCollage,
  onOpenTemplateToCanvas,
  showCanvasStarter = false,
}: EditorCanvasProps) {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, width: 0, height: 0, offsetX: 0, offsetY: 0 });
  const [cropSize, setCropSize] = useState<{ width: number; height: number } | null>(null);
  const [originalCanvasSize, setOriginalCanvasSize] = useState(canvasSize);
  const [cropOffset, setCropOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 }); // 裁剪框相对于画布中心的偏移
  
  // 图层缩放相关状态
  const [isResizingLayer, setIsResizingLayer] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, layerX: 0, layerY: 0, layerWidth: 100, layerHeight: 100 });
  
  // 图层拖动相关状态
  const [isDraggingLayer, setIsDraggingLayer] = useState(false);
  const [dragLayerStart, setDragLayerStart] = useState({ x: 0, y: 0, layerX: 0, layerY: 0 });
  const [layerClickStart, setLayerClickStart] = useState<{ x: number; y: number; time: number } | null>(null);
  
  // 框选相关状态
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // 计算画布显示尺寸，保持宽高比并适应容器
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  
  // 计算裁剪框显示尺寸
  const getCropDisplaySize = () => {
    if (!cropSize || !containerRef.current) return { width: 0, height: 0 };
    
    const containerWidth = containerRef.current.clientWidth - 64;
    const containerHeight = containerRef.current.clientHeight - 64;
    const aspectRatio = cropSize.width / cropSize.height;
    
    // 使用原始画布的缩放比例来计算裁剪框的显示尺寸
    const scaleX = displaySize.width / canvasSize.width;
    const scaleY = displaySize.height / canvasSize.height;
    const scale = Math.min(scaleX, scaleY);
    
    return {
      width: cropSize.width * scale,
      height: cropSize.height * scale,
    };
  };

  // 画布显示比例：略小于容器，为背景图层悬浮 toolbar（约 60px 在上方）留出空间，避免被常驻 toolbar 挡住
  const DISPLAY_SCALE = 0.88;

  useEffect(() => {
    const updateDisplaySize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 64; // 减去 padding
        const containerHeight = containerRef.current.clientHeight - 64;
        const aspectRatio = canvasSize.width / canvasSize.height;
        const maxWidth = containerWidth * DISPLAY_SCALE;
        const maxHeight = containerHeight * DISPLAY_SCALE;

        let displayWidth = maxWidth;
        let displayHeight = displayWidth / aspectRatio;

        if (displayHeight > maxHeight) {
          displayHeight = maxHeight;
          displayWidth = displayHeight * aspectRatio;
        }

        setDisplaySize({ width: displayWidth, height: displayHeight });
      }
    };

    updateDisplaySize();
    window.addEventListener('resize', updateDisplaySize);
    return () => window.removeEventListener('resize', updateDisplaySize);
  }, [canvasSize]);

  const cropDisplaySize = getCropDisplaySize();
  const showCropBox = isCropMode && cropSize && (cropSize.width !== canvasSize.width || cropSize.height !== canvasSize.height);

  // 当进入 crop 模式时，保存原始尺寸
  useEffect(() => {
    if (isCropMode && !cropSize) {
      setOriginalCanvasSize(canvasSize);
      setCropSize(canvasSize);
      setCropOffset({ x: 0, y: 0 });
    } else if (!isCropMode) {
      setCropSize(null);
      setCropOffset({ x: 0, y: 0 });
    }
  }, [isCropMode, cropSize]);

  // 当在 crop 模式下，canvasSize 改变时，同步更新 cropSize（贴合新尺寸边缘）
  useEffect(() => {
    if (isCropMode && cropSize) {
      setCropSize(canvasSize);
      setOriginalCanvasSize(canvasSize);
    }
  }, [canvasSize, isCropMode]);

  // 处理拖动开始
  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragHandle(handle);
    const currentSize = cropSize || canvasSize;
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: currentSize.width,
      height: currentSize.height,
      offsetX: cropOffset.x,
      offsetY: cropOffset.y,
    });
  };

  // 确认裁剪
  const handleConfirmCrop = () => {
    if (cropSize) {
      onCanvasSizeChange?.(cropSize.width, cropSize.height);
      setOriginalCanvasSize(cropSize);
      setCropSize(null);
    }
  };

  // 取消裁剪
  const handleCancelCrop = () => {
    if (originalCanvasSize) {
      onCanvasSizeChange?.(originalCanvasSize.width, originalCanvasSize.height);
      setCropSize(originalCanvasSize);
    }
  };

  // 处理拖动
  useEffect(() => {
    if (!isDragging || !dragHandle) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth - 64;
      const containerHeight = containerRef.current.clientHeight - 64;
      const scaleX = canvasSize.width / displaySize.width;
      const scaleY = canvasSize.height / displaySize.height;

      const deltaX = (e.clientX - dragStart.x) * scaleX;
      const deltaY = (e.clientY - dragStart.y) * scaleY;

      let newWidth = dragStart.width;
      let newHeight = dragStart.height;
      let newOffsetX = dragStart.offsetX;
      let newOffsetY = dragStart.offsetY;

      switch (dragHandle) {
        case 'nw': // 左上角 - 右下角固定不动
          {
            const oldRight = dragStart.offsetX + dragStart.width / 2;
            const oldBottom = dragStart.offsetY + dragStart.height / 2;
            newWidth = Math.max(100, dragStart.width - deltaX);
            newHeight = Math.max(100, dragStart.height - deltaY);
            // 保持右下角位置不变
            newOffsetX = oldRight - newWidth / 2;
            newOffsetY = oldBottom - newHeight / 2;
          }
          break;
        case 'ne': // 右上角 - 左下角固定不动
          {
            const oldLeft = dragStart.offsetX - dragStart.width / 2;
            const oldBottom = dragStart.offsetY + dragStart.height / 2;
            newWidth = Math.max(100, dragStart.width + deltaX);
            newHeight = Math.max(100, dragStart.height - deltaY);
            // 保持左下角位置不变
            newOffsetX = oldLeft + newWidth / 2;
            newOffsetY = oldBottom - newHeight / 2;
          }
          break;
        case 'sw': // 左下角 - 右上角固定不动
          {
            const oldRight = dragStart.offsetX + dragStart.width / 2;
            const oldTop = dragStart.offsetY - dragStart.height / 2;
            newWidth = Math.max(100, dragStart.width - deltaX);
            newHeight = Math.max(100, dragStart.height + deltaY);
            // 保持右上角位置不变
            newOffsetX = oldRight - newWidth / 2;
            newOffsetY = oldTop + newHeight / 2;
          }
          break;
        case 'se': // 右下角 - 左上角固定不动
          {
            const oldLeft = dragStart.offsetX - dragStart.width / 2;
            const oldTop = dragStart.offsetY - dragStart.height / 2;
            newWidth = Math.max(100, dragStart.width + deltaX);
            newHeight = Math.max(100, dragStart.height + deltaY);
            // 保持左上角位置不变
            newOffsetX = oldLeft + newWidth / 2;
            newOffsetY = oldTop + newHeight / 2;
          }
          break;
        case 'n': // 上边 - 下边固定不动
          {
            const oldBottom = dragStart.offsetY + dragStart.height / 2;
            newHeight = Math.max(100, dragStart.height - deltaY);
            // 保持下边位置不变
            newOffsetY = oldBottom - newHeight / 2;
          }
          break;
        case 's': // 下边 - 上边固定不动
          {
            const oldTop = dragStart.offsetY - dragStart.height / 2;
            newHeight = Math.max(100, dragStart.height + deltaY);
            // 保持上边位置不变
            newOffsetY = oldTop + newHeight / 2;
          }
          break;
        case 'w': // 左边 - 右边固定不动
          {
            const oldRight = dragStart.offsetX + dragStart.width / 2;
            newWidth = Math.max(100, dragStart.width - deltaX);
            // 保持右边位置不变
            newOffsetX = oldRight - newWidth / 2;
          }
          break;
        case 'e': // 右边 - 左边固定不动
          {
            const oldLeft = dragStart.offsetX - dragStart.width / 2;
            newWidth = Math.max(100, dragStart.width + deltaX);
            // 保持左边位置不变
            newOffsetX = oldLeft + newWidth / 2;
          }
          break;
      }

      const newSize = { width: Math.round(newWidth), height: Math.round(newHeight) };
      setCropSize(newSize);
      setCropOffset({ x: newOffsetX, y: newOffsetY });
      // 不立即更新画布，等确认后再更新
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragHandle(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragHandle, dragStart, cropSize, cropOffset, displaySize, onCanvasSizeChange]);

  // 处理图层缩放
  useEffect(() => {
    if (!isResizingLayer || !resizeHandle || !selectedLayerId) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth - 64;
      const containerHeight = containerRef.current.clientHeight - 64;
      const scaleX = canvasSize.width / displaySize.width;
      const scaleY = canvasSize.height / displaySize.height;

      const deltaX = (e.clientX - resizeStart.x) * scaleX;
      const deltaY = (e.clientY - resizeStart.y) * scaleY;

      // 转换为百分比
      const deltaXPercent = (deltaX / canvasSize.width) * 100;
      const deltaYPercent = (deltaY / canvasSize.height) * 100;

      let newX = resizeStart.layerX;
      let newY = resizeStart.layerY;
      let newWidth = resizeStart.layerWidth;
      let newHeight = resizeStart.layerHeight;

      switch (resizeHandle) {
        case 'nw': // 左上角
          {
            const oldRight = resizeStart.layerX + resizeStart.layerWidth;
            const oldBottom = resizeStart.layerY + resizeStart.layerHeight;
            newWidth = Math.max(5, resizeStart.layerWidth - deltaXPercent);
            newHeight = Math.max(5, resizeStart.layerHeight - deltaYPercent);
            newX = oldRight - newWidth;
            newY = oldBottom - newHeight;
          }
          break;
        case 'ne': // 右上角
          {
            const oldLeft = resizeStart.layerX;
            const oldBottom = resizeStart.layerY + resizeStart.layerHeight;
            newWidth = Math.max(5, resizeStart.layerWidth + deltaXPercent);
            newHeight = Math.max(5, resizeStart.layerHeight - deltaYPercent);
            newX = oldLeft;
            newY = oldBottom - newHeight;
          }
          break;
        case 'sw': // 左下角
          {
            const oldRight = resizeStart.layerX + resizeStart.layerWidth;
            const oldTop = resizeStart.layerY;
            newWidth = Math.max(5, resizeStart.layerWidth - deltaXPercent);
            newHeight = Math.max(5, resizeStart.layerHeight + deltaYPercent);
            newX = oldRight - newWidth;
            newY = oldTop;
          }
          break;
        case 'se': // 右下角
          {
            const oldLeft = resizeStart.layerX;
            const oldTop = resizeStart.layerY;
            newWidth = Math.max(5, resizeStart.layerWidth + deltaXPercent);
            newHeight = Math.max(5, resizeStart.layerHeight + deltaYPercent);
            newX = oldLeft;
            newY = oldTop;
          }
          break;
        case 'n': // 上边
          {
            const oldBottom = resizeStart.layerY + resizeStart.layerHeight;
            newHeight = Math.max(5, resizeStart.layerHeight - deltaYPercent);
            newY = oldBottom - newHeight;
          }
          break;
        case 's': // 下边
          {
            const oldTop = resizeStart.layerY;
            newHeight = Math.max(5, resizeStart.layerHeight + deltaYPercent);
            newY = oldTop;
          }
          break;
        case 'w': // 左边
          {
            const oldRight = resizeStart.layerX + resizeStart.layerWidth;
            newWidth = Math.max(5, resizeStart.layerWidth - deltaXPercent);
            newX = oldRight - newWidth;
          }
          break;
        case 'e': // 右边
          {
            const oldLeft = resizeStart.layerX;
            newWidth = Math.max(5, resizeStart.layerWidth + deltaXPercent);
            newX = oldLeft;
          }
          break;
      }

      // 限制在画布范围内
      newX = Math.max(0, Math.min(100 - newWidth, newX));
      newY = Math.max(0, Math.min(100 - newHeight, newY));

      onLayerResize?.(selectedLayerId, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      setIsResizingLayer(false);
      setResizeHandle(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLayer, resizeHandle, resizeStart, selectedLayerId, canvasSize, displaySize, onLayerResize]);

  // 处理图层拖动
  useEffect(() => {
    if (!isDraggingLayer || !selectedLayerId || isResizingLayer) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // 计算鼠标移动的像素距离
      const deltaXPx = e.clientX - dragLayerStart.x;
      const deltaYPx = e.clientY - dragLayerStart.y;

      // 使用 displaySize 来计算，因为它已经考虑了缩放和宽高比
      const canvasDisplayWidth = displaySize.width;
      const canvasDisplayHeight = displaySize.height;

      // 将鼠标移动的像素转换为画布的百分比
      const deltaXPercent = (deltaXPx / canvasDisplayWidth) * 100;
      const deltaYPercent = (deltaYPx / canvasDisplayHeight) * 100;

      const selectedLayer = layers.find(l => l.id === selectedLayerId);
      if (!selectedLayer) return;

      const layerWidth = selectedLayer.width ?? 100;
      const layerHeight = selectedLayer.height ?? 100;

      let newX = dragLayerStart.layerX + deltaXPercent;
      let newY = dragLayerStart.layerY + deltaYPercent;

      // 限制在画布范围内
      newX = Math.max(0, Math.min(100 - layerWidth, newX));
      newY = Math.max(0, Math.min(100 - layerHeight, newY));

      onLayerResize?.(selectedLayerId, {
        x: newX,
        y: newY,
        width: layerWidth,
        height: layerHeight,
      });
    };

    const handleMouseUp = () => {
      setIsDraggingLayer(false);
      setLayerClickStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLayer, dragLayerStart, selectedLayerId, layers, canvasSize, displaySize, isResizingLayer, onLayerResize]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleFullscreen = () => {
    if (canvasRef.current?.requestFullscreen) {
      canvasRef.current.requestFullscreen();
    }
  };

  // 框选功能：拖拽选择多个图层
  useEffect(() => {
    if (!containerRef.current || isCropMode || isResizingLayer || isDraggingLayer) return;

    let isSelectingBox = false;
    let startPos: { x: number; y: number } | null = null;
    let currentBox: { startX: number; startY: number; endX: number; endY: number } | null = null;

    const handleMouseDown = (e: MouseEvent) => {
      // 只在未选中任何图层且点击空白区域时开始框选
      if (!selectedLayerId && selectedLayerIds.size === 0 && e.button === 0) {
        const target = e.target as HTMLElement;
        // 检查是否点击在画布空白区域（不是图层元素）
        const isLayerElement = target.closest('[data-layer-id]') || target.closest('.layer-element');
        const isCanvasBackground = target === containerRef.current || target.closest('.canvas-background');
        
        if (!isLayerElement && isCanvasBackground) {
          const rect = containerRef.current!.getBoundingClientRect();
          const startX = e.clientX - rect.left;
          const startY = e.clientY - rect.top;
          
          startPos = { x: startX, y: startY };
          isSelectingBox = true;
          currentBox = { startX, startY, endX: startX, endY: startY };
          
          setIsSelecting(true);
          setSelectionBox(currentBox);
        }
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSelectingBox || !startPos || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      currentBox = {
        startX: startPos.x,
        startY: startPos.y,
        endX: currentX,
        endY: currentY,
      };
      setSelectionBox(currentBox);
    };
    
    const handleMouseUp = () => {
      if (!isSelectingBox || !currentBox || !containerRef.current) {
        if (isSelectingBox) {
          // 如果只是点击没有拖拽，取消选中
          onLayerSelect?.(null);
        }
        isSelectingBox = false;
        setIsSelecting(false);
        setSelectionBox(null);
        startPos = null;
        currentBox = null;
        return;
      }
      
      // 获取画布元素的位置
      const canvasElement = containerRef.current.querySelector('.canvas-background') as HTMLElement;
      if (!canvasElement) {
        isSelectingBox = false;
        setIsSelecting(false);
        setSelectionBox(null);
        startPos = null;
        currentBox = null;
        return;
      }
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // 计算框选区域相对于容器的坐标
      const minX = Math.min(currentBox.startX, currentBox.endX);
      const maxX = Math.max(currentBox.startX, currentBox.endX);
      const minY = Math.min(currentBox.startY, currentBox.endY);
      const maxY = Math.max(currentBox.startY, currentBox.endY);
      
      // 转换为相对于画布的坐标（考虑画布在容器中的位置和缩放）
      const canvasOffsetX = canvasRect.left - containerRect.left;
      const canvasOffsetY = canvasRect.top - containerRect.top;
      
      // 计算缩放比例
      const scaleX = canvasRect.width / (displaySize.width * zoom);
      const scaleY = canvasRect.height / (displaySize.height * zoom);
      
      // 框选区域相对于画布的坐标（考虑缩放）
      const selectionMinX = (minX - canvasOffsetX) / scaleX;
      const selectionMaxX = (maxX - canvasOffsetX) / scaleX;
      const selectionMinY = (minY - canvasOffsetY) / scaleY;
      const selectionMaxY = (maxY - canvasOffsetY) / scaleY;
      
      // 检测哪些图层在框选区域内（排除 background 和 group）
      const selectedIds = new Set<string>();
      layers.forEach(layer => {
        // 排除 background 图层和 group 图层
        if (layer.isGroup || layer.type === 'background' || layer.id === BACKGROUND_LAYER_ID) {
          return;
        }
        
        // 图层在画布上的实际像素位置（百分比转像素）
        const layerX = (layer.x ?? 0) * displaySize.width / 100;
        const layerY = (layer.y ?? 0) * displaySize.height / 100;
        const layerWidth = (layer.width ?? 100) * displaySize.width / 100;
        const layerHeight = (layer.height ?? 100) * displaySize.height / 100;
        
        // 检查图层是否与框选区域相交
        const layerRight = layerX + layerWidth;
        const layerBottom = layerY + layerHeight;
        
        // 检查是否有重叠（矩形相交检测）
        const hasOverlap = !(layerRight < selectionMinX || layerX > selectionMaxX || layerBottom < selectionMinY || layerY > selectionMaxY);
        
        if (hasOverlap) {
          selectedIds.add(layer.id);
        }
      });
      
      if (selectedIds.size > 0) {
        onLayerSelect?.(null, selectedIds);
      } else {
        onLayerSelect?.(null);
      }
      
      isSelectingBox = false;
      setIsSelecting(false);
      setSelectionBox(null);
      startPos = null;
      currentBox = null;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    selectedLayerId, 
    selectedLayerIds.size,
    isCropMode, 
    isResizingLayer, 
    isDraggingLayer, 
    layers,
    displaySize.width, 
    displaySize.height, 
    zoom, 
    onLayerSelect
  ]);

  // 计算选中图层的中心位置（用于显示 group/ungroup 按钮）
  const getSelectedLayersCenter = () => {
    if (selectedLayerIds.size > 0) {
      // 过滤掉 background 图层
      const selectedLayers = layers.filter(l => 
        selectedLayerIds.has(l.id) && 
        !l.isGroup && 
        l.type !== 'background' && 
        l.id !== BACKGROUND_LAYER_ID
      );
      
      if (selectedLayers.length === 0) return null;
      
      // 计算所有选中图层的边界框
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      selectedLayers.forEach(layer => {
        const x = layer.x ?? 0;
        const y = layer.y ?? 0;
        const width = layer.width ?? 100;
        const height = layer.height ?? 100;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
      });
      
      return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    }
    
    if (selectedLayerId) {
      const layer = layers.find(l => l.id === selectedLayerId);
      if (layer) {
        if (layer.isGroup) {
          // 对于 group 图层，计算其所有子图层的边界框中心
          const childLayers = layers.filter(l => (l as any).groupId === layer.id);
          if (childLayers.length > 0) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            childLayers.forEach(child => {
              const x = child.x ?? 0;
              const y = child.y ?? 0;
              const width = child.width ?? 100;
              const height = child.height ?? 100;
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x + width);
              maxY = Math.max(maxY, y + height);
            });
            return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
          }
          // 如果没有子图层，使用 group 图层自己的位置
          return { x: layer.x ?? 50, y: layer.y ?? 50 };
        } else {
          // 普通图层
          return { x: (layer.x ?? 0) + (layer.width ?? 100) / 2, y: (layer.y ?? 0) + (layer.height ?? 100) / 2 };
        }
      }
    }
    
    return null;
  };

  const selectedCenter = getSelectedLayersCenter();

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden" ref={canvasRef}>
      {/* 画布内容区域 */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center p-8"
        onMouseDown={(e) => {
          // 如果点击的是容器本身（空白区域），允许框选
          if (e.target === e.currentTarget) {
            // 不阻止事件，让框选功能处理
          }
        }}
        onClick={(e) => {
          // 如果点击的是容器本身（空白区域），取消选中
          if (e.target === e.currentTarget && !isSelecting) {
            onLayerSelect?.(null);
          }
        }}
      >
        {/* 框选框 - 显示在容器上 */}
        {isSelecting && selectionBox && (
          <div
            className="absolute border-2 border-teal-500 bg-teal-500/10 pointer-events-none z-50"
            style={{
              left: `${Math.min(selectionBox.startX, selectionBox.endX)}px`,
              top: `${Math.min(selectionBox.startY, selectionBox.endY)}px`,
              width: `${Math.abs(selectionBox.endX - selectionBox.startX)}px`,
              height: `${Math.abs(selectionBox.endY - selectionBox.startY)}px`,
            }}
          />
        )}
        
        {/* Group 选中框 - 显示在容器上 */}
        {selectedLayerId && (() => {
          const selectedLayer = layers.find(l => l.id === selectedLayerId);
          if (selectedLayer && selectedLayer.isGroup) {
            // 计算 group 所有子图层的边界框
            const childLayers = layers.filter(l => (l as any).groupId === selectedLayer.id);
            if (childLayers.length > 0) {
              let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
              childLayers.forEach(child => {
                const x = child.x ?? 0;
                const y = child.y ?? 0;
                const width = child.width ?? 100;
                const height = child.height ?? 100;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x + width);
                maxY = Math.max(maxY, y + height);
              });
              
              // 添加一些边距，让选中框更明显
              const padding = 2;
              minX = Math.max(0, minX - padding);
              minY = Math.max(0, minY - padding);
              maxX = Math.min(100, maxX + padding);
              maxY = Math.min(100, maxY + padding);
              
              return (
                <div
                  className="absolute border-2 border-teal-500 pointer-events-none z-40"
                  style={{
                    left: `${minX}%`,
                    top: `${minY}%`,
                    width: `${maxX - minX}%`,
                    height: `${maxY - minY}%`,
                  }}
                />
              );
            }
          }
          return null;
        })()}
        
        {/* Group/Ungroup 按钮 - 显示在容器上 */}
        {selectedCenter && (
          <div
            className="absolute z-50"
            style={{
              left: `calc(50% + ${(selectedCenter.x - 50) * displaySize.width * zoom / 100}px)`,
              top: `calc(50% + ${(selectedCenter.y - 50) * displaySize.height * zoom / 100}px - 40px)`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {selectedLayerIds.size > 1 ? (
              <button
                onClick={() => {
                  // 过滤掉 background 图层
                  const validIds = Array.from(selectedLayerIds).filter(id => {
                    const layer = layers.find(l => l.id === id);
                    return layer && layer.type !== 'background' && layer.id !== BACKGROUND_LAYER_ID && !layer.isGroup;
                  });
                  if (validIds.length > 1) {
                    onGroupLayers?.(validIds);
                  }
                  onLayerSelect?.(null);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-lg transition-colors text-sm font-medium"
              >
                <Layers className="w-4 h-4" />
                <span>{t.group}</span>
              </button>
            ) : selectedLayerId && layers.find(l => l.id === selectedLayerId)?.isGroup ? (
              <button
                onClick={() => {
                  onUngroupLayers?.(selectedLayerId);
                  onLayerSelect?.(null);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-lg transition-colors text-sm font-medium"
              >
                <Ungroup className="w-4 h-4" />
                <span>{t.ungroup}</span>
              </button>
            ) : null}
          </div>
        )}
        
        {/* 原画布（作为背景） */}
        <div
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'center',
            width: displaySize.width || 'auto',
            height: displaySize.height || 'auto',
            position: 'relative',
          }}
          className="relative"
        >
          {layers.length > 0 || selectedLayout ? (
            // 显示所有图层
            <div 
              className="shadow-lg relative canvas-background"
              style={{ 
                width: displaySize.width, 
                height: displaySize.height,
                backgroundColor: backgroundLayer?.color || '#FFFFFF',
                backgroundImage: backgroundLayer?.imageUrl 
                  ? `url(${backgroundLayer.imageUrl})` 
                  : backgroundLayer?.gradient || 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={(e) => {
                // 点击画布背景时选中背景图层
                if (e.target === e.currentTarget && !isSelecting) {
                  onLayerSelect?.(backgroundLayer?.id || null);
                }
              }}
            >
              {/* 背景图层选中边框 */}
              {selectedLayerId === backgroundLayer?.id && (
                <div className="absolute inset-0 border-2 border-teal-500 pointer-events-none z-50" />
              )}
              {/* 背景图层选中时显示悬浮工具栏（无 crop / align / copy / download） */}
              {selectedLayerId === backgroundLayer?.id && (
                <LayerToolbar
                  visible={true}
                  layerType="background"
                  canvasZoom={zoom}
                  onToolSelect={(tool) => onLayerToolSelect?.(tool)}
                  onFlipHorizontal={onFlipHorizontal}
                  onFlipVertical={onFlipVertical}
                  onRotateRight90={onRotateRight90}
                  onRotateLeft90={onRotateLeft90}
                />
              )}
              {/* 渲染所有图层 - 按 zIndex 排序 */}
              {layers
                .filter(layer => layer.visible !== false && !layer.isGroup) // 不渲染 group 图层本身，只渲染其子图层
                .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
                .map((layer) => {
                  if (layer.type === 'layout' && layer.layout) {
                    const layerX = layer.x ?? 0;
                    const layerY = layer.y ?? 0;
                    const layerWidth = layer.width ?? 100;
                    const layerHeight = layer.height ?? 100;
                    const isSelected = selectedLayerId === layer.id || selectedLayerIds.has(layer.id);
                    
                    return (
                      <div 
                        key={layer.id} 
                        className="absolute"
                        style={{
                          left: `${layerX}%`,
                          top: `${layerY}%`,
                          width: `${layerWidth}%`,
                          height: `${layerHeight}%`,
                          zIndex: layer.zIndex ?? 0,
                          cursor: isSelected && !layer.locked ? 'move' : 'default',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Shift+单击：多选模式
                          if (e.shiftKey) {
                            const currentSelected = new Set(selectedLayerIds);
                            if (currentSelected.has(layer.id)) {
                              // 如果已选中，则取消选中
                              currentSelected.delete(layer.id);
                              if (currentSelected.size > 0) {
                                onLayerSelect?.(null, currentSelected);
                              } else {
                                onLayerSelect?.(null);
                              }
                            } else {
                              // 如果未选中，则添加到多选
                              currentSelected.add(layer.id);
                              onLayerSelect?.(null, currentSelected);
                            }
                          } else {
                            // 普通单击：单选模式
                            onLayerSelect?.(layer.id);
                          }
                        }}
                        onMouseDown={(e) => {
                          // 如果图层已选中且未锁定，按下鼠标时开始拖动
                          if ((selectedLayerId === layer.id || selectedLayerIds.has(layer.id)) && !isResizingLayer && !layer.locked) {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsDraggingLayer(true);
                            setDragLayerStart({
                              x: e.clientX,
                              y: e.clientY,
                              layerX: layerX,
                              layerY: layerY,
                            });
                          }
                        }}
                      >
                        {/* 图层内容容器 */}
                        <div className="absolute inset-0 overflow-hidden">
                          {layer.layout.frames.map((frame: any) => (
                            <div
                              key={frame.id}
                              className={`absolute border-2 border-dashed border-gray-300 bg-gray-50 transition-colors group ${
                                layer.locked ? 'cursor-not-allowed' : 'hover:border-teal-500 hover:bg-teal-50'
                              }`}
                              style={{
                                left: `${frame.x}%`,
                                top: `${frame.y}%`,
                                width: `${frame.width}%`,
                                height: `${frame.height}%`,
                              }}
                              onClick={(e) => {
                                // 点击元素时选中该图层
                                e.stopPropagation();
                                // Shift+单击：多选模式
                                if (e.shiftKey) {
                                  const currentSelected = new Set(selectedLayerIds);
                                  if (currentSelected.has(layer.id)) {
                                    // 如果已选中，则取消选中
                                    currentSelected.delete(layer.id);
                                    if (currentSelected.size > 0) {
                                      onLayerSelect?.(null, currentSelected);
                                    } else {
                                      onLayerSelect?.(null);
                                    }
                                  } else {
                                    // 如果未选中，则添加到多选
                                    currentSelected.add(layer.id);
                                    onLayerSelect?.(null, currentSelected);
                                  }
                                } else {
                                  // 普通单击：单选模式
                                  onLayerSelect?.(layer.id);
                                }
                              }}
                              onMouseDown={(e) => {
                                // 如果图层已选中且未锁定，按下鼠标时开始拖动
                                if ((selectedLayerId === layer.id || selectedLayerIds.has(layer.id)) && !isResizingLayer && !layer.locked) {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setIsDraggingLayer(true);
                                  setDragLayerStart({
                                    x: e.clientX,
                                    y: e.clientY,
                                    layerX: layerX,
                                    layerY: layerY,
                                  });
                                }
                              }}
                            >
                            {frame.imageUrl ? (
                              <div className="w-full h-full relative">
                                <img
                                  src={frame.imageUrl}
                                  alt={`Frame ${frame.id}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) {
                                        const url = URL.createObjectURL(file);
                                        onLayoutFrameImageChange?.(frame.id, url, layer.id);
                                      }
                                    };
                                    input.click();
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                                  title={t.changeImage}
                                >
                                  <ImageIcon className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                      const url = URL.createObjectURL(file);
                                      onLayoutFrameImageChange?.(frame.id, url, layer.id);
                                    }
                                  };
                                  input.click();
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="w-full h-full flex flex-col items-center justify-center hover:bg-teal-50 transition-colors"
                              >
                                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500">Add Image</span>
                              </button>
                            )}
                          </div>
                        ))}
                        </div>
                        
                        {/* 选中图层的8个操作点 */}
                        {isSelected && !layer.locked && (
                          <>
                            {/* 四个角的操作点 */}
                            <div
                              className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false); // 停止拖动
                                setResizeHandle('nw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'nwse-resize' }}
                            />
                            {/* 四个角的操作点 */}
                            <div
                              className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('nw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'nwse-resize' }}
                            />
                            <div
                              className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('ne');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'nesw-resize' }}
                            />
                            <div
                              className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('sw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'nesw-resize' }}
                            />
                            <div
                              className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('se');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'nwse-resize' }}
                            />
                            
                            {/* 四条边的操作点 */}
                            <div
                              className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ns-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('n');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'ns-resize' }}
                            />
                            <div
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ns-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('s');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'ns-resize' }}
                            />
                            <div
                              className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ew-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('w');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'ew-resize' }}
                            />
                            <div
                              className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ew-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('e');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'ew-resize' }}
                            />
                            
                            {/* 选中边框 */}
                            <div className="absolute inset-0 border-2 border-teal-500 pointer-events-none" />
                            
                            {/* 编辑悬浮栏 */}
                            <LayerToolbar 
                              visible={isSelected && !layer.locked}
                              layerType="layout"
                              canvasZoom={zoom}
                              onToolSelect={(tool) => onLayerToolSelect?.(tool)}
                              onLayoutSelect={onLayoutSelect}
                            />
                          </>
                        )}
                        
                        {/* 锁定状态指示器 */}
                        {isSelected && layer.locked && (
                          <>
                            <div className="absolute inset-0 border-2 border-amber-500 pointer-events-none" />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 whitespace-nowrap z-50">
                              <Lock className="w-3 h-3" />
                              <span>{t.locked}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  
                  // 文本图层渲染
                  if (layer.type === 'text') {
                    const layerX = layer.x ?? 10;
                    const layerY = layer.y ?? 10;
                    const layerWidth = layer.width ?? 80;
                    const layerHeight = layer.height ?? 20;
                    const isSelected = selectedLayerId === layer.id || selectedLayerIds.has(layer.id);
                    
                    return (
                      <div 
                        key={layer.id} 
                        className="absolute"
                        style={{
                          left: `${layerX}%`,
                          top: `${layerY}%`,
                          width: `${layerWidth}%`,
                          minHeight: `${layerHeight}%`,
                          zIndex: layer.zIndex ?? 0,
                          cursor: isSelected && !layer.locked ? 'move' : 'default',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Shift+单击：多选模式
                          if (e.shiftKey) {
                            const currentSelected = new Set(selectedLayerIds);
                            if (currentSelected.has(layer.id)) {
                              // 如果已选中，则取消选中
                              currentSelected.delete(layer.id);
                              if (currentSelected.size > 0) {
                                onLayerSelect?.(null, currentSelected);
                              } else {
                                onLayerSelect?.(null);
                              }
                            } else {
                              // 如果未选中，则添加到多选
                              currentSelected.add(layer.id);
                              onLayerSelect?.(null, currentSelected);
                            }
                          } else {
                            // 普通单击：单选模式
                            onLayerSelect?.(layer.id);
                          }
                        }}
                        onMouseDown={(e) => {
                          // 锁定的图层不能拖动
                          if ((selectedLayerId === layer.id || selectedLayerIds.has(layer.id)) && !isResizingLayer && !layer.locked) {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsDraggingLayer(true);
                            setDragLayerStart({
                              x: e.clientX,
                              y: e.clientY,
                              layerX: layerX,
                              layerY: layerY,
                            });
                          }
                        }}
                      >
                        {/* 文本内容 */}
                        <div 
                          className={`px-2 py-1 ${layer.textStyle || ''}`}
                          style={{
                            fontSize: layer.fontSize || '24px',
                            fontWeight: layer.fontWeight || 'normal',
                            fontStyle: layer.fontWeight === 'italic' ? 'italic' : 'normal',
                          }}
                        >
                          {layer.text}
                        </div>
                        
                        {/* 选中状态 UI */}
                        {isSelected && !layer.locked && (
                          <>
                            {/* 四个角的操作点 */}
                            <div
                              className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('nw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('ne');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('sw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('se');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            {/* 选中边框 */}
                            <div className="absolute inset-0 border-2 border-teal-500 pointer-events-none rounded" />
                            
                            {/* 编辑悬浮栏 */}
                            <LayerToolbar 
                              visible={isSelected && !layer.locked}
                              layerType="text"
                              canvasZoom={zoom}
                              onToolSelect={(tool) => onLayerToolSelect?.(tool)}
                            />
                          </>
                        )}
                        
                        {/* 锁定状态指示器 */}
                        {isSelected && layer.locked && (
                          <>
                            <div className="absolute inset-0 border-2 border-amber-500 pointer-events-none rounded" />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 whitespace-nowrap z-50">
                              <Lock className="w-3 h-3" />
                              <span>{t.locked}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  
                  // 图片图层渲染
                  if (layer.type === 'image') {
                    const layerX = layer.x ?? 10;
                    const layerY = layer.y ?? 10;
                    const layerWidth = layer.width ?? 50;
                    const layerHeight = layer.height ?? 50;
                    const isSelected = selectedLayerId === layer.id || selectedLayerIds.has(layer.id);
                    
                    return (
                      <div 
                        key={layer.id} 
                        className="absolute layer-element"
                        data-layer-id={layer.id}
                        style={{
                          left: `${layerX}%`,
                          top: `${layerY}%`,
                          width: `${layerWidth}%`,
                          height: `${layerHeight}%`,
                          zIndex: layer.zIndex ?? 0,
                          cursor: isSelected && !layer.locked ? 'move' : 'default',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Shift+单击：多选模式
                          if (e.shiftKey) {
                            const currentSelected = new Set(selectedLayerIds);
                            if (currentSelected.has(layer.id)) {
                              // 如果已选中，则取消选中
                              currentSelected.delete(layer.id);
                              if (currentSelected.size > 0) {
                                onLayerSelect?.(null, currentSelected);
                              } else {
                                onLayerSelect?.(null);
                              }
                            } else {
                              // 如果未选中，则添加到多选
                              currentSelected.add(layer.id);
                              onLayerSelect?.(null, currentSelected);
                            }
                          } else {
                            // 普通单击：单选模式
                            onLayerSelect?.(layer.id);
                          }
                        }}
                        onMouseDown={(e) => {
                          // 锁定的图层不能拖动
                          if ((selectedLayerId === layer.id || selectedLayerIds.has(layer.id)) && !isResizingLayer && !layer.locked) {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsDraggingLayer(true);
                            setDragLayerStart({
                              x: e.clientX,
                              y: e.clientY,
                              layerX: layerX,
                              layerY: layerY,
                            });
                          }
                        }}
                      >
                        {/* 图片内容；增强中或 Remove BG 生成中时该图层显示「生成中」 */}
                        {(imageEnhancerEnhancingInProgress && layer.imageUrl === imageEnhancerSourceUrl) || (removeBgInProgress && layer.imageUrl === removeBgSourceUrl) ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100 rounded z-[1]">
                            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                            <span className="text-xs font-medium text-gray-600">{t.imageEnhancerGenerating}</span>
                          </div>
                        ) : (
                          <img
                            src={layer.imageUrl}
                            alt={layer.name || 'Image'}
                            className="w-full h-full object-cover rounded"
                            draggable={false}
                          />
                        )}
                        
                        {/* 选中状态 UI */}
                        {isSelected && !layer.locked && (
                          <>
                            {/* 四个角的操作点 */}
                            <div
                              className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('nw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('ne');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('sw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('se');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            {/* 选中边框 */}
                            <div className="absolute inset-0 border-2 border-teal-500 pointer-events-none rounded" />
                            
                            {/* 编辑悬浮栏 */}
                            <LayerToolbar 
                              visible={isSelected && !layer.locked}
                              layerType="image"
                              canvasZoom={zoom}
                              onToolSelect={(tool) => {
                                onLayerToolSelect?.(tool);
                              }}
                              onFlipHorizontal={onFlipHorizontal}
                              onFlipVertical={onFlipVertical}
                              onRotateRight90={onRotateRight90}
                              onRotateLeft90={onRotateLeft90}
                            />
                          </>
                        )}
                        
                        {/* 锁定状态指示器 */}
                        {isSelected && layer.locked && (
                          <>
                            <div className="absolute inset-0 border-2 border-amber-500 pointer-events-none rounded" />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 whitespace-nowrap z-50">
                              <Lock className="w-3 h-3" />
                              <span>{t.locked}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  
                  // 形状图层渲染
                  if (layer.type === 'shape') {
                    const layerX = layer.x ?? 20;
                    const layerY = layer.y ?? 20;
                    const layerWidth = layer.width ?? 15;
                    const layerHeight = layer.height ?? 15;
                    const isSelected = selectedLayerId === layer.id || selectedLayerIds.has(layer.id);
                    
                    // 图标映射
                    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                      star: Star,
                      heart: Heart,
                      circle: Circle,
                      square: Square,
                      triangle: Triangle,
                      hexagon: Hexagon,
                    };
                    
                    const IconComponent = layer.icon ? iconMap[layer.icon] : null;
                    
                    return (
                      <div 
                        key={layer.id} 
                        className="absolute flex items-center justify-center layer-element"
                        data-layer-id={layer.id}
                        style={{
                          left: `${layerX}%`,
                          top: `${layerY}%`,
                          width: `${layerWidth}%`,
                          height: `${layerHeight}%`,
                          zIndex: layer.zIndex ?? 0,
                          cursor: isSelected && !layer.locked ? 'move' : 'default',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Shift+单击：多选模式
                          if (e.shiftKey) {
                            const currentSelected = new Set(selectedLayerIds);
                            if (currentSelected.has(layer.id)) {
                              // 如果已选中，则取消选中
                              currentSelected.delete(layer.id);
                              if (currentSelected.size > 0) {
                                onLayerSelect?.(null, currentSelected);
                              } else {
                                onLayerSelect?.(null);
                              }
                            } else {
                              // 如果未选中，则添加到多选
                              currentSelected.add(layer.id);
                              onLayerSelect?.(null, currentSelected);
                            }
                          } else {
                            // 普通单击：单选模式
                            onLayerSelect?.(layer.id);
                          }
                        }}
                        onMouseDown={(e) => {
                          // 锁定的图层不能拖动
                          if ((selectedLayerId === layer.id || selectedLayerIds.has(layer.id)) && !isResizingLayer && !layer.locked) {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsDraggingLayer(true);
                            setDragLayerStart({
                              x: e.clientX,
                              y: e.clientY,
                              layerX: layerX,
                              layerY: layerY,
                            });
                          }
                        }}
                      >
                        {/* 形状内容 */}
                        <div className="w-full h-full flex items-center justify-center">
                          {IconComponent ? (
                            <IconComponent className={`w-full h-full ${layer.color || 'text-gray-700'}`} />
                          ) : null}
                        </div>
                        
                        {/* 选中状态 UI */}
                        {isSelected && !layer.locked && (
                          <>
                            {/* 四个角的操作点 */}
                            <div
                              className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('nw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('ne');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('sw');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-30"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsResizingLayer(true);
                                setIsDraggingLayer(false);
                                setResizeHandle('se');
                                setResizeStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                  layerX: layerX,
                                  layerY: layerY,
                                  layerWidth: layerWidth,
                                  layerHeight: layerHeight,
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            {/* 选中边框 */}
                            <div className="absolute inset-0 border-2 border-teal-500 pointer-events-none rounded" />
                            
                            {/* 编辑悬浮栏 */}
                            <LayerToolbar 
                              visible={isSelected && !layer.locked}
                              layerType="shape"
                              canvasZoom={zoom}
                              onToolSelect={(tool) => onLayerToolSelect?.(tool)}
                            />
                          </>
                        )}
                        
                        {/* 锁定状态指示器 */}
                        {isSelected && layer.locked && (
                          <>
                            <div className="absolute inset-0 border-2 border-amber-500 pointer-events-none rounded" />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 whitespace-nowrap z-50">
                              <Lock className="w-3 h-3" />
                              <span>{t.locked}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  
                  return null;
                })}
              
              {/* 如果还有 selectedLayout（用于编辑模式），也显示 */}
              {selectedLayout && selectedLayout.frames && !layers.some(l => l.layout?.id === selectedLayout.id) && (
                <div className="absolute inset-0">
                  {selectedLayout.frames.map((frame: any) => (
                    <div
                      key={frame.id}
                      className="absolute border-2 border-dashed border-gray-300 bg-gray-50 hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                      style={{
                        left: `${frame.x}%`,
                        top: `${frame.y}%`,
                        width: `${frame.width}%`,
                        height: `${frame.height}%`,
                      }}
                    >
                      {frame.imageUrl ? (
                        <div className="w-full h-full relative">
                          <img
                            src={frame.imageUrl}
                            alt={`Frame ${frame.id}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  onLayoutFrameImageChange?.(frame.id, url);
                                }
                              };
                              input.click();
                            }}
                            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                            title="Change image"
                          >
                            <ImageIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                onLayoutFrameImageChange?.(frame.id, url);
                              }
                            };
                            input.click();
                          }}
                          className="w-full h-full flex flex-col items-center justify-center hover:bg-teal-50 transition-colors"
                        >
                          <Plus className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">Add Image</span>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* 框选框 - 显示在画布容器上 */}
                  {isSelecting && selectionBox && (
                    <div
                      className="absolute border-2 border-teal-500 bg-teal-500/10 pointer-events-none z-50"
                      style={{
                        left: `${Math.min(selectionBox.startX, selectionBox.endX)}px`,
                        top: `${Math.min(selectionBox.startY, selectionBox.endY)}px`,
                        width: `${Math.abs(selectionBox.endX - selectionBox.startX)}px`,
                        height: `${Math.abs(selectionBox.endY - selectionBox.startY)}px`,
                      }}
                    />
                  )}
                  
                  {/* Group/Ungroup 按钮 - 显示在画布上 */}
                  {selectedCenter && (
                    <div
                      className="absolute z-50"
                      style={{
                        left: `${selectedCenter.x}%`,
                        top: `${Math.max(0, selectedCenter.y - 5)}%`,
                        transform: 'translate(-50%, -100%)',
                      }}
                    >
                      {selectedLayerIds.size > 1 ? (
                        <button
                          onClick={() => {
                            onGroupLayers?.(Array.from(selectedLayerIds));
                            onLayerSelect?.(null);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-lg transition-colors text-sm font-medium"
                        >
                          <Layers className="w-4 h-4" />
                          <span>{t.group}</span>
                        </button>
                      ) : selectedLayerId && layers.find(l => l.id === selectedLayerId)?.isGroup ? (
                        <button
                          onClick={() => {
                            onUngroupLayers?.(selectedLayerId);
                            onLayerSelect?.(null);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-lg transition-colors text-sm font-medium"
                        >
                          <Ungroup className="w-4 h-4" />
                          <span>{t.ungroup}</span>
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : imageUrl ? (
            <div 
              className="shadow-lg p-4 relative"
              style={{ 
                width: displaySize.width, 
                height: displaySize.height,
                backgroundColor: backgroundLayer?.color || '#FFFFFF',
                backgroundImage: backgroundLayer?.imageUrl 
                  ? `url(${backgroundLayer.imageUrl})` 
                  : backgroundLayer?.gradient || 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => onLayerSelect?.(backgroundLayer?.id || null)}
            >
              <img
                src={imageUrl}
                alt="Editor canvas"
                className="w-full h-full object-contain"
              />
              {/* 背景图层选中边框 */}
              {selectedLayerId === backgroundLayer?.id && (
                <div className="absolute inset-0 border-2 border-teal-500 pointer-events-none" />
              )}
              {/* 无其他图层时，背景选中也显示 toolbar */}
              {selectedLayerId === backgroundLayer?.id && (
                <LayerToolbar
                  visible={true}
                  layerType="background"
                  canvasZoom={zoom}
                  onToolSelect={(tool) => onLayerToolSelect?.(tool)}
                  onFlipHorizontal={onFlipHorizontal}
                  onFlipVertical={onFlipVertical}
                  onRotateRight90={onRotateRight90}
                  onRotateLeft90={onRotateLeft90}
                />
              )}
            </div>
          ) : showCanvasStarter ? (
            <div className="relative flex items-center justify-center" style={{ width: displaySize.width, height: displaySize.height }}>
              <div className="absolute inset-0 rounded-[28px] bg-slate-900/16 backdrop-blur-[3px]" />
              <div
                className="relative z-10 w-full max-w-[760px] rounded-[24px] bg-transparent p-0"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-2 gap-2 rounded-[24px] bg-transparent p-4 sm:gap-4 sm:bg-white sm:shadow-[0_18px_40px_rgba(109,92,180,0.08)]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateBlankCanvas?.();
                    }}
                    className="group flex min-h-[11.5rem] flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#d7d7e2] bg-white px-5 py-6 text-center transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#2fbdc7] hover:shadow-[0_18px_38px_rgba(47,189,199,0.12)]"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f1f4] text-[#2f2f2f]">
                      <Plus className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-medium text-[#171717] sm:text-lg">{t.starterBlank}</div>
                    <div className="mt-1.5 max-w-64 text-[0.95rem] leading-normal text-[#8a8a96]">{t.starterBlankHint}</div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenImageToCanvas?.();
                    }}
                    className="group flex min-h-[11.5rem] flex-col items-center justify-center rounded-[20px] border border-solid border-[#ece7f7] bg-white px-5 py-6 text-center transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#2fbdc7] hover:shadow-[0_18px_38px_rgba(47,189,199,0.12)]"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF6FF] text-[#2fbdc7]">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-medium text-[#171717] sm:text-lg">{t.starterOpenImage}</div>
                    <div className="mt-1.5 max-w-64 text-[0.95rem] leading-normal text-[#8a8a96]">{t.starterOpenImageHint}</div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateCollage?.();
                    }}
                    className="group flex min-h-[11.5rem] flex-col items-center justify-center rounded-[20px] border border-solid border-[#ece7f7] bg-white px-5 py-6 text-center transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#2fbdc7] hover:shadow-[0_18px_38px_rgba(47,189,199,0.12)]"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF6FF] text-[#2fbdc7]">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-medium text-[#171717] sm:text-lg">{t.starterCollage}</div>
                    <div className="mt-1.5 max-w-64 text-[0.95rem] leading-normal text-[#8a8a96]">{t.starterCollageHint}</div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTemplateToCanvas?.();
                    }}
                    className="group flex min-h-[11.5rem] flex-col items-center justify-center rounded-[20px] border border-solid border-[#ece7f7] bg-white px-5 py-6 text-center transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#2fbdc7] hover:shadow-[0_18px_38px_rgba(47,189,199,0.12)]"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF6FF] text-[#2fbdc7]">
                      <Star className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-medium text-[#171717] sm:text-lg">{t.starterTemplate}</div>
                    <div className="mt-1.5 max-w-64 text-[0.95rem] leading-normal text-[#8a8a96]">{t.starterTemplateHint}</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="shadow-lg flex items-center justify-center relative"
              style={{ 
                width: displaySize.width, 
                height: displaySize.height,
                backgroundColor: backgroundLayer?.color || '#FFFFFF',
                backgroundImage: backgroundLayer?.imageUrl 
                  ? `url(${backgroundLayer.imageUrl})` 
                  : backgroundLayer?.gradient || 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => onLayerSelect?.(backgroundLayer?.id || null)}
            >
              {/* 背景图层选中边框 */}
              {selectedLayerId === backgroundLayer?.id && (
                <div className="absolute inset-0 border-2 border-teal-500 pointer-events-none" />
              )}
              {/* 无其他图层时，背景选中也显示 toolbar */}
              {selectedLayerId === backgroundLayer?.id && (
                <LayerToolbar
                  visible={true}
                  layerType="background"
                  canvasZoom={zoom}
                  onToolSelect={(tool) => onLayerToolSelect?.(tool)}
                  onFlipHorizontal={onFlipHorizontal}
                  onFlipVertical={onFlipVertical}
                  onRotateRight90={onRotateRight90}
                  onRotateLeft90={onRotateLeft90}
                />
              )}
            </div>
          )}
        </div>

        {/* 裁剪框遮罩层（外部半透明） */}
        {showCropBox && cropDisplaySize.width > 0 && cropDisplaySize.height > 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              clipPath: `polygon(
                0% 0%, 
                0% 100%, 
                calc(50% + ${(cropOffset.x / canvasSize.width) * displaySize.width}px - ${cropDisplaySize.width / 2}px) 100%, 
                calc(50% + ${(cropOffset.x / canvasSize.width) * displaySize.width}px - ${cropDisplaySize.width / 2}px) calc(50% + ${(cropOffset.y / canvasSize.height) * displaySize.height}px - ${cropDisplaySize.height / 2}px), 
                calc(50% + ${(cropOffset.x / canvasSize.width) * displaySize.width}px + ${cropDisplaySize.width / 2}px) calc(50% + ${(cropOffset.y / canvasSize.height) * displaySize.height}px - ${cropDisplaySize.height / 2}px), 
                calc(50% + ${(cropOffset.x / canvasSize.width) * displaySize.width}px + ${cropDisplaySize.width / 2}px) calc(50% + ${(cropOffset.y / canvasSize.height) * displaySize.height}px + ${cropDisplaySize.height / 2}px), 
                calc(50% + ${(cropOffset.x / canvasSize.width) * displaySize.width}px - ${cropDisplaySize.width / 2}px) calc(50% + ${(cropOffset.y / canvasSize.height) * displaySize.height}px + ${cropDisplaySize.height / 2}px), 
                calc(50% + ${(cropOffset.x / canvasSize.width) * displaySize.width}px - ${cropDisplaySize.width / 2}px) 100%, 
                100% 100%, 
                100% 0%
              )`,
            }}
          />
        )}

        {/* Crop 裁剪框（覆盖在原画布上） */}
        {showCropBox && cropDisplaySize.width > 0 && cropDisplaySize.height > 0 && (
          <div
            className="absolute pointer-events-auto"
            style={{
              left: `calc(50% + ${(cropOffset.x / canvasSize.width) * displaySize.width}px)`,
              top: `calc(50% + ${(cropOffset.y / canvasSize.height) * displaySize.height}px)`,
              transform: `translate(-50%, -50%) scale(${zoom})`,
              width: cropDisplaySize.width,
              height: cropDisplaySize.height,
              zIndex: 20,
            }}
          >
            {/* 裁剪框内容（显示原图） */}
            <div
              className="relative overflow-hidden border-2 border-blue-500"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: 'transparent' }} />
              )}
              
              {/* 3x3 网格 */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${cropDisplaySize.width / 3}px ${cropDisplaySize.height / 3}px`,
                }}
              />

              {/* 右上角确认和取消按钮 */}
              <div className="absolute top-2 right-2 flex items-center gap-2 z-30">
                <button
                  onClick={handleConfirmCrop}
                  className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  title={t.confirm}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelCrop}
                  className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  title={t.cancel}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 拖动控制点 */}
              <div
                className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-20"
                onMouseDown={(e) => handleMouseDown(e, 'nw')}
                style={{ cursor: 'nwse-resize' }}
              />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-20"
                onMouseDown={(e) => handleMouseDown(e, 'ne')}
                style={{ cursor: 'nesw-resize' }}
              />
              <div
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-20"
                onMouseDown={(e) => handleMouseDown(e, 'sw')}
                style={{ cursor: 'nesw-resize' }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-20"
                onMouseDown={(e) => handleMouseDown(e, 'se')}
                style={{ cursor: 'nwse-resize' }}
              />
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ns-resize z-20"
                onMouseDown={(e) => handleMouseDown(e, 'n')}
                style={{ cursor: 'ns-resize' }}
              />
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ns-resize z-20"
                onMouseDown={(e) => handleMouseDown(e, 's')}
                style={{ cursor: 'ns-resize' }}
              />
              <div
                className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ew-resize z-20"
                onMouseDown={(e) => handleMouseDown(e, 'w')}
                style={{ cursor: 'ew-resize' }}
              />
              <div
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ew-resize z-20"
                onMouseDown={(e) => handleMouseDown(e, 'e')}
                style={{ cursor: 'ew-resize' }}
              />
            </div>
          </div>
        )}

        {/* 未拖动时的控制点（显示在原始画布上） */}
        {isCropMode && !showCropBox && (
          <div
            className="absolute"
            style={{
              transform: `translate(-50%, -50%) scale(${zoom})`,
              transformOrigin: 'center',
              left: '50%',
              top: '50%',
              width: displaySize.width,
              height: displaySize.height,
              zIndex: 10,
            }}
          >
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${displaySize.width / 3}px ${displaySize.height / 3}px`,
                boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
              }}
            />
            {/* 四个角的控制点 */}
            <div
              className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-10"
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
              style={{ cursor: 'nwse-resize' }}
            />
            <div
              className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-10"
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
              style={{ cursor: 'nesw-resize' }}
            />
            <div
              className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nesw-resize z-10"
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
              style={{ cursor: 'nesw-resize' }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-nwse-resize z-10"
              onMouseDown={(e) => handleMouseDown(e, 'se')}
              style={{ cursor: 'nwse-resize' }}
            />
            {/* 四条边的控制点 */}
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ns-resize z-10"
              onMouseDown={(e) => handleMouseDown(e, 'n')}
              style={{ cursor: 'ns-resize' }}
            />
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ns-resize z-10"
              onMouseDown={(e) => handleMouseDown(e, 's')}
              style={{ cursor: 'ns-resize' }}
            />
            <div
              className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ew-resize z-10"
              onMouseDown={(e) => handleMouseDown(e, 'w')}
              style={{ cursor: 'ew-resize' }}
            />
            <div
              className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 border-2 border-white rounded-full cursor-ew-resize z-10"
              onMouseDown={(e) => handleMouseDown(e, 'e')}
              style={{ cursor: 'ew-resize' }}
            />
          </div>
        )}
      </div>

      {/* 底部控制栏 */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title={t.zoomOut}
        >
          <ZoomOut className="w-4 h-4 text-gray-700" />
        </button>
        <span className="text-sm text-gray-600 px-2">{Math.round(zoom * 100)}%</span>
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title={t.zoomIn}
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={handleFullscreen}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title={t.fullscreen}
        >
          <Maximize2 className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title={t.handTool}
        >
          <Hand className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* 帮助按钮 */}
      <button
        className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Help
      </button>
    </div>
  );
}
