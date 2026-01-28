'use client';

import { X, Check, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
}

export function UpgradeModal({ isOpen, onClose, onContinue }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  if (!isOpen) return null;

  const proFeatures = [
    'Unlimited access to AI tools',
    'More AI creative runs',
    'Advanced photo editing tools',
    '10,000+ premium assets',
    'Batch editing up to 50 images at once',
    'Cross-platform access',
    'More pro features coming soon',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Unlock Everything with Pro</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-900">PhotoGrid PRO</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* 左侧：Pro 功能列表 */}
          <div className="p-8 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Pro Features</h3>
            <ul className="space-y-4">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    {feature}
                    {feature === 'Cross-platform access' && (
                      <span className="ml-2 inline-flex gap-1">
                        <span className="text-xs">🍎</span>
                        <span className="text-xs">🤖</span>
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 右侧：价格选择 */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Select your plan</h3>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Check className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* 年度计划 */}
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPlan === 'yearly'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Yearly</span>
                  {selectedPlan === 'yearly' && (
                    <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                      <ThumbsUp className="w-3 h-3" />
                      <span>Best value - 44% off for a limited time</span>
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  HKD22.42 <span className="text-sm font-normal text-gray-600">/mo</span>
                </div>
                <div className="text-sm text-gray-500">Billed HKD269/year</div>
              </button>

              {/* 月度计划 */}
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPlan === 'monthly'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Monthly</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  HKD61.96 <span className="text-sm font-normal text-gray-600">/mo</span>
                </div>
                <div className="text-sm text-gray-500 line-through">HKD77.45</div>
              </button>
            </div>

            {/* 继续按钮 */}
            <button
              onClick={() => {
                onContinue?.();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
