'use client';

interface DragOverlayProps {
  isVisible: boolean;
}

export function DragOverlay({ isVisible }: DragOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 text-center shadow-2xl">
        <div className="w-24 h-24 mx-auto mb-6 border-4 border-dashed border-blue-500 rounded-2xl flex items-center justify-center">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-2">
          Release to Start Processing
        </p>
        <p className="text-gray-600">Release your mouse to upload images</p>
      </div>
    </div>
  );
}
