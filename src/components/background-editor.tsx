'use client';

import { BackgroundOption } from '@/types/background-remover';

interface BackgroundEditorProps {
  currentBackground: BackgroundOption;
  onBackgroundChange: (background: BackgroundOption) => void;
}

const presetColors = [
  { name: 'Transparent', value: 'transparent', type: 'transparent' as const },
  { name: 'White', value: '#ffffff', type: 'color' as const },
  { name: 'Black', value: '#000000', type: 'color' as const },
  { name: 'Red', value: '#ef4444', type: 'color' as const },
  { name: 'Pink', value: '#ec4899', type: 'color' as const },
  { name: 'Orange', value: '#f97316', type: 'color' as const },
  { name: 'Yellow', value: '#eab308', type: 'color' as const },
  { name: 'Green', value: '#22c55e', type: 'color' as const },
  { name: 'Light Blue', value: '#3b82f6', type: 'color' as const },
  { name: 'Dark Blue', value: '#1e40af', type: 'color' as const },
  { name: 'Purple', value: '#a855f7', type: 'color' as const },
  { name: 'Gradient', value: 'gradient', type: 'color' as const },
];

const presetImages = [
  { url: '/backgrounds/indoor-scene.jpg', name: 'Indoor Scene' },
  { url: '/backgrounds/green-leaves.jpg', name: 'Green Leaves' },
  { url: '/backgrounds/light-gray.jpg', name: 'Light Gray' },
  { url: '/backgrounds/vibrant-blue.jpg', name: 'Vibrant Blue' },
  { url: '/backgrounds/blue-gradient.jpg', name: 'Blue Gradient' },
  { url: '/backgrounds/gray-gradient.jpg', name: 'Gray Gradient' },
];

export function BackgroundEditor({
  currentBackground,
  onBackgroundChange,
}: BackgroundEditorProps) {
  const handleColorSelect = (color: typeof presetColors[0]) => {
    if (color.type === 'transparent') {
      onBackgroundChange({ type: 'transparent' });
    } else {
      onBackgroundChange({
        type: 'color',
        value: color.value,
      });
    }
  };

  const handleImageSelect = (url: string) => {
    onBackgroundChange({
      type: 'image',
      value: url,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* 颜色选择器 */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 mb-2">
          Background Color
        </h4>
        <div className="flex gap-2 flex-wrap">
          {presetColors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 ${
                currentBackground.type === color.type &&
                currentBackground.value === color.value
                  ? 'border-blue-500 scale-110 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{
                backgroundColor:
                  color.type === 'transparent'
                    ? 'transparent'
                    : color.value === 'gradient'
                    ? undefined
                    : color.value,
                backgroundImage:
                  color.type === 'transparent'
                    ? 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)'
                    : color.value === 'gradient'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : undefined,
                backgroundSize:
                  color.type === 'transparent' ? '8px 8px' : undefined,
              }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* 图片背景 */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 mb-2">
          Image Background
        </h4>

        {/* 预设背景图片 - 3列网格，缩小尺寸 */}
        <div className="grid grid-cols-3 gap-1.5">
          {presetImages.map((bg, index) => (
            <div
              key={index}
              onClick={() => handleImageSelect(bg.url)}
              className={`w-full h-12 rounded overflow-hidden cursor-pointer border transition-all ${
                currentBackground.type === 'image' &&
                currentBackground.value === bg.url
                  ? 'border-blue-500 scale-105 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-[8px] text-gray-600 font-medium text-center px-0.5 leading-tight">
                  {bg.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
