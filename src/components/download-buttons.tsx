'use client';

import { Download, Crown, Check } from 'lucide-react';
import { UserStatus, UserQuota, ImageQuality } from '@/types/background-remover';

interface DownloadButtonsProps {
  userStatus: UserStatus;
  quota: UserQuota;
  imageCount: number;
  onDownload: (quality: ImageQuality) => void;
  onUpgrade?: () => void;
}

export function DownloadButtons({
  userStatus,
  quota,
  imageCount,
  onDownload,
  onUpgrade,
}: DownloadButtonsProps) {
  const canDownloadFree = quota.remaining > 0;

  const handleFreeDownload = () => {
    if (!canDownloadFree) {
      alert('Daily free quota exhausted. Please upgrade to Pro or try again tomorrow.');
      return;
    }
    onDownload('standard');
  };

  const handleProDownload = () => {
    if (userStatus === 'pro') {
      onDownload('hd');
    } else {
      onUpgrade?.();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Select Download Quality
      </h3>

      <div className="space-y-2">
        {/* Standard Version Button */}
        <button
          onClick={handleFreeDownload}
          disabled={!canDownloadFree}
          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
            canDownloadFree
              ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white'
              : 'border-gray-100 opacity-60 cursor-not-allowed bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">Standard</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            <p className="font-medium">500 x 500 px</p>
          </div>
          <div>
            <span
              className={`inline-block px-3 py-1.5 rounded text-xs font-medium ${
                canDownloadFree
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              Free Download
            </span>
          </div>
        </button>

        {/* Pro Version Button */}
        <button
          onClick={handleProDownload}
          className="w-full p-3 rounded-lg border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all text-left relative"
        >
          {/* Pro Badge */}
          <div className="absolute -top-1.5 right-3">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-2.5 h-2.5" />
              PRO
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900">Professional</span>
          </div>
          <div className="text-xs text-gray-700 mb-2">
            <p className="font-medium">4096 x 2160 px (Up to 4K Quality)</p>
          </div>
          {userStatus !== 'pro' && (
            <div className="mb-2 p-1.5 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-800">
              <p className="text-center">
                Remaining free quota today: <span className="font-bold">{quota.remaining}</span>/{' '}
                {quota.dailyLimit}
              </p>
            </div>
          )}
          <div className="space-y-0.5 mb-2">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
              <Check className="w-2.5 h-2.5 text-green-500" />
              <span>Lossless PNG</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
              <Check className="w-2.5 h-2.5 text-green-500" />
              <span>Unlimited Batch</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
              <Check className="w-2.5 h-2.5 text-green-500" />
              <span>Ultra-Fast Processing</span>
            </div>
          </div>
          <div>
            <span className="inline-block px-3 py-1.5 rounded text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all">
              {userStatus === 'pro' ? 'Download HD Original' : 'Unlock HD Download'}
            </span>
          </div>
        </button>
      </div>

      {/* Batch Download Notice */}
      {imageCount > 1 && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-[10px]">
          <p className="text-blue-800 text-center">
            Packing <span className="font-bold">{imageCount}</span> images...
          </p>
          <p className="text-gray-500 text-center mt-0.5">
            Download Before Exit
          </p>
        </div>
      )}
    </div>
  );
}
