'use client';

import {
  Sliders,
  Crop,
  RotateCw,
  Maximize2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface EditorToolbarProps {
  onToolSelect?: (tool: string) => void;
  activeTool?: string;
}

export function EditorToolbar({ onToolSelect, activeTool }: EditorToolbarProps) {
  const { t } = useLanguage();
  
  const tools = [
    { id: 'crop', label: t.crop, icon: Crop },
    { id: 'adjust', label: t.adjust, icon: Sliders },
    { id: 'flip-rotate', label: t.flipRotate, icon: RotateCw },
    { id: 'expand', label: t.expand, icon: Maximize2 },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect?.(tool.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                isActive
                  ? 'bg-teal-50 text-teal-600 border border-teal-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
