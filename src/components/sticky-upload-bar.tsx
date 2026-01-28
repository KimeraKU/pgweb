'use client';

import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface StickyUploadBarProps {
  onUpload: () => void;
}

export function StickyUploadBar({ onUpload }: StickyUploadBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Upload className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">
            Ready to process images anytime
          </span>
        </div>
        <button
          onClick={onUpload}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
      </div>
    </div>
  );
}
