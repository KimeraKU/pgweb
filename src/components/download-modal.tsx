'use client';

import { X, Download, Crown, Check } from 'lucide-react';
import { UserStatus, UserQuota, ImageQuality } from '@/types/background-remover';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStatus: UserStatus;
  quota: UserQuota;
  imageCount: number;
  onDownload: (quality: ImageQuality) => void;
  onUpgrade?: () => void;
}

export function DownloadModal({
  isOpen,
  onClose,
  userStatus,
  quota,
  imageCount,
  onDownload,
  onUpgrade,
}: DownloadModalProps) {
  if (!isOpen) return null;

  const canDownloadFree = quota.remaining > 0;

  const handleFreeDownload = () => {
    if (!canDownloadFree) {
      alert('Daily free quota exhausted. Please upgrade to Pro or try again tomorrow.');
      return;
    }
    onDownload('standard');
    onClose();
  };

  const handleProDownload = () => {
    if (userStatus === 'pro') {
      onDownload('hd');
      onClose();
    } else {
      onUpgrade?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Select Download Quality
        </h2>

        {/* Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Free Version */}
          <div
            className={`border-2 rounded-xl p-6 transition-all ${
              canDownloadFree
                ? 'border-gray-200 hover:border-blue-300'
                : 'border-gray-100 opacity-60'
            }`}
          >
            <div className="text-center mb-4">
              <Download className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Standard</h3>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Resolution</p>
                <p className="text-lg font-medium text-gray-900">
                  1920 x 1080 px
                </p>
                <p className="text-xs text-gray-400 mt-1">(Compressed)</p>
              </div>

              {userStatus !== 'pro' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800 text-center">
                    Remaining free quota today:
                    <span className="font-bold ml-1">
                      {quota.remaining}/{quota.dailyLimit}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleFreeDownload}
              disabled={!canDownloadFree}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                canDownloadFree
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              Free Download
            </button>
          </div>

          {/* Pro Version */}
          <div className="border-2 border-blue-500 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-purple-50 relative">
            {/* Pro Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PRO
              </span>
            </div>

            <div className="text-center mb-4">
              <Crown className="w-12 h-12 mx-auto text-blue-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Professional</h3>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Resolution</p>
                <p className="text-lg font-medium text-gray-900">
                  4096 x 2160 px
                </p>
                <p className="text-xs text-gray-400 mt-1">(Original Quality)</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Lossless PNG</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Unlimited Batch</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Ultra-Fast Processing</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleProDownload}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {userStatus === 'pro' ? 'Download HD Original' : 'Unlock HD Download'}
            </button>
          </div>
        </div>

        {/* Batch Download Notice */}
        {imageCount > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800">
              Packing <span className="font-bold">{imageCount}</span> images...
            </p>
          </div>
        )}

        {/* Bottom Notice */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Upgrade to Pro to enjoy HD original downloads and unlimited batch processing
        </p>
      </div>
    </div>
  );
}
