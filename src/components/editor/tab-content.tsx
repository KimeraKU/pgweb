'use client';

import { Lock, Search, ChevronDown, Plus, Sparkles, Wand2, Type, AlignLeft, List, Upload, Image as ImageIcon, Eraser, Palette, Crop, Layers, Star, Heart, Circle, Square, Triangle, Hexagon, ChevronRight, Video, Folder, MoreVertical, Trash2, Play, Shirt, Clapperboard, Frame, Smile, Expand, Film, UserCircle, Stamp, BookOpen, Scissors, Sticker, UserMinus, ChevronLeft, Zap, Minus, Check, X, ThumbsUp, ThumbsDown, Download, RotateCcw, Info, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/contexts/language-context';
import { generateLayoutTemplates } from '@/data/layout-templates';
import { LayoutTemplate } from '@/types/layout';
import { ImageFastIcon } from '@/components/icons/image-fast-icon';
import { HighQualityIcon } from '@/components/icons/high-quality-icon';
import { QuickRemovalIcon } from '@/components/icons/quick-removal-icon';
import { AIBackgroundIcon } from '@/components/icons/ai-background-icon';
import { AIEditorIcon } from '@/components/icons/ai-editor-icon';
import { AdjustPanel } from '@/components/adjust-modal';

type SidebarTab =
  | 'apps'
  | 'ratio'
  | 'templates'
  | 'upload'
  | 'text'
  | 'image'
  | 'assets'
  | 'background';

interface TextLayer {
  id: string;
  text: string;
  style: string;
  fontSize?: string;
  fontWeight?: string;
  isTemplate?: boolean;
}

interface ImageLayer {
  id: string;
  url: string;
  name?: string;
}

interface ShapeLayer {
  id: string;
  icon?: string;
  label: string;
  color?: string;
}

interface TabContentProps {
  activeTab: SidebarTab | string;
  onOpenApp?: (appId: string, label: string) => void;
  canvasSize?: { width: number; height: number };
  onSizeChange?: (width: number, height: number) => void;
  onLayoutSelect?: (layout: any) => void;
  onTextAdd?: (textLayer: TextLayer) => void;
  onImageAdd?: (imageLayer: ImageLayer) => void;
  onShapeAdd?: (shapeLayer: ShapeLayer) => void;
  isLayoutSelectMode?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  /** 当前选中的图层 id，用于 AI Filter 等展示画板选中图片 */
  selectedLayerId?: string | null;
  /** 画布图层列表，用于根据 selectedLayerId 取图片 url */
  layers?: Array<{ id: string; type?: string; imageUrl?: string }>;
  /** Image Enhancer 当前要增强的图片 URL（从画板选中或弹窗上传/选择带入） */
  imageEnhancerSourceUrl?: string | null;
  /** 用户身份，用于 Image Enhancer 4K 按钮会员限制 */
  userStatus?: 'guest' | 'free' | 'pro';
  /** AI Removal 当前要擦除的图片 URL */
  aiRemovalSourceUrl?: string | null;
  /** AI Removal 笔刷大小（1–100），与画布笔刷联动 */
  aiRemovalBrushSize?: number;
  /** AI Removal 笔刷大小变更 */
  onAiRemovalBrushSizeChange?: (size: number) => void;
  /** AI Removal 是否有有效选区（无选区时禁用 Remove） */
  aiRemovalHasSelection?: boolean;
  /** AI Removal 点击 Remove 后触发展示画布前后对比弹窗 */
  onAiRemovalRemoveClick?: () => void;
  /** 关闭调整面板时回调（返回 Apps tab） */
  onCloseAdjust?: () => void;
  /** Image Enhancer 左侧栏「增强中」动画结束后回调，用于显示画板对比弹窗 */
  onImageEnhancerEnhancingComplete?: () => void;
  /** Image Enhancer 再次开始增强（如点击 4K）时回调，用于画板显示生成中、隐藏对比弹窗 */
  onImageEnhancerEnhancingStart?: () => void;
  /** 有 tab 内容页的 App 侧边栏顶部点击返回时回调，返回 Apps tab */
  onBackToApps?: () => void;
}

// 包装组件：为每个 tab 内容添加收起/展开按钮
function TabContentWrapper({ 
  children, 
  isCollapsed = false, 
  onToggleCollapse 
}: { 
  children: React.ReactNode; 
  isCollapsed?: boolean; 
  onToggleCollapse?: () => void;
}) {
  return (
    <div className="relative h-full">
      {/* 内容区域 */}
      <div className={`h-full transition-all duration-300 ${isCollapsed ? 'w-0 overflow-hidden' : 'w-80'}`}>
        {!isCollapsed && children}
      </div>
      {/* 收起/展开按钮 - 始终显示 */}
      <button
        onClick={onToggleCollapse}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md flex items-center justify-center transition-colors border border-gray-200"
        title={isCollapsed ? "展开" : "收起"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}

export function TabContent({ activeTab, onOpenApp, canvasSize = { width: 1080, height: 1080 }, onSizeChange, onLayoutSelect, onTextAdd, onImageAdd, onShapeAdd, isLayoutSelectMode = false, isCollapsed = false, onToggleCollapse, selectedLayerId = null, layers = [], imageEnhancerSourceUrl = null, userStatus = 'free', aiRemovalSourceUrl = null, aiRemovalBrushSize = 30, onAiRemovalBrushSizeChange, aiRemovalHasSelection = false, onAiRemovalRemoveClick, onCloseAdjust, onImageEnhancerEnhancingComplete, onImageEnhancerEnhancingStart, onBackToApps }: TabContentProps) {
  const { t } = useLanguage();
  const [unit, setUnit] = useState<'px' | 'in' | 'cm' | 'mm'>('px');

  // 调整面板：显示在左侧内容栏，不选中任何侧边 icon
  if (activeTab === 'adjust') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <AdjustPanel onClose={onCloseAdjust ?? (() => {})} />
      </TabContentWrapper>
    );
  }
  
  // Ratio tab 内容（根据图片描述）
  if (activeTab === 'ratio') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* 固定区域：Custom size */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
          {/* Custom size 部分 */}
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{t.customSize}</h3>
          
          {/* 自定义尺寸输入 */}
          <div className="flex items-center gap-2 mb-4 w-full">
            <input
              type="number"
              value={canvasSize.width}
              onChange={(e) => {
                const width = parseInt(e.target.value) || 1080;
                onSizeChange?.(width, canvasSize.height);
              }}
              className="w-[76px] px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
            />
            <button className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0 h-6 w-6 flex items-center justify-center">
              <Lock className="w-4 h-4 text-gray-500" />
            </button>
            <input
              type="number"
              value={canvasSize.height}
              onChange={(e) => {
                const height = parseInt(e.target.value) || 1080;
                onSizeChange?.(canvasSize.width, height);
              }}
              className="w-[70px] px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
            />
            <div className="relative flex-shrink-0">
              <select 
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'px' | 'in' | 'cm' | 'mm')}
                className="px-2 py-2 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 pr-6 w-14 h-9 bg-white"
              >
                <option value="px">px</option>
                <option value="in">in</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button 
              className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0 h-6 w-6 flex items-center justify-center"
              title={t.crop}
            >
              <Crop className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for ratios"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
            />
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 可滚动区域：尺寸选项 */}
        <div className="flex-1 overflow-y-auto">
        
        {/* Social media sizes 部分 */}
        <div className="px-4 pt-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Social media sizes</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Instagram Story', width: 1080, height: 1920, icon: '📱', color: 'bg-pink-100', iconColor: 'text-pink-600' },
              { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: '▶️', color: 'bg-red-100', iconColor: 'text-red-600' },
              { name: 'Facebook Profile', width: 1080, height: 1080, icon: 'f', color: 'bg-blue-100', iconColor: 'text-blue-600' },
              { name: 'LinkedIn Post', width: 1200, height: 628, icon: 'in', color: 'bg-blue-100', iconColor: 'text-blue-600' },
              { name: 'X post', width: 1200, height: 675, icon: 'X', color: 'bg-sky-100', iconColor: 'text-sky-600' },
              { name: 'TikTok', width: 1080, height: 1920, icon: '🎵', color: 'bg-black', iconColor: 'text-white' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => onSizeChange?.(item.width, item.height)}
                className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-2`}>
                  <span className={`text-lg font-semibold ${item.iconColor}`}>{item.icon}</span>
                </div>
                <p className="text-xs font-medium text-gray-900 mb-1 text-center leading-tight">{item.name}</p>
                <p className="text-xs text-gray-500 text-center leading-tight">{item.width} x {item.height}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Print sizes 部分 */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Print sizes</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Banner', width: 468, height: 60, icon: '▬', color: 'bg-purple-100', iconColor: 'text-purple-600' },
              { name: 'Large Rectangle', width: 336, height: 280, icon: '▭', color: 'bg-purple-100', iconColor: 'text-purple-600' },
              { name: 'Billboard', width: 970, height: 250, icon: '▭', color: 'bg-purple-100', iconColor: 'text-purple-600' },
              { name: 'Mobile Banner', width: 320, height: 50, icon: '📱', color: 'bg-purple-100', iconColor: 'text-purple-600' },
              { name: 'A4', width: 2480, height: 3508, icon: '📄', color: 'bg-gray-100', iconColor: 'text-gray-600' },
              { name: 'A3', width: 3508, height: 4961, icon: '📄', color: 'bg-gray-100', iconColor: 'text-gray-600' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => onSizeChange?.(item.width, item.height)}
                className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-2`}>
                  <span className={`text-lg font-semibold ${item.iconColor}`}>{item.icon}</span>
                </div>
                <p className="text-xs font-medium text-gray-900 mb-1 text-center leading-tight">{item.name}</p>
                <p className="text-xs text-gray-500 text-center leading-tight">{item.width} x {item.height}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
      </TabContentWrapper>
    );
  }

  // Templates tab 内容（含分类 Layout，tab 为 All / 1 / 2 / 3 …）
  if (activeTab === 'templates') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <TemplatesTabContent onLayoutSelect={onLayoutSelect} isLayoutSelectMode={isLayoutSelectMode} />
      </TabContentWrapper>
    );
  }

  // Text tab 内容
  if (activeTab === 'text') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <TextTabContent onTextAdd={onTextAdd} />
      </TabContentWrapper>
    );
  }

  // Image tab 内容
  if (activeTab === 'image') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <ImageTabContent onImageAdd={onImageAdd} />
      </TabContentWrapper>
    );
  }

  // Assets tab 内容
  if (activeTab === 'assets') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <AssetsTabContent onShapeAdd={onShapeAdd} onImageAdd={onImageAdd} />
      </TabContentWrapper>
    );
  }

  // Background tab 内容
  if (activeTab === 'background') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <BackgroundTabContent />
      </TabContentWrapper>
    );
  }

  // Upload tab 内容
  if (activeTab === 'upload') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <UploadTabContent onImageAdd={onImageAdd} />
      </TabContentWrapper>
    );
  }

  // Apps tab 内容
  if (activeTab === 'apps') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <AppsTabContent onOpenApp={onOpenApp} />
      </TabContentWrapper>
    );
  }

  // 动态 App Tab：AI 生图
  if (activeTab === 'ai-image-generator') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <AIImageGeneratorTabContent onBackToApps={onBackToApps} />
      </TabContentWrapper>
    );
  }

  // 动态 App Tab：AI Filter（上传 + 分类 + 滤镜网格）
  if (activeTab === 'ai-filter') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <AIFilterTabContent selectedLayerId={selectedLayerId} layers={layers} onBackToApps={onBackToApps} />
      </TabContentWrapper>
    );
  }

  // 动态 App Tab：Image Enhancer（从 Apps 点击进入，带入选中的图或弹窗选择/上传的图）
  if (activeTab === 'image-enhancer') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <ImageEnhancerTabContent sourceUrl={imageEnhancerSourceUrl} userStatus={userStatus} onEnhancingComplete={onImageEnhancerEnhancingComplete} onEnhancingStart={onImageEnhancerEnhancingStart} onBackToApps={onBackToApps} />
      </TabContentWrapper>
    );
  }

  // 动态 App Tab：AI Removal（原 Magic Eraser，入口逻辑同 Image Enhancer）
  if (activeTab === 'ai-removal') {
    return (
      <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <AIRemovalTabContent sourceUrl={aiRemovalSourceUrl} brushSize={aiRemovalBrushSize} onBrushSizeChange={onAiRemovalBrushSizeChange} hasSelection={aiRemovalHasSelection} onRemoveClick={onAiRemovalRemoveClick} onBackToApps={onBackToApps} />
      </TabContentWrapper>
    );
  }

  // 其他 App tab（ai-image-generator、ai-filter 等）占位内容，顶部也带返回箭头
  return (
    <TabContentWrapper isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          {onBackToApps && (
            <button type="button" onClick={onBackToApps} className="p-1 rounded hover:bg-gray-100 text-gray-600" aria-label="Back to Apps">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h3 className="text-sm font-medium text-gray-800 capitalize">{String(activeTab).replace(/-/g, ' ')}</h3>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center overflow-y-auto">
          <p className="text-gray-500 text-sm">Content coming soon...</p>
        </div>
      </div>
    </TabContentWrapper>
  );
}

// Text Tab 组件
function TextTabContent({ onTextAdd }: { onTextAdd?: (textLayer: TextLayer) => void }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [myFonts, setMyFonts] = useState<{ id: string; url: string; name: string }[]>([]);

  // Handle font upload
  const handleFontUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ttf,.otf,.woff,.woff2';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const newFonts = Array.from(files).map(file => ({
          id: `font-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: URL.createObjectURL(file),
          name: file.name,
        }));
        setMyFonts([...myFonts, ...newFonts]);
      }
    };
    input.click();
  };

  // Handle adding default text
  const handleAddText = () => {
    onTextAdd?.({
      id: `text-${Date.now()}`,
      text: 'Add your text here',
      style: 'text-gray-900 font-medium',
      fontSize: '24px',
      fontWeight: 'normal',
    });
  };

  // Handle adding text template
  const handleAddTemplate = (template: { id: string; text: string; style: string }) => {
    onTextAdd?.({
      id: `text-${Date.now()}`,
      text: template.text,
      style: template.style,
      isTemplate: true,
    });
  };

  // Handle adding text style
  const handleAddTextStyle = (item: { id: string; label: string; fontSize: string; fontWeight: string }) => {
    const textMap: Record<string, string> = {
      heading: 'Add a Heading',
      subheading: 'Add a Subheading',
      body: 'Add body text here',
      caption: 'Add caption text',
      quote: '"Add a quote here"',
      list: '• List item',
    };
    onTextAdd?.({
      id: `text-${Date.now()}`,
      text: textMap[item.id] || 'Add text',
      style: 'text-gray-900',
      fontSize: item.fontSize,
      fontWeight: item.fontWeight,
    });
  };

  // Recommended tools
  const recommendedTools = [
    { id: 'ai-text', icon: Sparkles, label: 'AI Text', description: 'Generate smart copy', color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { id: 'text-effects', icon: Wand2, label: 'Text Effects', description: 'Add cool effects', color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { id: 'text-template', icon: Type, label: 'Templates', description: 'Quick apply styles', color: 'bg-teal-100', iconColor: 'text-teal-600' },
  ];

  // Text templates
  const textTemplates = [
    { id: 'fun', text: 'FUN', style: 'bg-gradient-to-r from-pink-400 to-pink-500 text-white font-black italic', shadow: true },
    { id: 'before-after', text: 'Before & After', style: 'text-blue-500 font-serif italic font-medium' },
    { id: 'xoxo', text: 'XOXO', style: 'bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 to-blue-500 bg-clip-text text-transparent font-black' },
    { id: 'enjoy', text: 'enjoy', style: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-full px-3' },
    { id: 'highlight', text: 'Highlight', style: 'bg-pink-500 text-white font-bold px-2 rounded' },
    { id: 'hey-hey', text: 'Hey Hey !', style: 'font-serif italic text-gray-800' },
    { id: 'my-2020', text: 'My 2020', style: 'text-gray-400 font-black italic text-shadow' },
    { id: 'discount', text: '15% OFF', style: 'bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded px-2' },
    { id: 'tips', text: '3 Tips', style: 'text-red-500 font-black italic stroke-text' },
    { id: 'money', text: '$10,000', style: 'bg-gradient-to-b from-yellow-300 to-yellow-600 bg-clip-text text-transparent font-bold border-2 border-yellow-500 rounded px-2' },
    { id: 'meme', text: 'MEME STYLE', style: 'text-white font-black tracking-wider text-stroke' },
    { id: 'top5', text: 'TOP 5', style: 'text-gray-900 font-black' },
    { id: 'vlog', text: 'Vlog Ep.1', style: 'bg-orange-400 text-white font-bold italic px-2 rounded' },
    { id: 'click', text: 'Click Here', style: 'bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent font-bold' },
    { id: 'summer', text: 'Summer Vibes', style: 'text-pink-400 font-serif italic' },
    { id: 'bold', text: 'BOLD', style: 'text-green-500 font-black tracking-wide text-shadow-lg' },
  ];

  // Text list
  const textList = [
    { id: 'heading', label: 'Add Heading', description: 'Large bold text', fontSize: '32px', fontWeight: 'bold' },
    { id: 'subheading', label: 'Add Subheading', description: 'Medium semi-bold text', fontSize: '24px', fontWeight: '600' },
    { id: 'body', label: 'Add Body Text', description: 'Regular paragraph text', fontSize: '16px', fontWeight: 'normal' },
    { id: 'caption', label: 'Add Caption', description: 'Small auxiliary text', fontSize: '12px', fontWeight: 'normal' },
    { id: 'quote', label: 'Add Quote', description: 'Quote style text', fontSize: '18px', fontWeight: 'italic' },
    { id: 'list', label: 'Add List', description: 'Bullet point list', fontSize: '16px', fontWeight: 'normal' },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Fixed area: Search bar and Add button */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchText}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
          />
        </div>

        {/* Add button */}
        <button 
          onClick={handleAddText}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addText}</span>
        </button>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {/* Recommended tools cards */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.recommendedTools}</h3>
          <div className="grid grid-cols-3 gap-2">
            {recommendedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center mb-2`}>
                    <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-900 text-center leading-tight">{tool.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* My Fonts Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.myFonts}</h3>
          
          {/* Upload button */}
          <button 
            onClick={handleFontUpload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium mb-3"
          >
            <Upload className="w-4 h-4" />
            <span>{t.uploadFont}</span>
          </button>

          {/* My fonts list */}
          {myFonts.length > 0 ? (
            <div className="space-y-2">
              {myFonts.map((font) => (
                <div
                  key={font.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-500 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Type className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{font.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {font.name.split('.').pop()?.toUpperCase() || 'FONT'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-center text-gray-400 py-4">No fonts uploaded yet<br />Click button above to add</p>
          )}
        </div>

        {/* Text templates */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.textTemplates}</h3>
          <div className="grid grid-cols-2 gap-2">
            {textTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleAddTemplate(template)}
                className="h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all bg-white overflow-hidden"
              >
                <span className={`text-sm ${template.style}`}>
                  {template.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Text list */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.textStyles}</h3>
          <div className="space-y-2">
            {textList
              .filter(item => 
                searchQuery === '' || 
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddTextStyle(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100">
                    <span 
                      className="text-gray-700 group-hover:text-teal-700"
                      style={{ 
                        fontSize: item.id === 'heading' ? '16px' : item.id === 'subheading' ? '14px' : '12px',
                        fontWeight: item.fontWeight === 'bold' ? 700 : item.fontWeight === '600' ? 600 : 400,
                        fontStyle: item.fontWeight === 'italic' ? 'italic' : 'normal'
                      }}
                    >
                      Aa
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-teal-500" />
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Image Tab 组件
function ImageTabContent({ onImageAdd }: { onImageAdd?: (imageLayer: ImageLayer) => void }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [myImages, setMyImages] = useState<{ id: string; url: string; name: string }[]>([]);

  // Handle file upload
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const newImages = Array.from(files).map(file => ({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: URL.createObjectURL(file),
          name: file.name,
        }));
        setMyImages([...myImages, ...newImages]);
      }
    };
    input.click();
  };

  // Handle adding image to canvas
  const handleAddImage = (url: string, name?: string) => {
    onImageAdd?.({
      id: `image-${Date.now()}`,
      url,
      name: name || 'Image',
    });
  };

  // Recommended tools
  const recommendedTools = [
    { id: 'ai-generate', icon: Sparkles, label: 'AI Generate', color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { id: 'remove-bg', icon: UserMinus, label: 'Remove BG', color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { id: 'enhance', icon: Wand2, label: 'Enhance', color: 'bg-teal-100', iconColor: 'text-teal-600' },
  ];

  // Library images (placeholder images)
  const libraryImages = [
    { id: 'lib-1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop', category: 'Nature' },
    { id: 'lib-2', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop', category: 'Nature' },
    { id: 'lib-3', url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=200&h=200&fit=crop', category: 'Nature' },
    { id: 'lib-4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', category: 'People' },
    { id: 'lib-5', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', category: 'People' },
    { id: 'lib-6', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', category: 'People' },
    { id: 'lib-7', url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=200&fit=crop', category: 'Work' },
    { id: 'lib-8', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop', category: 'Work' },
    { id: 'lib-9', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&h=200&fit=crop', category: 'Work' },
    { id: 'lib-10', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=200&fit=crop', category: 'City' },
    { id: 'lib-11', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200&h=200&fit=crop', category: 'City' },
    { id: 'lib-12', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop', category: 'City' },
  ];

  // Filter library images by search query
  const filteredLibraryImages = libraryImages.filter(img => 
    searchQuery === '' || img.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Fixed area: Search bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchImages}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
          />
        </div>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {/* Recommended Tools Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.recommendedTools}</h3>
          <div className="grid grid-cols-3 gap-2">
            {recommendedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  className="flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center mb-1`}>
                    <Icon className={`w-4 h-4 ${tool.iconColor}`} />
                  </div>
                  <p className="text-[10px] font-medium text-gray-700 text-center leading-tight">{tool.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* My Images Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.myImages}</h3>
          
          {/* Upload button */}
          <button 
            onClick={handleUpload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium mb-3"
          >
            <Upload className="w-4 h-4" />
            <span>{t.uploadImage}</span>
          </button>

          {/* My images grid */}
          {myImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {myImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleAddImage(image.url, image.name)}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-teal-500 transition-all"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-center">No images uploaded yet<br />Click button above to add</p>
          )}
        </div>

        {/* Stock Images Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.stockImages}</h3>
          <div className="grid grid-cols-3 gap-2">
            {filteredLibraryImages.map((image) => (
              <button
                key={image.id}
                onClick={() => handleAddImage(image.url, image.category)}
                className="aspect-square rounded-lg border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all overflow-hidden group relative"
              >
                <img src={image.url} alt={image.category} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Assets Tab 组件
function AssetsTabContent({ onShapeAdd, onImageAdd }: { onShapeAdd?: (shapeLayer: ShapeLayer) => void; onImageAdd?: (imageLayer: ImageLayer) => void }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  // 初始化每个分类的默认选中标签为 "All"
  const initialSelectedTags: { [categoryId: string]: string | null } = {
    'birthday-shoutouts': 'All',
    'birthday-album': 'All',
    'happy-birthday': 'All',
    'my-birthday': 'All',
  };
  
  const [selectedTags, setSelectedTags] = useState<{ [categoryId: string]: string | null }>(initialSelectedTags);
  const tagScrollRefs = React.useRef<{ [categoryId: string]: HTMLDivElement | null }>({});
  const [tagScrollStates, setTagScrollStates] = useState<{ [categoryId: string]: { canScrollLeft: boolean; canScrollRight: boolean } }>({});

  // 检查标签滚动位置
  const checkTagScrollPosition = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
      setTagScrollStates(prev => ({
        ...prev,
        [categoryId]: {
          canScrollLeft: scrollLeft > 0,
          canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
        },
      }));
    }
  };

  // 标签向右滑动
  const scrollTagRight = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      scrollElement.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
      setTimeout(() => checkTagScrollPosition(categoryId), 300);
    }
  };

  // 标签向左滑动
  const scrollTagLeft = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      scrollElement.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
      setTimeout(() => checkTagScrollPosition(categoryId), 300);
    }
  };

  // Handle adding shape (element)
  const handleAddElement = (element: { id: string; label: string; color: string }) => {
    onShapeAdd?.({
      id: `shape-${Date.now()}`,
      icon: element.id,
      label: element.label,
      color: element.color,
    });
  };

  // Handle adding sticker as image
  const handleAddSticker = (sticker: { id: string; emoji: string; label: string }) => {
    // 将 sticker 作为 image 处理，使用 emoji 作为标识
    // 如果需要实际图片 URL，可以后续扩展
    onImageAdd?.({
      id: `image-${Date.now()}`,
      url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" font-size="60" text-anchor="middle" dominant-baseline="middle">${sticker.emoji}</text></svg>`)}`,
      name: sticker.label,
    });
  };

  // Elements list
  const elements = [
    { id: 'star', icon: Star, label: 'Star', color: 'text-yellow-500' },
    { id: 'heart', icon: Heart, label: 'Heart', color: 'text-red-500' },
    { id: 'circle', icon: Circle, label: 'Circle', color: 'text-blue-500' },
    { id: 'square', icon: Square, label: 'Square', color: 'text-green-500' },
    { id: 'triangle', icon: Triangle, label: 'Triangle', color: 'text-purple-500' },
    { id: 'hexagon', icon: Hexagon, label: 'Hexagon', color: 'text-orange-500' },
  ];

  // Sticker categories with items
  const stickerCategories = [
    {
      id: 'birthday-shoutouts',
      title: 'Birthday Shoutouts',
      tags: ['All', 'Cake', 'Party', 'Celebration', 'Gift', 'Balloons', 'Wishes', 'Greeting'],
      stickers: [
        { id: 'bs-1', emoji: '🎂', label: 'Best Wishes' },
        { id: 'bs-2', emoji: '🎉', label: "It's Your Day" },
        { id: 'bs-3', emoji: '🎁', label: 'Cake' },
        { id: 'bs-4', emoji: '🎈', label: 'Gift' },
      ],
    },
    {
      id: 'birthday-album',
      title: 'Birthday photo album',
      tags: ['All', 'Frame', 'Photo', 'Album', 'Memory', 'Collection', 'Gallery', 'Pictures'],
      stickers: [
        { id: 'ba-1', emoji: '🖼️', label: 'Frame 1' },
        { id: 'ba-2', emoji: '📸', label: 'Frame 2' },
        { id: 'ba-3', emoji: '🎞️', label: 'Frame 3' },
        { id: 'ba-4', emoji: '📷', label: 'Frame 4' },
      ],
    },
    {
      id: 'happy-birthday',
      title: 'All happy birthday',
      tags: ['All', 'Happy', 'Birthday', 'Celebrate', 'Fun', 'Joy', 'Special', 'Day'],
      stickers: [
        { id: 'hb-1', emoji: '🎊', label: 'Happy Birthday 1' },
        { id: 'hb-2', emoji: '🥳', label: 'Happy Birthday 2' },
        { id: 'hb-3', emoji: '🎀', label: 'Happy Birthday 3' },
        { id: 'hb-4', emoji: '🌟', label: 'Happy Birthday 4' },
      ],
    },
    {
      id: 'my-birthday',
      title: "It's My Birthday",
      tags: ['All', 'My Birthday', 'Personal', 'Special', 'Party', 'Celebration', 'Fun', 'Me'],
      stickers: [
        { id: 'mb-1', emoji: '🎈', label: 'Balloons' },
        { id: 'mb-2', emoji: '🎁', label: 'Yay Gift' },
        { id: 'mb-3', emoji: '🧁', label: 'Cupcake' },
        { id: 'mb-4', emoji: '🍰', label: 'Cake Slice' },
      ],
    },
  ];

  // 初始化标签滚动状态
  React.useEffect(() => {
    stickerCategories.forEach((category) => {
      if (category.tags && category.tags.length > 0) {
        checkTagScrollPosition(category.id);
        const scrollElement = tagScrollRefs.current[category.id];
        if (scrollElement) {
          const handleScroll = () => checkTagScrollPosition(category.id);
          const handleResize = () => checkTagScrollPosition(category.id);
          scrollElement.addEventListener('scroll', handleScroll);
          window.addEventListener('resize', handleResize);
        }
      }
    });
    
    return () => {
      stickerCategories.forEach((category) => {
        const scrollElement = tagScrollRefs.current[category.id];
        if (scrollElement) {
          const handleScroll = () => checkTagScrollPosition(category.id);
          const handleResize = () => checkTagScrollPosition(category.id);
          scrollElement.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        }
      });
    };
  }, []);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Fixed area: Search bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchAssets}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
          />
        </div>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {/* Elements Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.elements}</h3>
          <div className="grid grid-cols-4 gap-2">
            {elements.map((element) => {
              const Icon = element.icon;
              return (
                <button
                  key={element.id}
                  onClick={() => handleAddElement({ id: element.id, label: element.label, color: element.color })}
                  className="aspect-square flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <Icon className={`w-6 h-6 ${element.color}`} />
                  <span className="text-[10px] text-gray-600 mt-1">{element.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stickers Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.stickers}</h3>
          <div className="space-y-4">
            {stickerCategories.map((category) => (
              <div key={category.id}>
                {/* Category header */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-700">{category.title}</p>
                  <button className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-0.5">
                    More
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {/* Tags - 单行滚动 */}
                {category.tags && category.tags.length > 0 && (
                  <div className="relative flex items-center mb-3">
                    {/* 左箭头 */}
                    {tagScrollStates[category.id]?.canScrollLeft && (
                      <button
                        onClick={() => scrollTagLeft(category.id)}
                        className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* 可滚动的标签列表 */}
                    <div
                      ref={(el) => {
                        tagScrollRefs.current[category.id] = el;
                      }}
                      className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {category.tags.map((tag, index) => {
                        const isSelected = selectedTags[category.id] === tag;
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedTags(prev => ({
                              ...prev,
                              [category.id]: isSelected ? null : tag,
                            }))}
                            className={`
                              flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap
                              ${
                                isSelected
                                  ? 'bg-teal-500 text-white'
                                  : 'text-gray-700'
                              }
                            `}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* 右箭头 */}
                    {tagScrollStates[category.id]?.canScrollRight && (
                      <button
                        onClick={() => scrollTagRight(category.id)}
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                {/* Stickers grid */}
                <div className="grid grid-cols-4 gap-2">
                  {category.stickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => handleAddSticker(sticker)}
                      className="aspect-square flex items-center justify-center rounded-lg border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all bg-gray-50 hover:bg-teal-50"
                    >
                      <span className="text-2xl">{sticker.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Templates Tab 组件
function TemplatesTabContent({ onLayoutSelect, isLayoutSelectMode = false }: { onLayoutSelect?: (layout: any) => void; isLayoutSelectMode?: boolean }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDetail, setCategoryDetail] = useState<{ categoryId: string; categoryTitle: string } | null>(null);
  
  // 初始化每个分类的默认选中标签为 "All"
  const initialSelectedTags: { [categoryId: string]: string | null } = {
    'marketing': 'All',
    'social': 'All',
    'layout': 'All',
    'utility': 'All',
    'art': 'All',
    'ai-filter': 'All',
    'ai-video': 'All',
    'moments': 'All',
    'festivals': 'All',
  };
  
  const [selectedTags, setSelectedTags] = useState<{ [categoryId: string]: string | null }>(initialSelectedTags);
  const tagScrollRefs = React.useRef<{ [categoryId: string]: HTMLDivElement | null }>({});
  const [tagScrollStates, setTagScrollStates] = useState<{ [categoryId: string]: { canScrollLeft: boolean; canScrollRight: boolean } }>({});

  // 布局选择模式下进入 Templates 时自动打开 Layout 分类
  useEffect(() => {
    if (isLayoutSelectMode && !categoryDetail) {
      setCategoryDetail({ categoryId: 'layout', categoryTitle: t.templateCategoryLayout });
    }
  }, [isLayoutSelectMode, t.templateCategoryLayout]);

  // 检查标签滚动位置
  const checkTagScrollPosition = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
      setTagScrollStates(prev => ({
        ...prev,
        [categoryId]: {
          canScrollLeft: scrollLeft > 0,
          canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
        },
      }));
    }
  };

  // 标签向右滑动
  const scrollTagRight = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      scrollElement.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
      setTimeout(() => checkTagScrollPosition(categoryId), 300);
    }
  };

  // 标签向左滑动
  const scrollTagLeft = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      scrollElement.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
      setTimeout(() => checkTagScrollPosition(categoryId), 300);
    }
  };

  // Recommended tools
  const recommendedTools = [
    { id: 'ai-templates', icon: Sparkles, label: 'AI Templates', color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { id: 'ai-image', icon: ImageIcon, label: 'AI Image', color: 'bg-pink-100', iconColor: 'text-pink-600' },
  ];

  // Template categories with items（Layout 置顶）
  const templateCategories = [
    {
      id: 'layout',
      titleKey: 'templateCategoryLayout' as keyof typeof t,
      tags: ['All', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
      templates: [],
    },
    {
      id: 'marketing',
      titleKey: 'templateCategoryMarketing' as keyof typeof t,
      tags: ['All', 'Business', 'Business Card', 'Poster', 'Business Poster', 'Sale', 'Product Intro', 'Before & After', 'Creator', "Featured Creators' Works"],
      templates: [
        { id: 'mk-1', color: 'bg-blue-200', label: 'Template 1', badge: null },
        { id: 'mk-2', color: 'bg-blue-300', label: 'Template 2', badge: null },
        { id: 'mk-3', color: 'bg-blue-400', label: 'Template 3', badge: null },
      ],
    },
    {
      id: 'social',
      titleKey: 'templateCategorySocial' as keyof typeof t,
      tags: ['All', 'Instagram', 'Story', 'Posts', 'YouTube', 'Cover', 'Channel', 'WhatsApp', 'Facebook', 'Stories', 'Photo Dump', 'Wallpaper', 'Wallpaper Inspo', '1:1'],
      templates: [
        { id: 'so-1', color: 'bg-pink-200', label: 'Template 1', badge: null },
        { id: 'so-2', color: 'bg-pink-300', label: 'Template 2', badge: null },
        { id: 'so-3', color: 'bg-pink-400', label: 'Template 3', badge: null },
      ],
    },
    {
      id: 'utility',
      titleKey: 'templateCategoryUtility' as keyof typeof t,
      tags: ['All', 'Calendar', '2025', 'Monthly', 'Plan & Checklist', 'Daily Records', 'Text Templates', 'Letter Grid', 'Scrapbook', 'Mood Board', 'Vision Board'],
      templates: [
        { id: 'ut-1', color: 'bg-gray-200', label: 'Template 1', badge: null },
        { id: 'ut-2', color: 'bg-gray-300', label: 'Template 2', badge: null },
        { id: 'ut-3', color: 'bg-gray-400', label: 'Template 3', badge: null },
      ],
    },
    {
      id: 'art',
      titleKey: 'templateCategoryArt' as keyof typeof t,
      tags: ['All', 'Vintage', 'Minimal', 'Film', 'Y2K', 'Barbie', 'Polaroid', 'Retro', 'Real', 'Glitter', 'Hand-draw', 'Neon', 'Celebrity Selfie', 'Multi Photo Collage', 'Boundless', 'Split', 'Slideshow', 'Animation', 'Animation Card', 'Live', 'Video', 'Filter', 'Basic', 'Mood', 'Creative Effects'],
      templates: [
        { id: 'ar-1', color: 'bg-purple-200', label: 'Template 1', badge: null },
        { id: 'ar-2', color: 'bg-purple-300', label: 'Template 2', badge: null },
        { id: 'ar-3', color: 'bg-purple-400', label: 'Template 3', badge: null },
      ],
    },
    {
      id: 'ai-filter',
      titleKey: 'templateCategoryAIFilter' as keyof typeof t,
      tags: ['All', 'AI Star', 'AI Weather', 'Pet 9-grid Layout', 'AI Travel', 'AI Accessories', 'AI Halloween', 'Halloween Makeup', 'Pet Art Photos', 'AI Clothes', 'AI Age', 'AI Photo', 'Classic Art', 'Art Painting', "Mother's Day", 'Snow Globe'],
      templates: [
        { id: 'af-1', color: 'bg-teal-200', label: 'Template 1', badge: null },
        { id: 'af-2', color: 'bg-teal-300', label: 'Template 2', badge: null },
        { id: 'af-3', color: 'bg-teal-400', label: 'Template 3', badge: null },
      ],
    },
    {
      id: 'ai-video',
      titleKey: 'templateCategoryAIVideo' as keyof typeof t,
      tags: ['All', 'Trend', 'Christmas', 'Baby', 'Interaction', 'Expression', 'Morph', 'Dance', 'Events', 'Filters'],
      templates: [
        { id: 'av-1', color: 'bg-orange-200', label: 'Template 1', badge: null },
        { id: 'av-2', color: 'bg-orange-300', label: 'Template 2', badge: null },
        { id: 'av-3', color: 'bg-orange-400', label: 'Template 3', badge: null },
      ],
    },
    {
      id: 'moments',
      titleKey: 'templateCategoryMoments' as keyof typeof t,
      tags: ['All', 'Family', 'Mom', 'Dad', 'Baby', 'Baby Cutie', 'Love', 'Friendship', 'Pets', 'Birthday', 'Happy Birthday', 'Big Day', 'Wedding', 'Anniversary', 'Graduation', 'Travel', 'Vacation', 'Food', 'Sport & Fitness', 'Fashion & Makeup', 'School', 'Zodiac', 'Invitations', 'Card', 'Party', 'Positivity'],
      templates: [
        { id: 'mo-1', color: 'bg-yellow-200', label: 'Template 1', badge: null },
        { id: 'mo-2', color: 'bg-yellow-300', label: 'Template 2', badge: null },
        { id: 'mo-3', color: 'bg-yellow-400', label: 'Template 3', badge: null },
      ],
    },
    {
      id: 'festivals',
      titleKey: 'templateCategoryFestivals' as keyof typeof t,
      tags: ['All', 'New Year', 'Xmas', 'Christmas', 'Halloween', 'Thanksgiving', 'Easter', 'CNY', 'Chinese New Year', "St. Patrick's Day", 'Eid al-Adha', 'Eid Mubarak', 'Dragonboat', 'USA', 'Japan', 'Brazil', 'Indonesia Day', "Women's Day", 'Pride', 'Awareness', 'Spring', 'Summer', 'Autumn', 'Winter'],
      templates: [
        { id: 'fe-1', color: 'bg-red-200', label: 'Template 1', badge: null },
        { id: 'fe-2', color: 'bg-red-300', label: 'Template 2', badge: null },
        { id: 'fe-3', color: 'bg-red-400', label: 'Template 3', badge: null },
      ],
    },
  ];

  // 生成更多模板用于瀑布流展示
  const generateMoreTemplates = (categoryId: string, baseTemplates: typeof templateCategories[0]['templates']) => {
    const moreTemplates = [];
    for (let i = 4; i <= 20; i++) {
      const colors = ['bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-teal-200', 'bg-teal-300', 'bg-teal-400', 'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      moreTemplates.push({
        id: `${categoryId}-${i}`,
        color: randomColor,
        label: `Template ${i}`,
        badge: i % 5 === 0 ? 'PLUS' : null,
      });
    }
    return [...baseTemplates, ...moreTemplates];
  };

  // 初始化标签滚动状态
  React.useEffect(() => {
    templateCategories.forEach((category) => {
      const scrollElement = tagScrollRefs.current[category.id];
      if (scrollElement) {
        checkTagScrollPosition(category.id);
        const handleScroll = () => checkTagScrollPosition(category.id);
        const handleResize = () => checkTagScrollPosition(category.id);
        scrollElement.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
      }
    });
    
    return () => {
      templateCategories.forEach((category) => {
        const scrollElement = tagScrollRefs.current[category.id];
        if (scrollElement) {
          const handleScroll = () => checkTagScrollPosition(category.id);
          const handleResize = () => checkTagScrollPosition(category.id);
          scrollElement.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        }
      });
    };
  }, []);

  // 详情页状态
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [detailSelectedTag, setDetailSelectedTag] = useState<string>('All');
  const detailTagScrollRef = React.useRef<HTMLDivElement>(null);
  const [detailCanScrollLeft, setDetailCanScrollLeft] = useState(false);
  const [detailCanScrollRight, setDetailCanScrollRight] = useState(true);

  // 检查详情页标签滚动位置
  const checkDetailTagScrollPosition = () => {
    if (detailTagScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = detailTagScrollRef.current;
      setDetailCanScrollLeft(scrollLeft > 0);
      setDetailCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // 详情页标签向右滑动
  const scrollDetailTagRight = () => {
    if (detailTagScrollRef.current) {
      detailTagScrollRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
      setTimeout(checkDetailTagScrollPosition, 300);
    }
  };

  // 详情页标签向左滑动
  const scrollDetailTagLeft = () => {
    if (detailTagScrollRef.current) {
      detailTagScrollRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
      setTimeout(checkDetailTagScrollPosition, 300);
    }
  };

  // 进入详情页时重置当前分类的选中标签（避免从其他分类带来的 tag 导致 layout 无数据）
  React.useEffect(() => {
    if (categoryDetail) {
      setDetailSelectedTag('All');
    }
  }, [categoryDetail?.categoryId]);

  // 初始化详情页标签滚动状态
  React.useEffect(() => {
    if (categoryDetail) {
      checkDetailTagScrollPosition();
      const scrollElement = detailTagScrollRef.current;
      if (scrollElement) {
        scrollElement.addEventListener('scroll', checkDetailTagScrollPosition);
        window.addEventListener('resize', checkDetailTagScrollPosition);
        return () => {
          scrollElement.removeEventListener('scroll', checkDetailTagScrollPosition);
          window.removeEventListener('resize', checkDetailTagScrollPosition);
        };
      }
    }
  }, [categoryDetail]);

  // 如果显示详情页
  if (categoryDetail) {
    const currentCategory = templateCategories.find(cat => cat.id === categoryDetail.categoryId);
    // 生成详情页的模板数据
    const detailTemplates = currentCategory ? generateMoreTemplates(categoryDetail.categoryId, currentCategory.templates) : [];

    return (
      <div className={`w-80 bg-white border-r border-gray-200 flex flex-col h-full relative ${categoryDetail.categoryId === 'layout' && isLayoutSelectMode ? 'z-40' : ''}`}>
        {categoryDetail.categoryId === 'layout' && isLayoutSelectMode && (
          <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 text-sm font-medium z-10 flex items-center justify-center gap-2">
            <span>{t.selectLayoutTemplateHint}</span>
          </div>
        )}
        {/* 顶部导航栏 */}
        <div className={`flex-shrink-0 px-4 py-3 border-b border-gray-200 ${categoryDetail.categoryId === 'layout' && isLayoutSelectMode ? 'pt-12' : ''}`}>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setCategoryDetail(null)}
              className="flex-shrink-0 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">{categoryDetail.categoryTitle}</h2>
          </div>
          
          {/* 搜索框 */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchTemplates}
              value={detailSearchQuery}
              onChange={(e) => setDetailSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
            />
          </div>
        </div>

        {/* 标签栏 */}
        {currentCategory && currentCategory.tags && currentCategory.tags.length > 0 && (
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
            <div className="relative flex items-center">
              {/* 左箭头 */}
              {detailCanScrollLeft && (
                <button
                  onClick={scrollDetailTagLeft}
                  className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              
              {/* 可滚动的标签列表 */}
              <div
                ref={detailTagScrollRef}
                className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {currentCategory.tags.map((tag, index) => {
                  const isSelected = detailSelectedTag === tag;
                  return (
                    <button
                      key={index}
                      onClick={() => setDetailSelectedTag(tag)}
                      className={`
                        flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap
                        ${
                          isSelected
                            ? 'bg-teal-500 text-white'
                            : 'text-gray-700'
                        }
                      `}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              
              {/* 右箭头 */}
              {detailCanScrollRight && (
                <button
                  onClick={scrollDetailTagRight}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 内容区域：Layout 分类为布局模板网格，其他为瀑布流 */}
        <div className="flex-1 overflow-y-auto p-4">
          {categoryDetail.categoryId === 'layout' ? (() => {
            const layoutCategory = detailSelectedTag === 'All' ? 'featured' : detailSelectedTag;
            const layouts = generateLayoutTemplates(layoutCategory);
            const renderLayoutPreview = (layout: LayoutTemplate) => (
              <div className="w-full aspect-square min-h-[80px] bg-gray-50 rounded border border-gray-200 relative overflow-hidden">
                {layout.frames.map((frame) => (
                  <div
                    key={frame.id}
                    className="absolute bg-gray-300 border border-gray-400 rounded-sm"
                    style={{
                      left: `${frame.x}%`,
                      top: `${frame.y}%`,
                      width: `${frame.width}%`,
                      height: `${frame.height}%`,
                    }}
                  />
                ))}
              </div>
            );
            return (
              <div className="grid grid-cols-2 gap-3">
                {layouts.map((layout) => (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => onLayoutSelect?.(layout)}
                    className="flex flex-col items-stretch p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
                  >
                    {renderLayoutPreview(layout)}
                    <p className="text-xs font-medium text-gray-900 text-center mt-2">{layout.name}</p>
                  </button>
                ))}
              </div>
            );
          })() : (
            <div className="columns-2 gap-3">
              {detailTemplates.map((template) => (
                <button
                  key={template.id}
                  className="relative w-full mb-3 rounded-lg overflow-hidden border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all group break-inside-avoid"
                >
                  <div className={`w-full aspect-square ${template.color} flex items-center justify-center`}>
                    <span className="text-[10px] text-gray-600 font-medium text-center px-1">{template.label}</span>
                  </div>
                  {template.badge && (
                    <span className="absolute top-1 left-1 bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      {template.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Fixed area: Search bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchTemplates}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
          />
        </div>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {/* Recommended Tools Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.recommendedTools}</h3>
          <div className="grid grid-cols-3 gap-2">
            {recommendedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  className="flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center mb-1`}>
                    <Icon className={`w-4 h-4 ${tool.iconColor}`} />
                  </div>
                  <p className="text-[10px] font-medium text-gray-700 text-center leading-tight">{tool.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates List */}
        <div className="p-4">
          <div className="space-y-5">
            {templateCategories.map((category) => (
              <div key={category.id}>
                {/* Category header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{t[category.titleKey]}</h3>
                  <button 
                    onClick={() => setCategoryDetail({ categoryId: category.id, categoryTitle: t[category.titleKey] })}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    {t.seeMore}
                  </button>
                </div>
                {/* Tags - 单行滚动 */}
                {category.tags && category.tags.length > 0 && (
                  <div className="relative flex items-center mb-3">
                    {/* 左箭头 */}
                    {tagScrollStates[category.id]?.canScrollLeft && (
                      <button
                        onClick={() => scrollTagLeft(category.id)}
                        className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* 可滚动的标签列表 */}
                    <div
                      ref={(el) => {
                        tagScrollRefs.current[category.id] = el;
                      }}
                      className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {category.tags.map((tag, index) => {
                        const isSelected = selectedTags[category.id] === tag;
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedTags(prev => ({
                              ...prev,
                              [category.id]: isSelected ? null : tag,
                            }))}
                            className={`
                              flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap
                              ${
                                isSelected
                                  ? 'bg-teal-500 text-white'
                                  : 'text-gray-700'
                              }
                            `}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* 右箭头 */}
                    {tagScrollStates[category.id]?.canScrollRight && (
                      <button
                        onClick={() => scrollTagRight(category.id)}
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                {/* Templates grid：Layout 分类用布局预览缩略图，其他用 template 列表 */}
                <div className="grid grid-cols-3 gap-2">
                  {category.id === 'layout' ? (
                    (() => {
                      const layoutPreviews = generateLayoutTemplates('featured').slice(0, 3);
                      return layoutPreviews.map((layout) => (
                        <button
                          key={layout.id}
                          type="button"
                          onClick={() => setCategoryDetail({ categoryId: 'layout', categoryTitle: t.templateCategoryLayout })}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all group"
                        >
                          <div className="w-full h-full bg-gray-50 p-1 relative">
                            {layout.frames.map((frame) => (
                              <div
                                key={frame.id}
                                className="absolute bg-gray-300 border border-gray-400 rounded-sm"
                                style={{
                                  left: `${frame.x}%`,
                                  top: `${frame.y}%`,
                                  width: `${frame.width}%`,
                                  height: `${frame.height}%`,
                                }}
                              />
                            ))}
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </button>
                      ));
                    })()
                  ) : (
                    category.templates.map((template) => (
                      <button
                        key={template.id}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all group"
                      >
                        <div className={`w-full h-full ${template.color} flex items-center justify-center`}>
                          <span className="text-[10px] text-gray-600 font-medium text-center px-1">{template.label}</span>
                        </div>
                        {template.badge && (
                          <span className="absolute top-1 left-1 bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                            {template.badge}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Background Tab 组件
function BackgroundTabContent() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [customBackgrounds, setCustomBackgrounds] = useState<{ id: string; url: string; name: string }[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['new', 'birthday', 'love'])); // 默认展开前几个
  const [categoryDetail, setCategoryDetail] = useState<{ categoryId: string; categoryTitle: string } | null>(null);
  
  // 初始化每个分类的默认选中标签为 "All"
  const initialSelectedTags: { [categoryId: string]: string | null } = {};
  const [selectedTags, setSelectedTags] = useState<{ [categoryId: string]: string | null }>(initialSelectedTags);
  const tagScrollRefs = React.useRef<{ [categoryId: string]: HTMLDivElement | null }>({});
  const [tagScrollStates, setTagScrollStates] = useState<{ [categoryId: string]: { canScrollLeft: boolean; canScrollRight: boolean } }>({});

  // 检查标签滚动位置
  const checkTagScrollPosition = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
      setTagScrollStates(prev => ({
        ...prev,
        [categoryId]: {
          canScrollLeft: scrollLeft > 0,
          canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
        },
      }));
    }
  };

  // 标签向右滑动
  const scrollTagRight = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      scrollElement.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
      setTimeout(() => checkTagScrollPosition(categoryId), 300);
    }
  };

  // 标签向左滑动
  const scrollTagLeft = (categoryId: string) => {
    const scrollElement = tagScrollRefs.current[categoryId];
    if (scrollElement) {
      scrollElement.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
      setTimeout(() => checkTagScrollPosition(categoryId), 300);
    }
  };

  // 切换分类展开/折叠
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Handle file upload
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const newBackgrounds = Array.from(files).map(file => ({
          id: `bg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: URL.createObjectURL(file),
          name: file.name,
        }));
        setCustomBackgrounds([...customBackgrounds, ...newBackgrounds]);
      }
    };
    input.click();
  };

  // Background categories with tags and items
  const backgroundCategories = [
    {
      id: 'new',
      title: 'New',
      tags: ['All', 'Latest', 'Trending', 'Featured', 'Recent'],
      backgrounds: [
        { id: 'new-1', colors: ['#FF6B6B', '#4ECDC4'], pattern: 'gradient' },
        { id: 'new-2', colors: ['#95E1D3', '#F38181'], pattern: 'gradient' },
        { id: 'new-3', colors: ['#AA96DA', '#FCBAD3'], pattern: 'gradient' },
        { id: 'new-4', colors: ['#A8E6CF', '#FFD3B6'], pattern: 'gradient' },
      ],
    },
    {
      id: 'birthday',
      title: 'Birthday',
      tags: ['All', 'Party', 'Cake', 'Balloons', 'Celebration', 'Gift', 'Happy', 'Fun'],
      backgrounds: [
        { id: 'bd-1', colors: ['#FF6B9D', '#C44EFF'], pattern: 'confetti' },
        { id: 'bd-2', colors: ['#FFD93D', '#FF6B6B'], pattern: 'dots' },
        { id: 'bd-3', colors: ['#A8E6CF', '#FFD3B6'], pattern: 'stripes' },
        { id: 'bd-4', colors: ['#FF9A9E', '#FECFEF'], pattern: 'gradient' },
      ],
    },
    {
      id: 'love',
      title: 'Love',
      tags: ['All', 'Romantic', 'Valentine', 'Heart', 'Pink', 'Red', 'Sweet', 'Couple'],
      backgrounds: [
        { id: 'lv-1', colors: ['#FF6B9D', '#C44EFF'], pattern: 'hearts' },
        { id: 'lv-2', colors: ['#FF4757', '#FF6B81'], pattern: 'gradient' },
        { id: 'lv-3', colors: ['#FF9FF3', '#FECFEF'], pattern: 'dots' },
        { id: 'lv-4', colors: ['#E91E63', '#F06292'], pattern: 'gradient' },
      ],
    },
    {
      id: 'glitter',
      title: 'Glitter',
      tags: ['All', 'Sparkle', 'Shine', 'Gold', 'Silver', 'Metallic', 'Luxury', 'Elegant'],
      backgrounds: [
        { id: 'gl-1', colors: ['#FFD700', '#FFA500'], pattern: 'sparkle' },
        { id: 'gl-2', colors: ['#C0C0C0', '#FFFFFF'], pattern: 'metallic' },
        { id: 'gl-3', colors: ['#FFD700', '#FF6B6B'], pattern: 'glitter' },
        { id: 'gl-4', colors: ['#E8E8E8', '#FFD700'], pattern: 'shine' },
      ],
    },
    {
      id: 'business',
      title: 'Business',
      tags: ['All', 'Professional', 'Corporate', 'Office', 'Formal', 'Modern', 'Clean', 'Minimal'],
      backgrounds: [
        { id: 'bs-1', colors: ['#1E3A5F', '#2C3E50'], pattern: 'solid' },
        { id: 'bs-2', colors: ['#34495E', '#ECF0F1'], pattern: 'gradient' },
        { id: 'bs-3', colors: ['#2C3E50', '#3498DB'], pattern: 'gradient' },
        { id: 'bs-4', colors: ['#95A5A6', '#ECF0F1'], pattern: 'stripes' },
      ],
    },
    {
      id: 'seasons',
      title: 'Seasons',
      tags: ['All', 'Spring', 'Summer', 'Autumn', 'Winter', 'Nature', 'Weather', 'Holiday'],
      backgrounds: [
        { id: 'ss-1', colors: ['#A8E6CF', '#FFD3B6'], pattern: 'spring' },
        { id: 'ss-2', colors: ['#4ECDC4', '#44A08D'], pattern: 'summer' },
        { id: 'ss-3', colors: ['#FF6B6B', '#FFA07A'], pattern: 'autumn' },
        { id: 'ss-4', colors: ['#E0E0E0', '#B0BEC5'], pattern: 'winter' },
      ],
    },
    // 可以继续添加更多分类...
  ];

  // 初始化标签选中状态
  backgroundCategories.forEach(category => {
    if (!initialSelectedTags[category.id]) {
      initialSelectedTags[category.id] = 'All';
    }
  });
  
  // 初始化标签滚动状态
  React.useEffect(() => {
    backgroundCategories.forEach((category) => {
      if (category.tags && category.tags.length > 0) {
        checkTagScrollPosition(category.id);
        const scrollElement = tagScrollRefs.current[category.id];
        if (scrollElement) {
          const handleScroll = () => checkTagScrollPosition(category.id);
          const handleResize = () => checkTagScrollPosition(category.id);
          scrollElement.addEventListener('scroll', handleScroll);
          window.addEventListener('resize', handleResize);
        }
      }
    });
    
    return () => {
      backgroundCategories.forEach((category) => {
        const scrollElement = tagScrollRefs.current[category.id];
        if (scrollElement) {
          const handleScroll = () => checkTagScrollPosition(category.id);
          const handleResize = () => checkTagScrollPosition(category.id);
          scrollElement.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        }
      });
    };
  }, []);

  // Color swatches
  const colorSwatches = [
    // Row 1 - Basic colors
    { id: 'palette', type: 'icon', icon: '🎨' },
    { id: 'picker', type: 'icon', icon: '✏️' },
    { id: 'transparent', type: 'pattern', pattern: 'transparent' },
    { id: 'black', type: 'color', color: '#000000' },
    { id: 'white', type: 'color', color: '#FFFFFF' },
    { id: 'red', type: 'color', color: '#FF4757' },
    { id: 'cyan', type: 'color', color: '#00D9FF' },
    // Row 2 - Gradient colors
    { id: 'rainbow', type: 'gradient', gradient: 'linear-gradient(to right, red, orange, yellow, green, blue, purple)' },
    { id: 'yellow-orange', type: 'gradient', gradient: 'linear-gradient(135deg, #FFD93D, #FF6B6B)' },
    { id: 'purple', type: 'color', color: '#A855F7' },
    { id: 'pink-purple', type: 'gradient', gradient: 'linear-gradient(135deg, #FF6B9D, #C44EFF)' },
    { id: 'pink', type: 'gradient', gradient: 'linear-gradient(135deg, #FF9A9E, #FECFEF)' },
    { id: 'blue-purple', type: 'gradient', gradient: 'linear-gradient(135deg, #667EEA, #764BA2)' },
    { id: 'teal-blue', type: 'gradient', gradient: 'linear-gradient(135deg, #4FACFE, #00F2FE)' },
  ];


  // Generate pattern background style
  const getPatternStyle = (bg: { colors: string[]; pattern: string }) => {
    const baseColor = bg.colors[0];
    const secondColor = bg.colors[1] || '#FFFFFF';
    
    switch (bg.pattern) {
      case 'stripes':
        return { background: `repeating-linear-gradient(0deg, ${baseColor} 0px, ${baseColor} 10px, ${secondColor} 10px, ${secondColor} 20px)` };
      case 'diagonal':
        return { background: `repeating-linear-gradient(45deg, ${baseColor} 0px, ${baseColor} 10px, ${secondColor} 10px, ${secondColor} 20px)` };
      case 'stripes-vertical':
        return { background: `repeating-linear-gradient(90deg, ${baseColor} 0px, ${baseColor} 8px, ${secondColor} 8px, ${secondColor} 16px)` };
      case 'dots':
        return { background: `radial-gradient(circle, ${baseColor} 20%, ${secondColor} 20%)`, backgroundSize: '10px 10px' };
      default:
        return { background: `linear-gradient(135deg, ${baseColor}, ${secondColor})` };
    }
  };

  // 如果显示详情页
  if (categoryDetail) {
    const currentCategory = backgroundCategories.find(cat => cat.id === categoryDetail.categoryId);
    const [detailSearchQuery, setDetailSearchQuery] = useState('');
    const [detailSelectedTag, setDetailSelectedTag] = useState<string>('All');
    const detailTagScrollRef = React.useRef<HTMLDivElement>(null);
    const [detailCanScrollLeft, setDetailCanScrollLeft] = useState(false);
    const [detailCanScrollRight, setDetailCanScrollRight] = useState(true);

    // 检查详情页标签滚动位置
    const checkDetailTagScrollPosition = () => {
      if (detailTagScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = detailTagScrollRef.current;
        setDetailCanScrollLeft(scrollLeft > 0);
        setDetailCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    // 详情页标签滚动
    const scrollDetailTagRight = () => {
      if (detailTagScrollRef.current) {
        detailTagScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        setTimeout(checkDetailTagScrollPosition, 300);
      }
    };

    const scrollDetailTagLeft = () => {
      if (detailTagScrollRef.current) {
        detailTagScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        setTimeout(checkDetailTagScrollPosition, 300);
      }
    };

    React.useEffect(() => {
      if (categoryDetail) {
        checkDetailTagScrollPosition();
        const scrollElement = detailTagScrollRef.current;
        if (scrollElement) {
          scrollElement.addEventListener('scroll', checkDetailTagScrollPosition);
          window.addEventListener('resize', checkDetailTagScrollPosition);
          return () => {
            scrollElement.removeEventListener('scroll', checkDetailTagScrollPosition);
            window.removeEventListener('resize', checkDetailTagScrollPosition);
          };
        }
      }
    }, [categoryDetail]);

    // 生成详情页的背景数据（可以扩展更多）
    const detailBackgrounds = currentCategory ? [
      ...currentCategory.backgrounds,
      ...currentCategory.backgrounds.map((bg, i) => ({ ...bg, id: `${bg.id}-more-${i}` })),
    ] : [];

    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* 顶部导航栏 */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setCategoryDetail(null)}
              className="flex-shrink-0 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">{categoryDetail.categoryTitle}</h2>
          </div>
          
          {/* 搜索框 */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchBackgrounds}
              value={detailSearchQuery}
              onChange={(e) => setDetailSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
            />
          </div>
        </div>

        {/* 标签栏 */}
        {currentCategory && currentCategory.tags && currentCategory.tags.length > 0 && (
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
            <div className="relative flex items-center">
              {detailCanScrollLeft && (
                <button
                  onClick={scrollDetailTagLeft}
                  className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              
              <div
                ref={detailTagScrollRef}
                className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {currentCategory.tags.map((tag, index) => {
                  const isSelected = detailSelectedTag === tag;
                  return (
                    <button
                      key={index}
                      onClick={() => setDetailSelectedTag(tag)}
                      className={`
                        flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap
                        ${isSelected ? 'bg-teal-500 text-white' : 'text-gray-700'}
                      `}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              
              {detailCanScrollRight && (
                <button
                  onClick={scrollDetailTagRight}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 瀑布流内容区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="columns-2 gap-3">
            {detailBackgrounds.map((bg) => (
              <button
                key={bg.id}
                className="relative w-full mb-3 rounded-lg overflow-hidden border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all group break-inside-avoid"
                style={getPatternStyle(bg)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Fixed area: Search bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchBackgrounds}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
          />
        </div>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {/* Upload Custom Background */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.customBackground}</h3>
          <button 
            onClick={handleUpload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium mb-3"
          >
            <Upload className="w-4 h-4" />
            <span>{t.uploadImage}</span>
          </button>
          
          {/* Custom backgrounds grid */}
          {customBackgrounds.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {customBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  className="aspect-square rounded-lg border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all overflow-hidden"
                >
                  <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.color}</h3>
          <div className="grid grid-cols-7 gap-2">
            {colorSwatches.map((swatch) => (
              <button
                key={swatch.id}
                className="w-9 h-9 rounded-lg border border-gray-200 hover:border-teal-500 hover:scale-110 transition-all overflow-hidden flex items-center justify-center"
                style={
                  swatch.type === 'color' 
                    ? { backgroundColor: swatch.color }
                    : swatch.type === 'gradient'
                    ? { background: swatch.gradient }
                    : swatch.type === 'pattern'
                    ? { 
                        background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 8px 8px'
                      }
                    : {}
                }
              >
                {swatch.type === 'icon' && (
                  <span className="text-lg">{swatch.icon}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Background Categories */}
        <div className="p-4">
          <div className="space-y-5">
            {backgroundCategories
              .filter(category => 
                searchQuery === '' || 
                category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((category) => (
              <div key={category.id}>
                {/* Category header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{category.title}</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCategoryDetail({ categoryId: category.id, categoryTitle: category.title })}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {t.seeMore}
                    </button>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="w-4 h-4 rotate-180" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Tags - 单行滚动 */}
                {expandedCategories.has(category.id) && category.tags && category.tags.length > 0 && (
                  <div className="relative flex items-center mb-3">
                    {/* 左箭头 */}
                    {tagScrollStates[category.id]?.canScrollLeft && (
                      <button
                        onClick={() => scrollTagLeft(category.id)}
                        className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* 可滚动的标签列表 */}
                    <div
                      ref={(el) => {
                        tagScrollRefs.current[category.id] = el;
                      }}
                      className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {category.tags.map((tag, index) => {
                        const isSelected = selectedTags[category.id] === tag;
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedTags(prev => ({
                              ...prev,
                              [category.id]: isSelected ? null : tag,
                            }))}
                            className={`
                              flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap
                              ${
                                isSelected
                                  ? 'bg-teal-500 text-white'
                                  : 'text-gray-700'
                              }
                            `}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* 右箭头 */}
                    {tagScrollStates[category.id]?.canScrollRight && (
                      <button
                        onClick={() => scrollTagRight(category.id)}
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                
                {/* Backgrounds grid - 只在展开时显示 */}
                {expandedCategories.has(category.id) && (
                  <div className="grid grid-cols-4 gap-2">
                    {category.backgrounds.map((bg) => (
                      <button
                        key={bg.id}
                        className="aspect-square rounded-lg border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all overflow-hidden"
                        style={getPatternStyle(bg)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout Tab 组件
function LayoutTabContent({ onLayoutSelect, isLayoutSelectMode = false }: { onLayoutSelect?: (layout: any) => void; isLayoutSelectMode?: boolean }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('1');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const pictureCountScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 所有分区（用于内容显示）
  const allCategories = [
    { id: 'featured', label: 'Featured' },
    { id: '1', label: '1 Picture' },
    { id: '2', label: '2 Picture' },
    { id: '3', label: '3 Picture' },
    { id: '4', label: '4 Picture' },
    { id: '5', label: '5 Picture' },
    { id: '6', label: '6 Picture' },
    { id: '7', label: '7 Picture' },
    { id: '8', label: '8 Picture' },
    { id: '9', label: '9 Picture' },
    { id: '10', label: '10 Picture' },
    { id: '11', label: '11 Picture' },
    { id: '12', label: '12 Picture' },
    { id: '13', label: '13 Picture' },
    { id: '14', label: '14 Picture' },
  ];

  // 标签栏显示的分区（不包含 Featured，且标签只显示数字）
  const tabCategories = allCategories
    .filter(cat => cat.id !== 'featured')
    .map(cat => ({ ...cat, label: cat.id })); // 标签栏只显示数字，不显示 "Picture"

  // 检查滚动位置
  const checkScrollPosition = () => {
    if (pictureCountScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = pictureCountScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // 向右滑动
  const scrollRight = () => {
    if (pictureCountScrollRef.current) {
      pictureCountScrollRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
      // 延迟检查滚动位置，等待滚动动画完成
      setTimeout(checkScrollPosition, 300);
    }
  };

  // 向左滑动
  const scrollLeft = () => {
    if (pictureCountScrollRef.current) {
      pictureCountScrollRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
      // 延迟检查滚动位置，等待滚动动画完成
      setTimeout(checkScrollPosition, 300);
    }
  };

  // 初始化时检查滚动位置，并在窗口大小改变时重新检查
  React.useEffect(() => {
    checkScrollPosition();
    const scrollElement = pictureCountScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        scrollElement.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  // 渲染布局预览
  const renderLayoutPreview = (layout: LayoutTemplate) => {
    return (
      <div className="w-full h-20 bg-gray-50 rounded mb-2 relative overflow-hidden border border-gray-200">
        {layout.frames.map((frame) => (
          <div
            key={frame.id}
            className="absolute bg-gray-200 border border-gray-300"
            style={{
              left: `${frame.x}%`,
              top: `${frame.y}%`,
              width: `${frame.width}%`,
              height: `${frame.height}%`,
            }}
          />
        ))}
      </div>
    );
  };

  // 点击标签时滚动到对应分区
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const sectionElement = sectionRefs.current[categoryId];
    if (sectionElement && scrollContainerRef.current) {
      const containerTop = scrollContainerRef.current.offsetTop;
      const sectionTop = sectionElement.offsetTop;
      scrollContainerRef.current.scrollTo({
        top: sectionTop - containerTop - 16, // 减去一些偏移量
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`w-80 bg-white border-r border-gray-200 flex flex-col h-full relative ${isLayoutSelectMode ? 'z-40' : ''}`}>
      {/* Layout 选择模式提示横幅 */}
      {isLayoutSelectMode && (
        <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 text-sm font-medium z-10 flex items-center justify-center gap-2">
          <span>{t.selectLayoutTemplateHint}</span>
        </div>
      )}

      {/* 分区选择 - 水平滚动样式（不包含 Featured） */}
      <div className={`flex-shrink-0 px-4 py-3 border-b border-gray-200 ${isLayoutSelectMode ? 'pt-12' : ''}`}>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.pictureCount}</h3>
        <div className="relative flex items-center">
          {/* 左箭头 */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          
          {/* 可滚动的数字列表 */}
          <div
            ref={pictureCountScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* 数字按钮 */}
            {tabCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    selectedCategory === category.id
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-700'
                  }
                `}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* 右箭头 */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 布局模板列表 - 显示所有分区的 layout（包含 Featured） */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {allCategories.map((category) => {
          try {
            const layouts = generateLayoutTemplates(category.id);
            if (!layouts || layouts.length === 0) {
              return null;
            }
            return (
              <div
                key={category.id}
                ref={(el) => {
                  sectionRefs.current[category.id] = el;
                }}
                className="p-4"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{category.label}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {layouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => {
                        onLayoutSelect?.(layout);
                      }}
                      className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
                    >
                      {/* 布局预览 */}
                      {renderLayoutPreview(layout)}
                      <p className="text-xs font-medium text-gray-900 text-center">{layout.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          } catch (error) {
            console.error(`Error generating layouts for category ${category.id}:`, error);
            return null;
          }
        })}
      </div>
    </div>
  );
}

// Upload Tab 组件
function UploadTabContent({ onImageAdd }: { onImageAdd?: (imageLayer: ImageLayer) => void }) {
  const { t } = useLanguage();
  const [uploadedImages, setUploadedImages] = useState<{ id: string; url: string; name: string; type: 'image' | 'video' | 'font' }[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'images' | 'videos' | 'fonts'>('all');

  // 处理文件上传
  const handleUpload = (acceptType: string = 'image/*,video/*') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptType;
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach(file => {
          const url = URL.createObjectURL(file);
          const isVideo = file.type.startsWith('video/');
          const isFont = file.type === 'font/ttf' || 
                         file.type === 'font/otf' || 
                         file.type === 'application/font-woff' ||
                         file.type === 'application/font-woff2' ||
                         file.name.endsWith('.ttf') ||
                         file.name.endsWith('.otf') ||
                         file.name.endsWith('.woff') ||
                         file.name.endsWith('.woff2');
          setUploadedImages(prev => [...prev, {
            id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url,
            name: file.name,
            type: isFont ? 'font' : (isVideo ? 'video' : 'image'),
          }]);
        });
      }
    };
    input.click();
  };

  // 处理添加到画布
  const handleAddToCanvas = (item: { id: string; url: string; name: string; type: 'image' | 'video' | 'font' }) => {
    if (item.type === 'image') {
      onImageAdd?.({
        id: `image-${Date.now()}`,
        url: item.url,
        name: item.name,
      });
    }
    // Video support can be added later
  };

  // 处理删除
  const handleDelete = (id: string) => {
    setUploadedImages(prev => prev.filter(item => item.id !== id));
  };

  // 过滤显示的内容
  const filteredItems = uploadedImages.filter(item => {
    if (activeSection === 'all') return true;
    if (activeSection === 'images') return item.type === 'image';
    if (activeSection === 'videos') return item.type === 'video';
    if (activeSection === 'fonts') return item.type === 'font';
    return true;
  });

  const imageCount = uploadedImages.filter(item => item.type === 'image').length;
  const videoCount = uploadedImages.filter(item => item.type === 'video').length;
  const fontCount = uploadedImages.filter(item => item.type === 'font').length;

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Section Tabs */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('all')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'all' 
                ? 'bg-teal-50 text-teal-600 border border-teal-200' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.all} ({uploadedImages.length})
          </button>
          <button
            onClick={() => setActiveSection('images')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeSection === 'images' 
                ? 'bg-teal-50 text-teal-600 border border-teal-200' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{imageCount}</span>
          </button>
          <button
            onClick={() => setActiveSection('videos')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeSection === 'videos' 
                ? 'bg-teal-50 text-teal-600 border border-teal-200' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{videoCount}</span>
          </button>
          <button
            onClick={() => setActiveSection('fonts')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeSection === 'fonts' 
                ? 'bg-teal-50 text-teal-600 border border-teal-200' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>{fontCount}</span>
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Folder className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">{t.noFilesUploaded}</p>
            <p className="text-xs mt-1">{t.clickUploadToAddFiles}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Images Section */}
            {(activeSection === 'all' || activeSection === 'images') && imageCount > 0 && (
              <div>
                {activeSection === 'all' && (
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    {t.images} ({imageCount})
                  </h3>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {filteredItems
                    .filter(item => item.type === 'image')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-teal-500 transition-all cursor-pointer"
                        onClick={() => handleAddToCanvas(item)}
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {(activeSection === 'all' || activeSection === 'videos') && videoCount > 0 && (
              <div>
                {activeSection === 'all' && (
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    {t.videos} ({videoCount})
                  </h3>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {filteredItems
                    .filter(item => item.type === 'video')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 hover:border-teal-500 transition-all cursor-pointer bg-gray-900"
                      >
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                        {/* Video icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                        {/* File name */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-xs text-white truncate">{item.name}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Fonts Section */}
            {(activeSection === 'all' || activeSection === 'fonts') && fontCount > 0 && (
              <div>
                {activeSection === 'all' && (
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    {t.fonts} ({fontCount})
                  </h3>
                )}
                <div className="space-y-2">
                  {filteredItems
                    .filter(item => item.type === 'font')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="group relative flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-500 transition-all cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Type className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.name.split('.').pop()?.toUpperCase() || 'FONT'}
                          </p>
                        </div>
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="flex-shrink-0 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100">
        <button 
          onClick={() => {
            if (activeSection === 'fonts') {
              handleUpload('.ttf,.otf,.woff,.woff2');
            } else if (activeSection === 'images') {
              handleUpload('image/*');
            } else if (activeSection === 'videos') {
              handleUpload('video/*');
            } else {
              handleUpload();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
        >
          <Upload className="w-5 h-5" />
          <span>{t.upload}</span>
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          {activeSection === 'fonts' 
            ? t.supportFonts 
            : activeSection === 'images'
            ? t.supportImages
            : activeSection === 'videos'
            ? t.supportVideos
            : t.supportAllFiles}
        </p>
      </div>
    </div>
  );
}

const MAX_REFERENCE_IMAGES = 14;

/** 输入框下方预设标签（魔杖右侧） */
const PRESET_TAGS = ['Poster', 'Flyer', 'Business card'];
/** 点击「更多」弹窗内的预设选项 */
const PRESET_MODAL_OPTIONS = [
  'Create Poster',
  'Spaceship',
  'Halloween Theme Poster',
  'Christmas Theme Poster',
  'Beauty and Sports Car',
];

/** 模型选项：左侧图标 + 名称 + 右侧单选 */
const AI_IMAGE_MODELS: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; iconBg?: string }[] = [
  { id: 'nano-banana-pro', label: 'Nano Banana Pro', icon: Circle, iconBg: 'bg-amber-400' },
  { id: 'seedream-4.5', label: 'SeeDream 4.5', icon: UserCircle, iconBg: 'bg-gray-300' },
  { id: 'midjourney', label: 'midjourney', icon: ImageIcon, iconBg: 'bg-slate-500' },
  { id: 'seedream-4.0', label: 'SeeDream 4.0', icon: UserCircle, iconBg: 'bg-gray-300' },
  { id: 'nano-banana', label: 'Nano Banana', icon: Circle, iconBg: 'bg-amber-400' },
  { id: 'wan2.6', label: 'wan2.6', icon: Hexagon, iconBg: 'bg-violet-500' },
];

// AI 生图 Tab 内容：一个完整输入框（左上图片区+中部文本+左下魔杖）+ 下方模型/比例/生成
function AIImageGeneratorTabContent({ onBackToApps }: { onBackToApps?: () => void }) {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [selectedModelId, setSelectedModelId] = useState(AI_IMAGE_MODELS[0].id);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('1:1');
  const [referenceImages, setReferenceImages] = useState<{ id: string }[]>([]);

  const ASPECT_RATIOS = ['1:1', '3:2', '2:3', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];
  const modelDropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState<{ bottom: number; left: number } | null>(null);

  const paramsDropdownRef = React.useRef<HTMLDivElement>(null);
  const [paramsDropdownOpen, setParamsDropdownOpen] = useState(false);
  const [paramsDropdownPosition, setParamsDropdownPosition] = useState<{ bottom: number; left: number } | null>(null);
  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [presetModalPosition, setPresetModalPosition] = useState<{ bottom: number; left: number } | null>(null);
  const presetMoreRef = React.useRef<HTMLButtonElement>(null);

  const [generatedImages, setGeneratedImages] = useState<{ id: string; createdAt: number; url?: string; modelName: string }[]>([]);
  const generatedListRef = React.useRef<HTMLDivElement>(null);

  const [inputBoxHeight, setInputBoxHeight] = useState(160);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = inputBoxHeight;
    const onMove = (e2: MouseEvent) => {
      const delta = e2.clientY - startY;
      // 手柄在右上角：向下拖拽为缩小高度，向上为增大
      setInputBoxHeight(Math.min(320, Math.max(120, startHeight - delta)));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const selectedModel = AI_IMAGE_MODELS.find((m) => m.id === selectedModelId) ?? AI_IMAGE_MODELS[0];
  const SelectedModelIcon = selectedModel.icon;

  // 模型下拉：打开时在按钮上方显示（向上展开）
  React.useEffect(() => {
    if (!modelDropdownOpen || typeof window === 'undefined' || !modelDropdownRef.current) return;
    const rect = modelDropdownRef.current.getBoundingClientRect();
    setDropdownPosition({ bottom: window.innerHeight - rect.top + 4, left: rect.left });
  }, [modelDropdownOpen]);

  // 参数下拉：打开时在按钮上方显示
  React.useEffect(() => {
    if (!paramsDropdownOpen || typeof window === 'undefined' || !paramsDropdownRef.current) return;
    const rect = paramsDropdownRef.current.getBoundingClientRect();
    setParamsDropdownPosition({ bottom: window.innerHeight - rect.top + 4, left: rect.left });
  }, [paramsDropdownOpen]);

  // Preset 弹窗：打开时在 More 按钮上方显示
  React.useEffect(() => {
    if (!presetModalOpen || typeof window === 'undefined' || !presetMoreRef.current) return;
    const rect = presetMoreRef.current.getBoundingClientRect();
    setPresetModalPosition({ bottom: window.innerHeight - rect.top + 4, left: rect.left });
  }, [presetModalOpen]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (modelDropdownOpen && !modelDropdownRef.current?.contains(target) && !target.closest('[data-ai-model-dropdown]')) {
        setModelDropdownOpen(false);
      }
      if (paramsDropdownOpen && !paramsDropdownRef.current?.contains(target) && !target.closest('[data-ai-params-dropdown]')) {
        setParamsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modelDropdownOpen, paramsDropdownOpen]);

  const addImage = () => {
    if (referenceImages.length >= MAX_REFERENCE_IMAGES) return;
    setReferenceImages((prev) => [...prev, { id: `img-${Date.now()}` }]);
  };
  const removeImage = (id: string) => {
    setReferenceImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGenerate = () => {
    setGeneratedImages((prev) => [...prev, { id: `gen-${Date.now()}`, createdAt: Date.now(), modelName: selectedModel.label }]);
  };

  const handleRegenerate = (id: string) => {
    setGeneratedImages((prev) => [
      ...prev.filter((img) => img.id !== id),
      { id: `gen-${Date.now()}`, createdAt: Date.now(), modelName: selectedModel.label },
    ]);
  };

  // 生成图列表新增后滚动到底部（最新一条）
  React.useEffect(() => {
    if (generatedImages.length === 0) return;
    const el = generatedListRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [generatedImages.length]);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        {onBackToApps && (
          <button type="button" onClick={onBackToApps} className="p-1 rounded hover:bg-gray-100 text-gray-600" aria-label="Back to Apps">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h3 className="text-sm font-medium text-gray-800">{t.aiImageGenerator}</h3>
      </div>

      {/* 上方：生成图区域，从上到下按时间远到近（旧在上，新在下） */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        <div ref={generatedListRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {generatedImages.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">点击下方生成按钮后，图片将显示在此</p>
          ) : (
            generatedImages.map((img) => (
              <div
                key={img.id}
                className="flex-shrink-0 w-full rounded-lg border border-gray-200 bg-gray-100 overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-square max-h-48">
                  {img.url ? (
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">生成中...</div>
                  )}
                  <span className="absolute left-1.5 top-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/50 text-white truncate max-w-[80%]">
                    {img.modelName ?? selectedModel.label}
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 bg-white border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleRegenerate(img.id)}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded px-2 py-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t.aiImageRegenerate}
                  </button>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded transition-colors"
                      title={t.aiImageLike}
                      aria-label={t.aiImageLike}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                      title={t.aiImageDislike}
                      aria-label={t.aiImageDislike}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded transition-colors"
                      title={t.download}
                      aria-label={t.download}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 下方固定：输入框 + 模型/参数 + Generate（与 Generate 按钮同一区域） */}
      <div className="flex-shrink-0 border-t border-gray-100 p-4 flex flex-col gap-3">
        {/* 一个完整输入框：左上图片区 + 中部文本 + 左下魔杖 + 右下高度拖拽 */}
        <div
          className="flex flex-col rounded-lg border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent relative"
          style={{ height: inputBoxHeight }}
        >
          {/* 左上：图片添加区 + 右上角高度手柄，同一容器内 */}
          <div className="flex-shrink-0 p-2 flex flex-wrap gap-1.5 relative">
            <button
              type="button"
              onClick={addImage}
              disabled={referenceImages.length >= MAX_REFERENCE_IMAGES}
              className="w-11 h-11 flex-shrink-0 rounded border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[10px]">{t.aiImageAdd}</span>
            </button>
            {referenceImages.map((img) => (
              <div
                key={img.id}
                className="relative w-11 h-11 flex-shrink-0 rounded border border-gray-200 bg-gray-100 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-white"
                  aria-label="移除"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {/* 右上角：高度缩放手柄（与图片添加区同容器） */}
            <div
              role="slider"
              aria-label="调整输入框高度"
              onMouseDown={handleResizeStart}
              className="absolute right-0 top-0 w-6 h-6 flex items-start justify-end cursor-ns-resize pointer-events-auto"
            >
              <svg width="18" height="18" viewBox="0 0 12 12" className="shrink-0" fill="none">
                <path
                  d="M5 0 L10 0 A 2 2 0 0 1 12 2 L12 7 L5 0 Z"
                  fill="#9ca3af"
                  stroke="#6b7280"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
          </div>
          {/* 中部：提示词输入 */}
          <div className="flex-1 min-h-0 flex flex-col relative px-2 pb-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.describeYourImage}
              maxLength={2000}
              className="w-full flex-1 min-h-[4rem] pt-0 pb-10 rounded border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none"
              rows={3}
            />
            {/* 底栏单行：魔杖 + 预设标签 + More（左）| 字数 + 竖线 + 删除（右），左右边距与 left-2 一致 */}
            <div className="absolute left-2 right-2 bottom-2 flex items-center justify-between gap-2 flex-nowrap min-w-0 h-6">
              <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
                <button
                  type="button"
                  className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-teal-600 transition-colors shrink-0"
                  title="AI 优化提示词"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                </button>
                {PRESET_TAGS.slice(0, 2).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setPrompt((p) => (p ? `${p} ${label}` : label))}
                    className="px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors shrink-0 max-w-[4.5rem] truncate"
                  >
                    {label}
                  </button>
                ))}
                <button
                  ref={presetMoreRef}
                  type="button"
                  onClick={() => setPresetModalOpen(true)}
                  className="px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors shrink-0"
                >
                  {t.aiImagePresetMore}
                </button>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[11px] text-gray-400 tabular-nums">{prompt.length} / 2000</span>
                <span className="w-px h-2.5 bg-gray-300" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="p-0.5 text-gray-500 hover:text-gray-700 rounded transition-colors"
                  title={t.delete}
                  aria-label={t.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 输入框下方：模型（优先宽度以完整显示名称）+ 参数 */}
        <div className="flex gap-2">
          <div className="min-w-0 flex-[1.8] basis-0 relative" ref={modelDropdownRef} style={{ minWidth: '10.5rem' }}>
            <button
              type="button"
              onClick={() => setModelDropdownOpen((v) => !v)}
              className="w-full h-9 flex items-center gap-2 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 min-h-0"
            >
              <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 ${selectedModel.iconBg ?? 'bg-gray-100'}`}>
                <SelectedModelIcon className="w-3 h-3 text-gray-600" />
              </span>
              <span className="flex-1 text-xs text-left min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" title={selectedModel.label}>{selectedModel.label}</span>
              <ChevronDown className="w-4 h-4 shrink-0 text-gray-500" />
            </button>
            {modelDropdownOpen && dropdownPosition && typeof document !== 'undefined' &&
              createPortal(
                <div
                  data-ai-model-dropdown
                  className="fixed z-[100] w-52 rounded-lg bg-white border border-gray-300 shadow-lg py-1"
                  style={{ bottom: dropdownPosition.bottom, left: dropdownPosition.left }}
                >
                  {AI_IMAGE_MODELS.map((m) => {
                    const Icon = m.icon;
                    const isSelected = m.id === selectedModelId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedModelId(m.id);
                          setModelDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden ${m.iconBg ?? 'bg-gray-100'}`}>
                          <Icon className="w-4 h-4 text-gray-600" />
                        </span>
                        <span className="flex-1 text-sm truncate">{m.label}</span>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-2 ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>,
                document.body
              )}
          </div>
          {/* 参数设置下拉：剩余宽度 */}
          <div className="flex-1 min-w-[4.5rem] basis-0 relative" ref={paramsDropdownRef}>
            <button
              type="button"
              onClick={() => setParamsDropdownOpen((v) => !v)}
              className="w-full h-9 flex items-center gap-2 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 min-h-0"
            >
              <span className="flex-1 text-xs text-left truncate min-w-0" title={`${selectedSize} · ${selectedAspectRatio}`}>
                {selectedSize} · {selectedAspectRatio}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
            </button>
            {paramsDropdownOpen && paramsDropdownPosition && typeof document !== 'undefined' &&
              createPortal(
                <div
                  data-ai-params-dropdown
                  className="fixed z-[100] w-52 rounded-lg bg-white border border-gray-300 shadow-lg p-3 max-h-80 overflow-y-auto"
                  style={{ bottom: paramsDropdownPosition.bottom, left: paramsDropdownPosition.left }}
                >
                  <p className="text-xs font-medium text-gray-700 mb-1.5">{t.aiImageSize}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(['1K', '2K', '4K'] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-2 border-teal-500 bg-teal-50 text-teal-700'
                            : 'border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-1.5">{t.aiImageAspectRatio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ASPECT_RATIOS.map((ar) => (
                      <button
                        key={ar}
                        type="button"
                        onClick={() => setSelectedAspectRatio(ar)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedAspectRatio === ar
                            ? 'border-2 border-teal-500 bg-teal-50 text-teal-700'
                            : 'border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>,
                document.body
              )}
          </div>
        </div>

        {/* Generate 按钮（与 Upload 一致：teal 全宽） */}
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
        >
          <Zap className="w-5 h-5" />
          <span>{t.aiImageGenerate}</span>
        </button>
      </div>

      {/* Preset 弹窗：在 More 按钮下方打开，不占画面中央 */}
      {presetModalOpen && presetModalPosition && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/20"
            aria-hidden
            onClick={() => setPresetModalOpen(false)}
          />
          <div
            className="fixed z-[91] w-72 rounded-lg border border-gray-300 bg-white p-4 shadow-lg"
            style={{ bottom: presetModalPosition.bottom, left: presetModalPosition.left }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-800">{t.aiImagePreset}</h4>
              <button
                type="button"
                onClick={() => setPresetModalOpen(false)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_MODAL_OPTIONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setPrompt((p) => (p ? `${p} ${label}` : label));
                    setPresetModalOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// AI Filter Tab 内容：上传区 + 分类 Tab + 滤镜效果网格
const AI_FILTER_CATEGORIES = ['Hot', 'AI Star', 'AI Weather', 'Pet', 'Portrait', 'Landscape', 'Vintage'] as const;
const AI_FILTER_STYLES = [
  'Puppy Face', 'Angel Wings', 'Bubblegum Pop', 'Baby Career', 'Heart Spotlight', 'Valentine Accent',
  'Cupid Shot', 'Love Mood Grid', 'Rose Moment', 'Sweetheart Dish', 'Valentine Cutie', 'Valentine Mood',
];

function AIFilterTabContent({
  selectedLayerId = null,
  layers = [],
  onBackToApps,
}: {
  selectedLayerId?: string | null;
  layers?: Array<{ id: string; type?: string; imageUrl?: string }>;
  onBackToApps?: () => void;
}) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(AI_FILTER_CATEGORIES[0]);
  const [isDragging, setIsDragging] = useState(false);
  const filterTagScrollRef = React.useRef<HTMLDivElement>(null);
  const [tagScrollState, setTagScrollState] = useState({ canScrollLeft: false, canScrollRight: false });

  // 选中画板中的图片图层时，取该图层的 imageUrl 用于上方预览
  const selectedImageUrl = React.useMemo(() => {
    if (!selectedLayerId || !layers.length) return null;
    const layer = layers.find((l) => l.id === selectedLayerId);
    if (!layer || layer.type !== 'image' || !layer.imageUrl) return null;
    return layer.imageUrl;
  }, [selectedLayerId, layers]);

  const checkFilterTagScroll = () => {
    const el = filterTagScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setTagScrollState({
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
    });
  };

  const scrollFilterTagLeft = () => {
    filterTagScrollRef.current?.scrollBy({ left: -120, behavior: 'smooth' });
    setTimeout(checkFilterTagScroll, 300);
  };

  const scrollFilterTagRight = () => {
    filterTagScrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' });
    setTimeout(checkFilterTagScroll, 300);
  };

  React.useEffect(() => {
    const el = filterTagScrollRef.current;
    const runCheck = () => {
      requestAnimationFrame(checkFilterTagScroll);
    };
    runCheck();
    setTimeout(runCheck, 50);
    if (!el) return;
    el.addEventListener('scroll', checkFilterTagScroll);
    window.addEventListener('resize', checkFilterTagScroll);
    return () => {
      el.removeEventListener('scroll', checkFilterTagScroll);
      window.removeEventListener('resize', checkFilterTagScroll);
    };
  }, []);

  const handleUpload = () => {
    // 占位：后续接实际上传
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // 占位：后续接实际处理
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        {onBackToApps && (
          <button type="button" onClick={onBackToApps} className="p-1 rounded hover:bg-gray-100 text-gray-600" aria-label="Back to Apps">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h3 className="text-sm font-medium text-gray-800">{t.aiFilter}</h3>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col p-4 gap-4">
        {/* 有选中图片时只显示该图片，否则显示上传框 */}
        {selectedImageUrl ? (
          <div className="flex-shrink-0 w-full aspect-square max-h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
            <img src={selectedImageUrl} alt="" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex-shrink-0 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors min-h-[140px] px-4 py-5 ${isDragging ? 'border-teal-400 bg-teal-50' : 'border-gray-300 bg-white'}`}
          >
            <p className="text-sm font-medium text-gray-800 text-center leading-snug">
              {t.aiFilterUploadLine1}
              <br />
              {t.aiFilterUploadLine2}
            </p>
            <p className="text-sm font-medium text-gray-800 text-center">
              {t.aiFilterSelectFromArtboard}
            </p>
            <button
              type="button"
              onClick={handleUpload}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors"
            >
              <Upload className="w-5 h-5" />
              {t.upload}
            </button>
          </div>
        )}

        {/* 分类 Tag 栏：与其它页面一致（选中 teal 实心，未选灰字；左右箭头 + 隐藏滚动条） */}
        <div className="flex-shrink-0 relative flex items-center">
          {tagScrollState.canScrollLeft && (
            <button
              type="button"
              onClick={scrollFilterTagLeft}
              className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="向左滚动"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div
            ref={filterTagScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1 min-w-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {AI_FILTER_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap
                    ${isSelected ? 'bg-teal-500 text-white' : 'text-gray-700'}
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          {tagScrollState.canScrollRight && (
            <button
              type="button"
              onClick={scrollFilterTagRight}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="向右滚动"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 滤镜效果网格：3 列，缩略图 + 文案 */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 pb-2">
            {AI_FILTER_STYLES.map((label) => (
              <button
                key={label}
                type="button"
                className="flex flex-col rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/50 transition-colors text-left"
              >
                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <p className="px-1.5 py-1.5 text-xs font-medium text-gray-800 truncate">{label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Image Enhancer Tab 内容：增强中过渡动画 + 风格选择 + Background Blur（前后对比在画布弹窗中）
const IMAGE_ENHANCER_STYLES = ['standard', 'vivid', 'fresh'] as const;
const ENHANCING_STEPS = [
  { key: 'imageEnhancerStepRemoveBlur' as const, id: 1 },
  { key: 'imageEnhancerStepEnhanceQuality' as const, id: 2 },
  { key: 'imageEnhancerStepUpscaleImage' as const, id: 3 },
  { key: 'imageEnhancerStepBoostDetails' as const, id: 4 },
];

function ImageEnhancerTabContent({ sourceUrl, userStatus = 'free', onEnhancingComplete, onEnhancingStart, onBackToApps }: { sourceUrl?: string | null; userStatus?: 'guest' | 'free' | 'pro'; onEnhancingComplete?: () => void; onEnhancingStart?: () => void; onBackToApps?: () => void }) {
  const { t } = useLanguage();
  const [style, setStyle] = useState<(typeof IMAGE_ENHANCER_STYLES)[number]>('standard');
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const styleDropdownRef = useRef<HTMLDivElement>(null);
  const [enhancingStep, setEnhancingStep] = useState(1);
  const [showEnhancingStepper, setShowEnhancingStepper] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const onEnhancingCompleteRef = useRef(onEnhancingComplete);
  onEnhancingCompleteRef.current = onEnhancingComplete;
  const animationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runEnhancingAnimation = useCallback(() => {
    animationTimeoutsRef.current.forEach((id) => clearTimeout(id));
    animationTimeoutsRef.current = [];
    setShowEnhancingStepper(true);
    setShowMainContent(false);
    setEnhancingStep(1);
    const t1 = setTimeout(() => setEnhancingStep(2), 800);
    const t2 = setTimeout(() => setEnhancingStep(3), 1600);
    const t3 = setTimeout(() => setEnhancingStep(4), 2400);
    const t4 = setTimeout(() => {
      setShowEnhancingStepper(false);
      setShowMainContent(true);
      onEnhancingCompleteRef.current?.();
      animationTimeoutsRef.current = [];
    }, 3200);
    animationTimeoutsRef.current = [t1, t2, t3, t4];
  }, []);

  useEffect(() => {
    if (!sourceUrl) {
      animationTimeoutsRef.current.forEach((id) => clearTimeout(id));
      animationTimeoutsRef.current = [];
      setShowEnhancingStepper(false);
      setShowMainContent(true);
      setEnhancingStep(1);
      return;
    }
    runEnhancingAnimation();
    return () => {
      animationTimeoutsRef.current.forEach((id) => clearTimeout(id));
      animationTimeoutsRef.current = [];
    };
  }, [sourceUrl, runEnhancingAnimation]);

  const handle4kClick = useCallback(() => {
    if (!sourceUrl) return;
    onEnhancingStart?.();
    runEnhancingAnimation();
  }, [sourceUrl, onEnhancingStart, runEnhancingAnimation]);

  useEffect(() => {
    if (!styleDropdownOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (styleDropdownRef.current && !styleDropdownRef.current.contains(e.target as Node)) {
        setStyleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [styleDropdownOpen]);

  const styleLabel = style === 'standard' ? t.imageEnhancerStandard : style === 'vivid' ? t.imageEnhancerVivid : t.imageEnhancerFresh;

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full relative">
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        {onBackToApps && (
          <button type="button" onClick={onBackToApps} className="p-1 rounded hover:bg-gray-100 text-gray-600" aria-label="Back to Apps">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h3 className="text-sm font-medium text-gray-800">{t.imageEnhancer}</h3>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col p-4 gap-4 relative">
        {/* 增强中过渡动画：有图时先展示步骤条，再淡入主内容 */}
        {sourceUrl && showEnhancingStepper && (
          <div className="absolute inset-0 z-10 flex flex-col p-4 bg-white transition-opacity duration-300">
            <h4 className="text-base font-semibold text-gray-900 mb-5">{t.imageEnhancerEnhancing}</h4>
            <div className="flex flex-col gap-0">
              {ENHANCING_STEPS.map((step, index) => {
                const isActive = enhancingStep === step.id;
                const isPast = enhancingStep > step.id;
                const isLast = index === ENHANCING_STEPS.length - 1;
                return (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                          isActive ? 'bg-teal-500 text-white' : isPast ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isActive ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <span className="text-sm font-medium">{isPast ? <Check className="w-4 h-4" /> : step.id}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-6 transition-colors duration-300 ${
                            isPast ? 'bg-teal-500' : 'bg-gray-200'
                          }`}
                          style={{ width: 2 }}
                        />
                      )}
                    </div>
                    <p className={`pt-1.5 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-gray-900' : isPast ? 'text-teal-600' : 'text-gray-500'}`}>
                      {t[step.key]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sourceUrl ? (
          <div
            className={`flex flex-col gap-4 transition-opacity duration-500 ${showMainContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {showMainContent && (
          <>
            {/* 风格选择 */}
            <div className="flex-shrink-0" ref={styleDropdownRef}>
              <p className="text-xs font-medium text-gray-600 mb-1.5">{t.imageEnhancerStyle}</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStyleDropdownOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 text-sm"
                >
                  <span>{styleLabel}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${styleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {styleDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-lg bg-white border border-gray-200 shadow-lg z-20">
                    {IMAGE_ENHANCER_STYLES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setStyle(s); setStyleDropdownOpen(false); }}
                        className={`w-full px-3 py-2 text-left text-sm ${style === s ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {s === 'standard' ? t.imageEnhancerStandard : s === 'vivid' ? t.imageEnhancerVivid : t.imageEnhancerFresh}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Background Blur 开关 */}
            <div className="flex-shrink-0 flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-100 border border-gray-200">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-800">{t.imageEnhancerBackgroundBlur}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={backgroundBlur}
                onClick={() => setBackgroundBlur((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${backgroundBlur ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${backgroundBlur ? 'translate-x-5 left-0.5' : 'translate-x-0 left-0.5'}`}
                />
              </button>
            </div>
          </>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t.imageEnhancerNoImageHint}</p>
        )}
        {/* 左下角 4K 按钮：点击后再播放一次增强动画完成 4K 增强 */}
        <div className="flex-shrink-0 pt-4 mt-auto">
          <button
            type="button"
            onClick={handle4kClick}
            className="relative w-full rounded-xl border-2 border-teal-500 bg-white hover:bg-teal-50/50 text-teal-600 text-left px-4 py-3 transition-colors"
          >
            <span className="absolute -top-1.5 left-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold">
              {t.imageEnhancerProBadge}
            </span>
            <p className="text-sm font-semibold mt-0.5">{t.imageEnhancer4k}</p>
            <p className="text-xs mt-0.5 text-teal-500">{t.imageEnhancer4kSub}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// AI Removal Tab 内容：模式（High Quality / Fast）+ 选择工具（Brush / Magic / Auto Select）+ Size 滑杆 + Remove 按钮
const AI_REMOVAL_TOOLS = ['brush', 'magic', 'auto-select'] as const;

function AIRemovalTabContent({ sourceUrl, brushSize = 30, onBrushSizeChange, hasSelection = false, onRemoveClick, onBackToApps }: { sourceUrl?: string | null; brushSize?: number; onBrushSizeChange?: (size: number) => void; hasSelection?: boolean; onRemoveClick?: () => void; onBackToApps?: () => void }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'high-quality' | 'fast'>('high-quality');
  const [tool, setTool] = useState<(typeof AI_REMOVAL_TOOLS)[number]>('brush');

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        {onBackToApps && (
          <button type="button" onClick={onBackToApps} className="p-1 rounded hover:bg-gray-100 text-gray-600" aria-label="Back to Apps">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h3 className="text-sm font-medium text-gray-800">{t.aiRemoval}</h3>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col p-4 gap-4">
        {sourceUrl ? (
          <>
            {/* 模式：High Quality / Fast */}
            <div className="flex-shrink-0">
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setMode('high-quality')}
                  className="flex-1 flex flex-col items-center pt-2 pb-2.5 relative"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="w-6 h-6 rounded border border-dashed border-gray-400 flex items-center justify-center text-[10px] font-semibold text-gray-600">AI</span>
                    <span className="bg-red-500 text-white text-[10px] px-1 rounded">{t.aiRemovalHot}</span>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">{t.aiRemovalHighQuality}</span>
                  {mode === 'high-quality' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-t" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('fast')}
                  className="flex-1 flex flex-col items-center pt-2 pb-2.5 relative"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Zap className="w-5 h-5 text-gray-600" />
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">{t.aiRemovalFast}</span>
                  {mode === 'fast' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-t" />
                  )}
                </button>
              </div>
            </div>

            {/* 选择工具：Brush / Magic / Auto Select */}
            <div className="flex-shrink-0">
              <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-gray-100 p-0.5">
                {AI_REMOVAL_TOOLS.map((tb) => (
                  <button
                    key={tb}
                    type="button"
                    onClick={() => setTool(tb)}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      tool === tb ? 'bg-white text-gray-800 shadow-sm rounded-md' : 'text-gray-600'
                    }`}
                  >
                    {tb === 'brush' ? t.aiRemovalBrush : tb === 'magic' ? t.aiRemovalMagic : t.aiRemovalAutoSelect}
                  </button>
                ))}
              </div>
            </div>

            {/* Size 滑杆：仅 Brush 时显示，与画布笔刷大小联动 */}
            {tool === 'brush' && (
              <div className="flex-shrink-0">
                <label className="block text-xs font-medium text-gray-600 mb-2">{t.aiRemovalSize}</label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={brushSize}
                  onChange={(e) => onBrushSizeChange?.(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-teal-500"
                />
              </div>
            )}

            {/* Remove 按钮 + 提示：无有效选区时禁用 */}
            <div className="flex-shrink-0 flex flex-col gap-2 mt-auto pt-2">
              <button
                type="button"
                onClick={() => hasSelection && onRemoveClick?.()}
                disabled={!hasSelection}
                className={`w-full py-3 rounded-lg font-semibold text-sm shadow-md transition-colors ${
                  hasSelection
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t.aiRemovalRemove}
              </button>
              <p className="text-xs text-gray-500 text-center">{t.aiRemovalPaintHint}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">{t.aiRemovalNoImageHint}</p>
        )}
      </div>
    </div>
  );
}

// Apps Tab 组件
function AppsTabContent({ onOpenApp }: { onOpenApp?: (appId: string, label: string) => void }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // 首期可点击的 app id（5 个）
  const AVAILABLE_APP_IDS = ['ai-image-generator', 'ai-filter', 'image-enhancer', 'background-remover', 'ai-removal'];

  // App 列表：前 5 个为首期可点击，其余为 2 期（置灰 + 2.1～2.8 徽标）
  const apps = [
    { id: 'ai-image-generator', name: 'AI Image Generator', color: 'from-purple-400 to-pink-300', icon: ImageFastIcon },
    { id: 'ai-filter', name: 'AI Filter', color: 'from-violet-200 to-purple-100', icon: AIEditorIcon },
    { id: 'image-enhancer', name: 'Image enhancer', color: 'from-amber-200 to-orange-200', icon: HighQualityIcon },
    { id: 'background-remover', name: 'Background remover', color: 'from-sky-200 to-blue-100', icon: AIBackgroundIcon },
    { id: 'ai-removal', name: 'AI Removal', color: 'from-gray-200 to-slate-200', icon: QuickRemovalIcon },
    { id: 'ai-video', name: 'AI video', color: 'from-teal-300 to-green-200', icon: Clapperboard, hasVideo: true, phase2: true, badge: '2.1' },
    { id: 'ai-expand', name: 'AIExpand', color: 'from-gray-100 to-slate-100', icon: Expand, phase2: true, badge: '2.2' },
    { id: 'ai-replace', name: 'AIReplace', color: 'from-indigo-200 to-purple-100', icon: ImageIcon, phase2: true, badge: '2.3' },
    { id: 'ai-detach', name: 'aiDetach', color: 'from-rose-200 to-pink-100', icon: Scissors, phase2: true, badge: '2.4' },
    { id: 'ai-super-remove', name: 'AISuperRemove', color: 'from-red-200 to-rose-100', icon: Eraser, phase2: true, badge: '2.5' },
    { id: 'ai-background-maker', name: 'AIBackgroundMaker', color: 'from-violet-200 to-purple-100', icon: Frame, phase2: true, badge: '2.6' },
    { id: 'ai-editor', name: 'AIEditor', color: 'from-slate-200 to-gray-100', icon: Layers, phase2: true, badge: '2.7' },
    { id: 'ai-sticker-maker', name: 'AIStickerMaker', color: 'from-gray-100 to-slate-50', icon: Sticker, phase2: true, badge: '2.8' },
  ];

  // 过滤搜索结果
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Search Bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchApps}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-9"
          />
        </div>
      </div>

      {/* Apps Grid：首期三款可点击，其余 2 期置灰 + Phase 2 徽标 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredApps.map((app) => {
            const IconComponent = app.icon;
            const isAvailable = AVAILABLE_APP_IDS.includes(app.id);
            const label = app.id === 'ai-image-generator' ? t.aiImageGenerator : app.id === 'ai-filter' ? t.aiFilter : app.id === 'image-enhancer' ? t.imageEnhancer : app.id === 'ai-removal' ? t.aiRemoval : app.name;
            return (
              <button
                key={app.id}
                className={`flex flex-col items-center group ${!isAvailable ? 'cursor-not-allowed opacity-60' : ''}`}
                onClick={() => isAvailable && onOpenApp?.(app.id, label)}
                disabled={!isAvailable}
              >
                {/* App Icon */}
                <div className={`relative w-full aspect-square rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-2 overflow-hidden transition-shadow ${isAvailable ? 'group-hover:shadow-lg' : 'grayscale'}`}>
                  <IconComponent className="w-8 h-8 text-gray-700/70" />
                  
                  {/* Video play indicator (仅首期显示) */}
                  {app.hasVideo && isAvailable && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center">
                      <Play className="w-3 h-3 text-gray-700 fill-current" />
                    </div>
                  )}
                  
                  {/* 2 期徽标（2.1～2.8）/ 其它 Badge */}
                  {app.phase2 && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-gray-500 text-white text-[8px] font-bold rounded">
                      {app.badge ?? '2.x'}
                    </div>
                  )}
                  {app.badge && !app.phase2 && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-bold rounded">
                      {app.badge}
                    </div>
                  )}
                  
                  {/* Hover overlay (仅首期) */}
                  {isAvailable && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  )}
                </div>
                
                {/* App Name */}
                <p className="text-xs text-gray-700 text-center leading-tight font-medium">
                  {app.name}
                </p>
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">{t.noAppsFound}</p>
            <p className="text-xs mt-1">{t.tryDifferentSearch}</p>
          </div>
        )}
      </div>
    </div>
  );
}
