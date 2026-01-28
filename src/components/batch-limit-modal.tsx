'use client';

import { X, Crown } from 'lucide-react';

interface BatchLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  maxCount: number;
  onUpgrade?: () => void;
}

export function BatchLimitModal({
  isOpen,
  onClose,
  selectedCount,
  maxCount,
  onUpgrade,
}: BatchLimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Batch Processing Limit
          </h3>

          {/* Message */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            You are currently a free user. The batch processing limit is{' '}
            <span className="font-semibold text-amber-600">{maxCount}</span> images per batch.
            We've automatically selected the first{' '}
            <span className="font-semibold text-amber-600">{maxCount}</span> images.
            Upgrade to Pro to process up to{' '}
            <span className="font-semibold text-blue-600">50</span> images at once and enjoy ultra-fast processing!
          </p>

          {/* Statistics */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">You selected:</span>
              <span className="font-semibold text-gray-900">{selectedCount} images</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Will process:</span>
              <span className="font-semibold text-amber-600">{maxCount} images</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue with first {maxCount}
            </button>
            <button
              onClick={() => {
                onUpgrade?.();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
