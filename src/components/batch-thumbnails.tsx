'use client';

import { Plus, Download } from 'lucide-react';
import { BatchTask, ProcessedImage } from '@/types/background-remover';

interface BatchThumbnailsProps {
  task: BatchTask | null;
  selectedImageId?: string;
  onImageSelect?: (image: ProcessedImage) => void;
  onAddMore?: () => void;
  onDownloadAll?: () => void;
}

export function BatchThumbnails({
  task,
  selectedImageId,
  onImageSelect,
  onAddMore,
  onDownloadAll,
}: BatchThumbnailsProps) {
  if (!task || task.images.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Thumbnails */}
        <div className="flex items-center gap-3 flex-1 overflow-x-auto scrollbar-hide pr-2">
          {/* Add More Button */}
          <button
            onClick={onAddMore}
            className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-400 hover:bg-teal-50 flex items-center justify-center transition-all z-10"
          >
            <Plus className="w-6 h-6 text-gray-400" />
          </button>

          {task.images.map((image) => (
            <button
              key={image.id}
              onClick={() => onImageSelect?.(image)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all relative z-10 ${
                selectedImageId === image.id
                  ? 'border-teal-400 scale-105 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {image.processedUrl ? (
                <img
                  src={image.processedUrl}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={image.originalUrl}
                  alt={image.originalName}
                  className="w-full h-full object-cover opacity-50"
                />
              )}
            </button>
          ))}
        </div>

        {/* Download All Button */}
        {task.images.some((img) => img.status === 'success') && (
          <button
            onClick={onDownloadAll}
            className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </button>
        )}
      </div>
    </div>
  );
}
