'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { ProcessingCanvas } from '@/components/processing-canvas';
import { BackgroundEditor } from '@/components/background-editor';
import { DownloadButtons } from '@/components/download-buttons';
import { BatchThumbnails } from '@/components/batch-thumbnails';
import { StickyUploadBar } from '@/components/sticky-upload-bar';
import { UpgradeModal } from '@/components/upgrade-modal';
import {
  UserStatus,
  UserQuota,
  ProcessedImage,
  BatchTask,
  BackgroundOption,
  ImageQuality,
} from '@/types/background-remover';

export default function BackgroundRemoverPage() {
  // 用户状态
  const [userStatus, setUserStatus] = useState<UserStatus>('free');
  const [quota, setQuota] = useState<UserQuota>({
    dailyLimit: 3,
    usedToday: 1,
    remaining: 2,
  });

  // 图片处理状态
  const [currentImage, setCurrentImage] = useState<ProcessedImage | null>(null);
  const [batchTask, setBatchTask] = useState<BatchTask | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // UI 状态
  const [currentBackground, setCurrentBackground] = useState<BackgroundOption>({
    type: 'transparent',
  });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // 处理上传
  const handleUpload = async (files: File[]) => {
    // 检查批量限制 - 直接弹出付费弹窗
    if (userStatus !== 'pro' && files.length > 3) {
      setShowUpgradeModal(true);
      // 只处理前3张
      files = files.slice(0, 3);
    }

    if (files.length === 0) return;

    const images: ProcessedImage[] = files.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      originalUrl: URL.createObjectURL(file),
      originalName: file.name,
      status: 'processing',
      width: 0,
      height: 0,
    }));

    // 模拟处理过程
    images.forEach((img, index) => {
      setTimeout(() => {
        setCurrentImage((prev) => {
          if (index === 0 || !prev) {
            return {
              ...img,
              status: 'success',
              processedUrl: img.originalUrl, // 模拟处理后的图片
            };
          }
          return prev;
        });

        if (images.length > 1) {
          setBatchTask((prev) => {
            const updatedImages = (prev?.images || []).map((i) =>
              i.id === img.id
                ? { ...i, status: 'success' as const, processedUrl: i.originalUrl }
                : i
            );
            return {
              id: prev?.id || 'batch-1',
              images: updatedImages.length > 0 ? updatedImages : images,
              totalCount: images.length,
              completedCount: updatedImages.filter((i) => i.status === 'success').length,
              failedCount: updatedImages.filter((i) => i.status === 'failed').length,
            };
          });
        }
      }, (index + 1) * 2000);
    });

    if (images.length === 1) {
      setCurrentImage(images[0]);
    } else {
      setBatchTask({
        id: 'batch-1',
        images,
        totalCount: images.length,
        completedCount: 0,
        failedCount: 0,
      });
      setCurrentImage(images[0]);
      setSelectedImageId(images[0].id);
    }
  };

  const handleBatchUpload = (files: File[]) => {
    // 批量上传逻辑与单张类似，但会创建批量任务
    handleUpload(files);
  };

  // 处理下载
  const handleDownload = (quality: ImageQuality) => {
    console.log('Download with quality:', quality);
    // 更新配额
    if (quality === 'standard' && userStatus !== 'pro') {
      setQuota((prev) => ({
        ...prev,
        usedToday: prev.usedToday + 1,
        remaining: prev.remaining - 1,
      }));
    }
    // Actual download logic
    alert(`Downloading ${quality === 'hd' ? 'HD' : 'Standard'} quality image`);
  };

  // 下载所有图片
  const handleDownloadAll = () => {
    if (!batchTask) return;
    
    const successImages = batchTask.images.filter((img) => img.status === 'success');
    if (successImages.length === 0) {
      alert('No completed images to download');
      return;
    }

    console.log(`Downloading all ${successImages.length} images`);
    // Actual download all logic
    alert(`Downloading all ${successImages.length} images`);
  };

  // Handle upgrade
  const handleUpgrade = () => {
    alert('Redirecting to payment page');
    // Actual payment logic
  };

  // 选择图片
  const handleImageSelect = (image: ProcessedImage) => {
    setCurrentImage(image);
    setSelectedImageId(image.id);
  };

  // 处理上传（从悬浮条或中心区域触发）
  const handleStickyUpload = () => {
    // 创建隐藏的文件输入
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleUpload(files);
        // 滚动到画布区域
        setTimeout(() => {
          const canvasElement = document.querySelector('[data-canvas-area]');
          if (canvasElement) {
            canvasElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };
    input.click();
  };

  // 监听滚动显示悬浮条
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar userStatus={userStatus} onUpgradeClick={handleUpgrade} />

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
        {/* 页面标题 - 仅在未进入编辑页面时显示 */}
        {!currentImage && (
          <div className="text-center mb-8">
            <div className="flex gap-2 justify-center mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                + 100% FREE
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                + No Watermark
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                + Batch Edit
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Free AI{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Background Remover
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Remove backgrounds from photos quickly and accurately with PhotoGrid's
              AI-powered background remover. Use our one-click transparent background
              maker as easily as one-two-three. Perfect for any occasion, whether for
              personal portraits or to renew a commercial product display.
            </p>
          </div>
        )}

        {/* 主内容区域：左侧示例 + 右侧上传 */}
        {!currentImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* 左侧：前后对比示例 */}
            <div className="flex items-center justify-center">
              <div className="relative flex items-center gap-4">
                {/* 原图 */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <div className="w-64 h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-32 h-40 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                      <p className="text-xs text-gray-600">Larmés Bleues</p>
                      <p className="text-xs text-gray-500">Original</p>
                    </div>
                  </div>
                </div>

                {/* 对比图标 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                </div>

                {/* 处理后 */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <div className="w-64 h-80 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center relative">
                    <div className="text-center p-4">
                      <div className="w-32 h-40 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                      <p className="text-xs text-white">Larmés Bleues</p>
                      <p className="text-xs text-blue-200">AI Processed</p>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                      AI
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：上传区域 */}
            <div>
              <div
                className={`bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-colors ${
                  isDragging ? 'border-blue-400 bg-blue-50' : ''
                }`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = Array.from(e.dataTransfer.files).filter((file) =>
                    file.type.startsWith('image/')
                  );
                  if (files.length > 0) {
                    handleUpload(files);
                    setTimeout(() => {
                      const canvasElement = document.querySelector('[data-canvas-area]');
                      if (canvasElement) {
                        canvasElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
              >
                {/* 上传图标 */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Click Upload, Drop image, Paste image
                  </p>

                  {/* 特性标签 */}
                  <div className="flex gap-2 justify-center mb-6">
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

                  {/* 上传按钮 */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleStickyUpload}
                      className="flex-1 border-2 border-blue-400 text-blue-600 bg-white hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
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
                      Upload Image
                    </button>
                    <button
                      onClick={handleStickyUpload}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors relative"
                    >
                      Batch Upload
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Hot
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 示例图片 - 移到容器下方 */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 text-center mb-2">
                  No Picture? Try With One Of These
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { name: 'person-beanie', bg: 'bg-gradient-to-br from-gray-200 to-gray-300' },
                    { name: 'ring', bg: 'bg-gradient-to-br from-red-200 to-red-300' },
                    { name: 'person-curly', bg: 'bg-gradient-to-br from-yellow-200 to-yellow-300' },
                    { name: 'sunglasses', bg: 'bg-gradient-to-br from-blue-200 to-blue-300' },
                  ].map((sample, index) => (
                    <div
                      key={index}
                      className={`aspect-square ${sample.bg} rounded cursor-pointer hover:opacity-80 transition-opacity border border-transparent hover:border-blue-300`}
                      style={{ height: '60px' }}
                      onClick={handleStickyUpload}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 主内容布局：中间画布 + 右侧操作区 */}
        {currentImage && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12" data-canvas-area>
            {/* 中间：处理画布 */}
            <div className="lg:col-span-2">
              <div className="bg-gray-100 rounded-2xl shadow-lg p-6 h-[600px]">
                <ProcessingCanvas
                  image={currentImage}
                  userStatus={userStatus}
                />
              </div>
            </div>

            {/* 右侧：操作区域 */}
            <div className="lg:col-span-1 h-[600px] flex flex-col gap-4 overflow-y-auto bg-white rounded-lg p-5">
              {/* 背景编辑器 */}
              <div className="flex-shrink-0">
                <BackgroundEditor
                  currentBackground={currentBackground}
                  onBackgroundChange={setCurrentBackground}
                />
              </div>

              {/* 下载按钮 - 固定在底部 */}
              {currentImage.status === 'success' && (
                <div className="flex-shrink-0 mt-auto pt-4 border-t border-gray-200">
                  <DownloadButtons
                    userStatus={userStatus}
                    quota={quota}
                    imageCount={batchTask?.totalCount || 1}
                    onDownload={handleDownload}
                    onUpgrade={handleUpgrade}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 悬浮上传条 */}
      {showStickyBar && (
        <StickyUploadBar onUpload={handleStickyUpload} />
      )}

      {/* 付费升级弹窗 */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onContinue={handleUpgrade}
      />

      {/* 底部批量任务缩略图栏 */}
      {batchTask && currentImage && (
        <BatchThumbnails
          task={batchTask}
          selectedImageId={selectedImageId || undefined}
          onImageSelect={handleImageSelect}
          onAddMore={handleStickyUpload}
          onDownloadAll={handleDownloadAll}
        />
      )}

      {/* 右侧浮动按钮 */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        <button className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
        </button>
        <button className="w-12 h-12 bg-white hover:bg-gray-50 text-gray-600 rounded-full shadow-lg flex items-center justify-center transition-colors border border-gray-200">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
        <button className="w-12 h-12 bg-white hover:bg-gray-50 text-gray-600 rounded-full shadow-lg flex items-center justify-center transition-colors border border-gray-200">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
