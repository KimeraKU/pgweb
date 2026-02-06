'use client';

import { useRef, useEffect, useState } from 'react';
import {
  Sliders,
  Crop,
  RotateCw,
  RotateCcw,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { createPortal } from 'react-dom';

interface EditorToolbarProps {
  onToolSelect?: (tool: string) => void;
  activeTool?: string;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onRotateRight90?: () => void;
  onRotateLeft90?: () => void;
}

export function EditorToolbar({
  onToolSelect,
  activeTool,
  onFlipHorizontal,
  onFlipVertical,
  onRotateRight90,
  onRotateLeft90,
}: EditorToolbarProps) {
  const { t } = useLanguage();
  const [flipRotateOpen, setFlipRotateOpen] = useState(false);
  const flipRotateButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flipRotateOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current?.contains(e.target as Node) ||
        flipRotateButtonRef.current?.contains(e.target as Node)
      )
        return;
      setFlipRotateOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [flipRotateOpen]);

  const tools = [
    { id: 'crop', label: t.crop, icon: Crop },
    { id: 'adjust', label: t.adjust, icon: Sliders },
    { id: 'flip-rotate', label: t.flipRotate, icon: RotateCw },
    { id: 'expand', label: t.expand, icon: Maximize2 },
  ];

  const handleFlipRotateClick = () => {
    setFlipRotateOpen((prev) => !prev);
  };

  const runAndClose = (fn?: () => void) => {
    fn?.();
    setFlipRotateOpen(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 relative">
      <div className="flex items-center gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id || (tool.id === 'flip-rotate' && flipRotateOpen);
          const isFlipRotate = tool.id === 'flip-rotate';
          return (
            <div key={tool.id} className="relative">
              <button
                ref={isFlipRotate ? flipRotateButtonRef : undefined}
                onClick={() => (isFlipRotate ? handleFlipRotateClick() : onToolSelect?.(tool.id))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border border-gray-300'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tool.label}</span>
              </button>
              {isFlipRotate &&
                flipRotateOpen &&
                flipRotateButtonRef.current &&
                createPortal(
                  <div
                    ref={popoverRef}
                    className="fixed z-50 min-w-[200px] py-2 bg-gray-100 rounded-lg border border-gray-200 shadow-lg"
                    style={{
                      top: flipRotateButtonRef.current.getBoundingClientRect().bottom + 4,
                      left: flipRotateButtonRef.current.getBoundingClientRect().left,
                    }}
                  >
                    <div className="px-3 py-1.5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t.flip}
                      </p>
                      <button
                        type="button"
                        onClick={() => runAndClose(onFlipHorizontal)}
                        className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
                      >
                        <FlipHorizontal className="w-4 h-4 text-gray-600" />
                        {t.flipHorizontal}
                      </button>
                      <button
                        type="button"
                        onClick={() => runAndClose(onFlipVertical)}
                        className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
                      >
                        <FlipVertical className="w-4 h-4 text-gray-600" />
                        {t.flipVertical}
                      </button>
                    </div>
                    <div className="border-t border-gray-200 my-1" />
                    <div className="px-3 py-1.5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t.rotate}
                      </p>
                      <button
                        type="button"
                        onClick={() => runAndClose(onRotateRight90)}
                        className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
                      >
                        <RotateCw className="w-4 h-4 text-gray-600" />
                        {t.rotateRight90}
                      </button>
                      <button
                        type="button"
                        onClick={() => runAndClose(onRotateLeft90)}
                        className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
                      >
                        <RotateCcw className="w-4 h-4 text-gray-600" />
                        {t.rotateLeft90}
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
