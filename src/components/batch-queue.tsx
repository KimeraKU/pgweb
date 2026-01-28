'use client';

import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { BatchTask, ProcessedImage } from '@/types/background-remover';

interface BatchQueueProps {
  task: BatchTask | null;
  onImageSelect?: (image: ProcessedImage) => void;
  selectedImageId?: string;
}

export function BatchQueue({ task, onImageSelect, selectedImageId }: BatchQueueProps) {
  if (!task || task.images.length === 0) {
    return null;
  }

  const getStatusIcon = (status: ProcessedImage['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: ProcessedImage['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'success':
        return 'Completed';
      case 'failed':
        return 'Failed';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-900">Batch Tasks</h3>
        <div className="text-[10px] text-gray-500">
          {task.completedCount}/{task.totalCount} completed
        </div>
      </div>

      <div className="space-y-1.5 max-h-32 overflow-y-auto">
        {task.images.map((image) => (
          <button
            key={image.id}
            onClick={() => onImageSelect?.(image)}
            className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-all ${
              selectedImageId === image.id
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {/* 缩略图 */}
            <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
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
            </div>

            {/* 信息 */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-[10px] font-medium text-gray-900 truncate">
                {image.originalName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {getStatusIcon(image.status)}
                <span className="text-[9px] text-gray-500">
                  {getStatusText(image.status)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 进度条 */}
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{
              width: `${(task.completedCount / task.totalCount) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
