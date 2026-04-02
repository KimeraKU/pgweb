'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

const SLIDER_MIN = -100;
const SLIDER_MAX = 100;

export interface AdjustValues {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  vignette: number;
  sharpen: number;
}

const defaultValues: AdjustValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  vignette: 0,
  sharpen: 0,
};

interface AdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Partial<AdjustValues>;
  onApply?: (values: AdjustValues) => void;
}

/** 内联面板，用于左侧边栏内容区 */
interface AdjustPanelProps {
  onClose: () => void;
  initialValues?: Partial<AdjustValues>;
  onApply?: (values: AdjustValues) => void;
}

function SliderRow({
  label,
  value,
  onChange,
  min = SLIDER_MIN,
  max = SLIDER_MAX,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 flex items-center min-w-0 relative h-6">
        {/* 自定义轨道：细条、垂直居中，左侧 teal 右侧灰 */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="adjust-slider absolute inset-0 w-full h-full cursor-pointer"
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            background: 'transparent',
          }}
        />
      </div>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
        }}
        className="w-12 h-8 text-sm text-center border border-gray-300 rounded-md flex-shrink-0 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      />
    </div>
  );
}

function AdjustPanelContent({
  onClose,
  initialValues,
  onApply,
}: {
  onClose: () => void;
  initialValues?: Partial<AdjustValues>;
  onApply?: (values: AdjustValues) => void;
}) {
  const { t } = useLanguage();
  const [values, setValues] = useState<AdjustValues>({ ...defaultValues, ...initialValues });

  const update = (key: keyof AdjustValues, value: number | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply?.(values);
    onClose();
  };

  const handleReset = () => setValues({ ...defaultValues });

  return (
    <>
      <style>{`
        .adjust-slider::-webkit-slider-runnable-track { height: 6px; border-radius: 9999px; background: transparent; }
        .adjust-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #14b8a6; border: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.15); cursor: pointer; margin-top: -4px; }
        .adjust-slider::-moz-range-track { height: 6px; border-radius: 9999px; background: transparent; border: 0; }
        .adjust-slider::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #14b8a6; border: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.15); cursor: pointer; }
      `}</style>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-base font-semibold text-gray-900">{t.adjust}</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-shrink-0 px-4 pt-4 pb-2 space-y-1">
          <SliderRow
            label={t.brightness}
            value={values.brightness}
            onChange={(v) => update('brightness', v)}
          />
          <SliderRow
            label={t.contrast}
            value={values.contrast}
            onChange={(v) => update('contrast', v)}
          />
          <SliderRow
            label={t.saturation}
            value={values.saturation}
            onChange={(v) => update('saturation', v)}
          />
          <SliderRow
            label={t.hue}
            value={values.hue}
            onChange={(v) => update('hue', v)}
          />
          <SliderRow
            label={t.vignette}
            value={values.vignette}
            onChange={(v) => update('vignette', v)}
          />
          <SliderRow
            label={t.sharpen}
            value={values.sharpen}
            onChange={(v) => update('sharpen', v)}
          />
      </div>
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="px-3 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
        >
          Apply
        </button>
      </div>
    </>
  );
}

/** 左侧边栏内联使用的调整面板 */
export function AdjustPanel({ onClose, initialValues, onApply }: AdjustPanelProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <AdjustPanelContent onClose={onClose} initialValues={initialValues} onApply={onApply} />
    </div>
  );
}

export function AdjustModal({ isOpen, onClose, initialValues, onApply }: AdjustModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <AdjustPanelContent onClose={onClose} initialValues={initialValues} onApply={onApply} />
      </div>
    </div>
  );
}
