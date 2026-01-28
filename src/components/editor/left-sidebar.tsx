'use client';

import React from 'react';
import {
  Upload,
  Folder,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { AIToolsIcon } from '@/components/icons/ai-tools-icon';
import { RatioIcon } from '@/components/icons/ratio-icon';
import { LayoutIcon } from '@/components/icons/layout-icon';
import { TextIcon } from '@/components/icons/text-icon';
import { BackgroundIcon } from '@/components/icons/background-icon';
import { ElementsIcon } from '@/components/icons/elements-icon';
import { ImageIcon } from '@/components/icons/image-icon';
import { TemplatesIcon } from '@/components/icons/templates-icon';

type SidebarTab =
  | 'apps'
  | 'ratio'
  | 'layout'
  | 'templates'
  | 'upload'
  | 'text'
  | 'image'
  | 'assets'
  | 'background'
  | 'batch';

interface LeftSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  highlightTab?: SidebarTab; // 高亮的 tab（用于 layout 选择模式）
  className?: string;
}

export function LeftSidebar({ activeTab, onTabChange, highlightTab, className = '' }: LeftSidebarProps) {
  const { t } = useLanguage();
  
  const tabs: { id: SidebarTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'apps', label: t.apps, icon: AIToolsIcon },
    { id: 'ratio', label: t.ratio, icon: RatioIcon },
    { id: 'layout', label: t.layout, icon: LayoutIcon },
    { id: 'templates', label: t.templates, icon: TemplatesIcon },
    { id: 'upload', label: t.upload, icon: Upload },
    { id: 'text', label: t.text, icon: TextIcon },
    { id: 'image', label: t.image, icon: ImageIcon },
    { id: 'assets', label: t.assets, icon: ElementsIcon },
    { id: 'background', label: t.background, icon: BackgroundIcon },
    { id: 'batch', label: t.batch, icon: Folder },
  ];
  return (
    <div className={`w-20 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto sidebar-scrollbar ${className}`}>
      {/* Tab 列表 */}
      <div className="flex flex-col py-2">
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
      </div>
    </div>
  );
}
