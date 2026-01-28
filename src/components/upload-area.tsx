'use client';

import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { useRef, useState, DragEvent, useEffect } from 'react';
import { UserStatus, UserQuota } from '@/types/background-remover';
import { compressImages } from '@/utils/image-compress';
import { DragOverlay } from './drag-overlay';

interface UploadAreaProps {
  userStatus: UserStatus;
  quota: UserQuota;
  onUpload: (files: File[]) => void;
  onBatchUpload: (files: File[]) => void;
  maxBatchSize: number;
  onDragStateChange?: (isDragging: boolean) => void;
}

export function UploadArea({
  userStatus,
  quota,
  onUpload,
  onBatchUpload,
  maxBatchSize,
  onDragStateChange,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  // 通知父组件拖拽状态
  useEffect(() => {
    onDragStateChange?.(isDragging);
  }, [isDragging, onDragStateChange]);

  // 全局拖拽监听
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // 只有当离开整个窗口时才取消拖拽状态
      if (!e.relatedTarget || (e.relatedTarget as Element).closest('body') === null) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        handleFiles(files);
      }
    };

    document.addEventListener('dragenter', handleDragEnter as any);
    document.addEventListener('dragover', handleDragOver as any);
    document.addEventListener('dragleave', handleDragLeave as any);
    document.addEventListener('drop', handleDrop as any);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter as any);
      document.removeEventListener('dragover', handleDragOver as any);
      document.removeEventListener('dragleave', handleDragLeave as any);
      document.removeEventListener('drop', handleDrop as any);
    };
  }, []);

  const handleDragEnterLocal = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeaveLocal = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setErrors({});
    setIsCompressing(true);

    try {
      // 文件校验
      const validFiles: File[] = [];
      const newErrors: Record<string, string> = {};

      for (const file of files) {
        // Check file type
        if (!file.type.startsWith('image/')) {
          newErrors[file.name] = 'Unsupported file format';
          continue;
        }

        // Check file size
        if (file.size > 20 * 1024 * 1024) {
          newErrors[file.name] = 'Image too large, please upload images smaller than 20MB';
          continue;
        }

        try {
          // 压缩超大图片
          const compressed = await compressImages([file], {
            maxWidth: 4096,
            maxHeight: 4096,
            maxSizeMB: 20,
          });
          validFiles.push(compressed[0]);
        } catch (error) {
          newErrors[file.name] = error instanceof Error ? error.message : 'File processing failed';
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      }

      if (validFiles.length === 0) {
        return;
      }

      // 权益校验
      if (userStatus !== 'pro' && validFiles.length > maxBatchSize) {
        const truncated = validFiles.slice(0, maxBatchSize);
        setSelectedFiles(truncated);
        // Show batch limit notification (will be handled by upgrade modal)
      } else {
        setSelectedFiles(validFiles);
      }
    } catch (error) {
      console.error('File processing error:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      fileInputRef.current?.click();
      return;
    }
    onUpload(selectedFiles);
    setSelectedFiles([]);
  };

  const handleBatchUpload = () => {
    if (selectedFiles.length === 0) {
      batchInputRef.current?.click();
      return;
    }
    onBatchUpload(selectedFiles);
    setSelectedFiles([]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const sampleImages = [
    { name: 'person-beanie.jpg', url: '/samples/person-beanie.jpg' },
    { name: 'ring.jpg', url: '/samples/ring.jpg' },
    { name: 'person-curly.jpg', url: '/samples/person-curly.jpg' },
    { name: 'sunglasses.jpg', url: '/samples/sunglasses.jpg' },
  ];

  return (
    <>
      {/* 全屏拖拽遮罩 */}
      <DragOverlay isVisible={isDragging} />

      <div className="w-full max-w-md">
        {/* 上传卡片 */}
        <div
          className={`bg-white rounded-2xl shadow-lg p-8 border-2 border-dashed transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onDragEnter={handleDragEnterLocal}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeaveLocal}
        >
        {/* 上传提示 */}
        <div className="text-center mb-6">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-sm">
            Click Upload, Drop image, Paste image
          </p>
        </div>

        {/* 特性标签 */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            4K UltraHD
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            Batch Edit
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            No Watermark
          </span>
        </div>

        {/* Remaining Quota Notice */}
        {userStatus !== 'pro' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 text-center">
              Remaining free quota today: <span className="font-bold">{quota.remaining}</span>/{' '}
              {quota.dailyLimit}
            </p>
          </div>
        )}

        {/* Compressing Notice */}
        {isCompressing && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              Processing images...
            </p>
          </div>
        )}

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 space-y-2">
            {Object.entries(errors).map(([fileName, error]) => (
              <div
                key={fileName}
                className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">{fileName}</p>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 已选文件列表 */}
        {selectedFiles.length > 0 && (
          <div className="mb-4 space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
              >
                <ImageIcon className="w-4 h-4 text-gray-400" />
                <span className="flex-1 truncate text-gray-700">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 上传按钮 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpload}
            className="w-full border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Image
          </button>
          <button
            onClick={handleBatchUpload}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Batch Upload
          </button>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={batchInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 示例图片 */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3 text-center">
          No Picture? Try With One Of These
        </p>
        <div className="grid grid-cols-4 gap-2">
          {sampleImages.map((sample, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-300"
              onClick={() => {
                // 模拟点击示例图片
                console.log('Load sample:', sample.name);
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
