'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { 
  UserMinus, 
  Eraser, 
  Layers, 
  Type, 
  Maximize2, 
  Download, 
  Sparkles,
  Wand2,
  Crop,
  RotateCw,
  RotateCcw,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  Palette,
  Sliders,
  Copy,
  Trash2,
  Image as ImageIcon,
  MoreVertical,
  ChevronDown,
  Minus,
  Square,
  CornerDownRight,
  FlipHorizontal,
  FlipVertical,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Circle,
  Hash,
  GripVertical,
  RefreshCw
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { QuickRemovalIcon } from '@/components/icons/quick-removal-icon';

type LayerType = 'image' | 'text' | 'layout' | 'shape' | 'background';

interface ToolItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  subMenu?: { id: string; label: string }[];
}

interface LayerToolbarProps {
  visible: boolean;
  layerType?: LayerType;
  onToolSelect?: (tool: string) => void;
  onLayoutSelect?: () => void;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onRotateRight90?: () => void;
  onRotateLeft90?: () => void;
}

export function LayerToolbar({
  visible,
  layerType = 'image',
  onToolSelect,
  onLayoutSelect,
  onFlipHorizontal,
  onFlipVertical,
  onRotateRight90,
  onRotateLeft90,
}: LayerToolbarProps) {
  const { t } = useLanguage();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState<string | null>(null);
  const [subMenuPosition, setSubMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [moreMenuPosition, setMoreMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [flipRotateOpen, setFlipRotateOpen] = useState(false);
  const [flipRotateAnchor, setFlipRotateAnchor] = useState<{ top: number; left: number } | null>(null);
  const [alignOpen, setAlignOpen] = useState(false);
  const [alignAnchor, setAlignAnchor] = useState<{ top: number; left: number } | null>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const subMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const toolbarRef = useRef<HTMLDivElement>(null);
  const flipRotatePopoverRef = useRef<HTMLDivElement>(null);
  const alignPopoverRef = useRef<HTMLDivElement>(null);

  const hasFlipRotateActions = [onFlipHorizontal, onFlipVertical, onRotateRight90, onRotateLeft90].some(Boolean);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreMenu && toolbarRef.current) {
        if (!toolbarRef.current.contains(event.target as Node)) {
          setShowMoreMenu(false);
          setMoreMenuPosition(null);
        }
      }
      if (showSubMenu && toolbarRef.current) {
        if (!toolbarRef.current.contains(event.target as Node)) {
          setShowSubMenu(null);
          setSubMenuPosition(null);
        }
      }
      if (flipRotateOpen) {
        if (
          flipRotatePopoverRef.current?.contains(event.target as Node) ||
          toolbarRef.current?.contains(event.target as Node)
        )
          return;
        setFlipRotateOpen(false);
        setFlipRotateAnchor(null);
      }
      if (alignOpen) {
        if (
          alignPopoverRef.current?.contains(event.target as Node) ||
          toolbarRef.current?.contains(event.target as Node)
        )
          return;
        setAlignOpen(false);
        setAlignAnchor(null);
      }
    };

    if (showMoreMenu || showSubMenu || flipRotateOpen || alignOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMoreMenu, showSubMenu, flipRotateOpen, alignOpen]);

  if (!visible) return null;

  // 根据图层类型定义不同的工具
  const getToolsByLayerType = (type: LayerType): { main: ToolItem[]; more: ToolItem[] } => {
    switch (type) {
      case 'image':
        return {
          main: [
            { id: 'enhance', icon: Wand2, label: t.enhance },
            { id: 'remove-bg', icon: UserMinus, label: t.removeBg },
            { id: 'ai-removal', icon: QuickRemovalIcon, label: t.aiRemoval },
            { id: 'replace', icon: RefreshCw, label: t.replace },
            { id: 'crop', icon: Crop, label: t.crop },
            { id: 'adjust', icon: Sliders, label: t.adjust },
            { id: 'flip-rotate', icon: RotateCw, label: t.flipRotate },
            { id: 'align', icon: AlignCenter, label: t.align },
            { id: 'copy', icon: Copy, label: t.copy },
            { id: 'delete', icon: Trash2, label: t.delete },
            { id: 'download', icon: Download, label: t.download },
          ],
          more: [
            { id: 'edit-text', icon: Type, label: t.editText },
            { id: 'expand', icon: Maximize2, label: t.expand },
            { id: 'edit-elements', icon: Layers, label: t.editElements },
            { id: 'erase', icon: Eraser, label: t.erase },
            { id: 'effect', icon: Palette, label: t.effect },
          ],
        };
      
      case 'text':
        return {
          main: [
            { id: 'font', icon: Type, label: t.font },
            { id: 'font-size', icon: Hash, label: t.fontSize },
            { id: 'color', icon: Palette, label: t.color },
            { id: 'opacity', icon: Circle, label: t.opacity },
            { 
              id: 'spacing', 
              icon: AlignJustify, 
              label: t.spacing,
              subMenu: [
                { id: 'letter-spacing', label: t.letterSpacing },
                { id: 'line-spacing', label: t.lineSpacing },
              ]
            },
            { id: 'italic', icon: Italic, label: t.italic },
            { id: 'bold', icon: Bold, label: t.bold },
            { id: 'underline', icon: Underline, label: t.underline },
            { id: 'strikethrough', icon: Strikethrough, label: t.strikethrough },
            { id: 'align', icon: AlignLeft, label: t.align },
            { 
              id: 'effect', 
              icon: Palette, 
              label: t.effect,
              subMenu: [
                { id: 'effect-default', label: t.effectDefault },
                { id: 'effect-shadow', label: t.effectShadow },
                { id: 'effect-stroke', label: t.effectStroke },
                { id: 'effect-background', label: t.effectBackground },
              ]
            },
            { id: 'flip-rotate', icon: RotateCw, label: t.flipRotate },
            { id: 'copy', icon: Copy, label: t.copy },
            { id: 'delete', icon: Trash2, label: t.delete },
          ],
          more: [
            { id: 'ai-write', icon: Sparkles, label: t.aiWrite },
            { id: 'vertical', icon: RotateCw, label: t.vertical },
          ],
        };
      
      case 'layout':
        return {
          main: [
            { id: 'layout', icon: Layers, label: t.layout },
            { id: 'width', icon: Minus, label: t.width },
            { id: 'border', icon: Square, label: t.border },
            { id: 'corner', icon: CornerDownRight, label: t.corner },
            { id: 'flip-rotate', icon: RotateCw, label: t.flipRotate },
            { id: 'delete', icon: Trash2, label: t.delete },
          ],
          more: [],
        };
      
      case 'shape':
        return {
          main: [
            { id: 'color', icon: Palette, label: t.color },
            { id: 'opacity', icon: Circle, label: t.opacity },
            { id: 'copy', icon: Copy, label: t.copy },
            { id: 'align', icon: AlignCenter, label: t.align },
            { id: 'flip-rotate', icon: RotateCw, label: t.flipRotate },
            { id: 'delete', icon: Trash2, label: t.delete },
          ],
          more: [],
        };
      
      case 'background':
        return {
          main: [
            { id: 'change-color', icon: Palette, label: t.changeColor },
            { id: 'upload-bg', icon: ImageIcon, label: t.uploadBg },
            { id: 'gradient', icon: Palette, label: t.gradient },
          ],
          more: [],
        };
      
      default:
        return { main: [], more: [] };
    }
  };

  const toolConfig = getToolsByLayerType(layerType);
  const mainTools: ToolItem[] = toolConfig.main;
  const moreTools: ToolItem[] = toolConfig.more;
  const hasMoreMenu = moreTools.length > 0;

  return (
    <div 
      ref={toolbarRef}
      className="absolute -top-[60px] left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-w-[90vw]"
    >
      <div 
        className="flex items-center px-2 py-1 overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY;
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* 主要工具 */}
        {mainTools.map((tool) => {
          const Icon = tool.icon;
          const hasSubMenu = tool.subMenu && tool.subMenu.length > 0;
          const isSubMenuOpen = showSubMenu === tool.id;
          
          return (
            <div 
              key={tool.id}
              className="relative flex-shrink-0"
              ref={(el) => {
                if (hasSubMenu) {
                  subMenuRefs.current[tool.id] = el;
                }
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (tool.id === 'layout' && layerType === 'layout' && onLayoutSelect) {
                    onLayoutSelect();
                  } else if (tool.id === 'flip-rotate' && hasFlipRotateActions) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFlipRotateAnchor({ top: rect.bottom + 4, left: rect.left });
                    setFlipRotateOpen((prev) => !prev);
                  } else if (tool.id === 'align') {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setAlignAnchor({ top: rect.bottom + 4, left: rect.left });
                    setAlignOpen((prev) => !prev);
                  } else if (hasSubMenu) {
                    const buttonEl = e.currentTarget;
                    if (buttonEl && toolbarRef.current) {
                      const buttonRect = buttonEl.getBoundingClientRect();
                      const toolbarRect = toolbarRef.current.getBoundingClientRect();
                      setSubMenuPosition({
                        x: buttonRect.left - toolbarRect.left + buttonRect.width / 2,
                        y: buttonRect.bottom - toolbarRect.top + 4,
                      });
                    }
                    setShowSubMenu(isSubMenuOpen ? null : tool.id);
                  } else {
                    onToolSelect?.(tool.id);
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className={`flex flex-col items-center px-2 py-1 rounded transition-colors relative group ${
                  isSubMenuOpen || (tool.id === 'flip-rotate' && flipRotateOpen) || (tool.id === 'align' && alignOpen) ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                title={tool.label}
              >
                {tool.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded">
                    {tool.badge}
                  </span>
                )}
                <Icon className="w-5 h-5 text-gray-600" />
                {tool.label && (
                  <span className="text-[10px] text-gray-600 mt-0.5 whitespace-nowrap">{tool.label}</span>
                )}
                {hasSubMenu && (
                  <ChevronDown className={`w-3 h-3 text-gray-400 mt-0.5 transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
            </div>
          );
        })}

        {/* 更多菜单按钮 */}
        {hasMoreMenu && (
          <div 
            className="relative flex-shrink-0 ml-1 border-l border-gray-200 pl-1" 
            ref={moreMenuRef}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                const buttonEl = e.currentTarget;
                if (buttonEl && toolbarRef.current) {
                  const buttonRect = buttonEl.getBoundingClientRect();
                  const toolbarRect = toolbarRef.current.getBoundingClientRect();
                  setMoreMenuPosition({
                    x: buttonRect.right - toolbarRect.left,
                    y: buttonRect.bottom - toolbarRect.top + 4,
                  });
                }
                setShowMoreMenu(!showMoreMenu);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={`flex flex-col items-center px-2 py-1 rounded transition-colors relative group ${
                showMoreMenu ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              title={t.more}
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
      
      {/* 子菜单 - 渲染在滚动容器外部 */}
      {showSubMenu && subMenuPosition && (() => {
        const tool = mainTools.find(t => t.id === showSubMenu);
        if (!tool || !tool.subMenu) return null;
        
        return (
          <div 
            className="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[120px] z-[60]"
            style={{
              left: `${subMenuPosition.x}px`,
              top: `${subMenuPosition.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {tool.subMenu.map((subItem) => (
              <button
                key={subItem.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onToolSelect?.(subItem.id);
                  setShowSubMenu(null);
                  setSubMenuPosition(null);
                }}
                className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-sm text-gray-700">{subItem.label}</span>
              </button>
            ))}
          </div>
        );
      })()}

      {/* 更多菜单 - 渲染在滚动容器外部 */}
      {showMoreMenu && moreMenuPosition && (
        <div 
          className="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[150px] z-[60]"
          style={{
            left: `${moreMenuPosition.x}px`,
            top: `${moreMenuPosition.y}px`,
            transform: 'translateX(-100%)',
          }}
        >
          {moreTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onToolSelect?.(tool.id);
                  setShowMoreMenu(false);
                  setMoreMenuPosition(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{tool.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Flip & Rotate 弹层 */}
      {flipRotateOpen &&
        flipRotateAnchor &&
        createPortal(
          <div
            ref={flipRotatePopoverRef}
            className="fixed z-[70] min-w-[200px] py-2 bg-gray-100 rounded-lg border border-gray-200 shadow-lg"
            style={{ top: flipRotateAnchor.top, left: flipRotateAnchor.left }}
          >
            <div className="px-3 py-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.flip}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFlipHorizontal?.();
                  setFlipRotateOpen(false);
                  setFlipRotateAnchor(null);
                }}
                className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
              >
                <FlipHorizontal className="w-4 h-4 text-gray-600" />
                {t.flipHorizontal}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFlipVertical?.();
                  setFlipRotateOpen(false);
                  setFlipRotateAnchor(null);
                }}
                className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
              >
                <FlipVertical className="w-4 h-4 text-gray-600" />
                {t.flipVertical}
              </button>
            </div>
            <div className="border-t border-gray-200 my-1" />
            <div className="px-3 py-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.rotate}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRotateRight90?.();
                  setFlipRotateOpen(false);
                  setFlipRotateAnchor(null);
                }}
                className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
              >
                <RotateCw className="w-4 h-4 text-gray-600" />
                {t.rotateRight90}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRotateLeft90?.();
                  setFlipRotateOpen(false);
                  setFlipRotateAnchor(null);
                }}
                className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
              >
                <RotateCcw className="w-4 h-4 text-gray-600" />
                {t.rotateLeft90}
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Align objects 弹层 */}
      {alignOpen &&
        alignAnchor &&
        createPortal(
          <div
            ref={alignPopoverRef}
            className="fixed z-[70] min-w-[240px] py-3 px-3 bg-gray-100 rounded-lg border border-gray-200 shadow-lg"
            style={{ top: alignAnchor.top, left: alignAnchor.left }}
          >
            <p className="text-sm font-semibold text-gray-800 mb-3 px-1">{t.alignObjects}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToolSelect?.('align-top');
                    setAlignOpen(false);
                    setAlignAnchor(null);
                  }}
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200 text-left"
                >
                  <AlignStartVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  {t.alignTop}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToolSelect?.('align-middle');
                    setAlignOpen(false);
                    setAlignAnchor(null);
                  }}
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200 text-left"
                >
                  <AlignCenterVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  {t.alignMiddle}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToolSelect?.('align-bottom');
                    setAlignOpen(false);
                    setAlignAnchor(null);
                  }}
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200 text-left"
                >
                  <AlignEndVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  {t.alignBottom}
                </button>
              </div>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToolSelect?.('align-left');
                    setAlignOpen(false);
                    setAlignAnchor(null);
                  }}
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200 text-left"
                >
                  <AlignStartHorizontal className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  {t.alignLeft}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToolSelect?.('align-center');
                    setAlignOpen(false);
                    setAlignAnchor(null);
                  }}
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200 text-left"
                >
                  <AlignCenterHorizontal className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  {t.alignCenter}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToolSelect?.('align-right');
                    setAlignOpen(false);
                    setAlignAnchor(null);
                  }}
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200 text-left"
                >
                  <AlignEndHorizontal className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  {t.alignRight}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
