'use client';

import React, { useState } from 'react';
import {
  Upload,
  Folder,
  X,
  Clapperboard,
  Eraser,
  Expand,
  Scissors,
  Frame,
  Layers,
  Sticker,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { AIToolsIcon } from '@/components/icons/ai-tools-icon';
import { RatioIcon } from '@/components/icons/ratio-icon';
import { TextIcon } from '@/components/icons/text-icon';
import { BackgroundIcon } from '@/components/icons/background-icon';
import { ElementsIcon } from '@/components/icons/elements-icon';
import { ImageIcon } from '@/components/icons/image-icon';
import { TemplatesIcon } from '@/components/icons/templates-icon';
import { ImageFastIcon } from '@/components/icons/image-fast-icon';
import { HighQualityIcon } from '@/components/icons/high-quality-icon';
import { QuickRemovalIcon } from '@/components/icons/quick-removal-icon';
import { AIBackgroundIcon } from '@/components/icons/ai-background-icon';
import { AIEditorIcon } from '@/components/icons/ai-editor-icon';

type SidebarTab =
  | 'apps'
  | 'ratio'
  | 'templates'
  | 'upload'
  | 'text'
  | 'image'
  | 'assets'
  | 'background';

/** 动态 App Tab（如 AI 生图） */
export interface OpenAppTab {
  id: string;
  label: string;
}

/** 已知的 App Tab 图标映射 */
const APP_TAB_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'ai-image-generator': ImageFastIcon,
  'ai-filter': AIEditorIcon,
  'image-enhancer': HighQualityIcon,
  'background-remover': AIBackgroundIcon,
  'ai-removal': QuickRemovalIcon,
  'ai-video': Clapperboard,
  'ai-expand': Expand,
  'ai-replace': ImageIcon,
  'ai-detach': Scissors,
  'ai-super-remove': Eraser,
  'ai-background-maker': Frame,
  'ai-editor': Layers,
  'ai-sticker-maker': Sticker,
};

interface LeftSidebarProps {
  activeTab: SidebarTab | string;
  onTabChange: (tab: SidebarTab | string) => void;
  openAppTabs?: OpenAppTab[];
  onCloseAppTab?: (tabId: string) => void;
  highlightTab?: SidebarTab;
  className?: string;
}

export function LeftSidebar({ activeTab, onTabChange, openAppTabs = [], onCloseAppTab, highlightTab, className = '' }: LeftSidebarProps) {
  const { t } = useLanguage();
  
  const tabs: { id: SidebarTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'apps', label: t.apps, icon: AIToolsIcon },
    { id: 'ratio', label: t.ratio, icon: RatioIcon },
    { id: 'templates', label: t.templates, icon: TemplatesIcon },
    { id: 'upload', label: t.upload, icon: Upload },
    { id: 'text', label: t.text, icon: TextIcon },
    { id: 'image', label: t.image, icon: ImageIcon },
    { id: 'assets', label: t.assets, icon: ElementsIcon },
    { id: 'background', label: t.background, icon: BackgroundIcon },
  ];

  return (
    <div className={`w-20 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-x-hidden overflow-y-auto sidebar-scrollbar ${className}`}>
      {/* 固定 Tab 列表 */}
      <div className="flex flex-col py-2 min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isHighlighted = highlightTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center gap-1 px-2 py-3 transition-colors relative
                ${
                  isActive
                    ? 'bg-teal-50 text-teal-600'
                    : isHighlighted
                    ? 'bg-amber-50 text-amber-600 ring-2 ring-amber-400 ring-inset'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : isHighlighted ? 'text-amber-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-teal-600' : isHighlighted ? 'text-amber-600' : 'text-gray-700'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-teal-500" />
              )}
              {isHighlighted && !isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}

        {/* 动态 App Tab，悬停显示关闭按钮 */}
        {openAppTabs.map((appTab) => {
          const AppIcon = APP_TAB_ICONS[appTab.id] ?? Folder;
          const isActive = activeTab === appTab.id;
          return (
            <DynamicAppTabButton
              key={appTab.id}
              id={appTab.id}
              label={appTab.label}
              icon={AppIcon}
              isActive={isActive}
              onSelect={() => onTabChange(appTab.id)}
              onClose={() => onCloseAppTab?.(appTab.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

/** 动态 App Tab：仅圆形 logo（与常驻 Tab 的 icon+label 区分） */
function DynamicAppTabButton({
  id,
  label,
  icon: Icon,
  isActive,
  onSelect,
  onClose,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex justify-center py-2 min-w-0 overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute left-1/2 top-0.5 -translate-x-[22px] z-10 w-4 h-4 min-w-4 min-h-4 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center text-white border border-white shadow"
          aria-label="关闭"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
      <button
        type="button"
        onClick={onSelect}
        title={label}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 transition-colors relative
          ${isActive ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-500/50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700'}
        `}
      >
        <Icon className="w-5 h-5" />
      </button>
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-teal-500 rounded-l pointer-events-none" />
      )}
    </div>
  );
}
