'use client';

import { Download } from 'lucide-react';
import { UserStatus, UserQuota, ImageQuality } from '@/types/background-remover';

interface DownloadAllButtonProps {
  userStatus: UserStatus;
  quota: UserQuota;
  imageCount: number;
  onDownload: (quality: ImageQuality) => void;
  onUpgrade?: () => void;
}

export function DownloadAllButton({
  userStatus,
  quota,
  imageCount,
  onDownload,
  onUpgrade,
}: DownloadAllButtonProps) {
  const canDownloadFree = quota.remaining > 0;

  const handleDownload = () => {
    if (userStatus === 'pro') {
      onDownload('hd');
    } else if (canDownloadFree) {
      onDownload('standard');
    } else {
      alert('Daily free quota exhausted. Please upgrade to Pro or try again tomorrow.');
      onUpgrade?.();
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleDownload}
        disabled={!canDownloadFree && userStatus !== 'pro'}
        className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
          userStatus === 'pro' || canDownloadFree
            ? 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          <span>Download All</span>
        </div>
      </button>
      <p className="text-xs text-gray-500 text-center mt-2">
        Download Before Exit
      </p>
      {userStatus !== 'pro' && (
        <p className="text-xs text-gray-500 text-center mt-1">
          Remaining free quota today: <span className="font-semibold">{quota.remaining}</span>/{' '}
          {quota.dailyLimit}
        </p>
      )}
    </div>
  );
}
