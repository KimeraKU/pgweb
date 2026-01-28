'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ZoomIn, ZoomOut, RotateCcw, Edit } from 'lucide-react';
import { ProcessedImage, UserStatus } from '@/types/background-remover';

interface ProcessingCanvasProps {
  image: ProcessedImage | null;
  userStatus: UserStatus;
  onCompareToggle?: (show: boolean) => void;
}

export function ProcessingCanvas({
  image,
  userStatus,
  onCompareToggle,
}: ProcessingCanvasProps) {
  const router = useRouter();
  const [showOriginal, setShowOriginal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (image?.status === 'processing') {
      setIsProcessing(true);
      startScanAnimation();
    } else {
      setIsProcessing(false);
      stopScanAnimation();
    }

    return () => {
      stopScanAnimation();
    };
  }, [image?.status]);

  const startScanAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanPosition = 0;
    const speed = 2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制棋盘格背景（透明区域）
      const gridSize = 20;
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          if ((x / gridSize + y / gridSize) % 2 === 0) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, gridSize, gridSize);
          }
        }
      }

      // 绘制光效扫描
      if (image?.originalUrl) {
        const img = new Image();
        img.src = image.originalUrl;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // 光效渐变
          const gradient = ctx.createLinearGradient(
            scanPosition - 50,
            0,
            scanPosition + 50,
            0
          );
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = gradient;
          ctx.fillRect(scanPosition - 50, 0, 100, canvas.height);
        };
      }

      scanPosition += speed;
      if (scanPosition > canvas.width + 50) {
        scanPosition = -50;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopScanAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
  };

  const handleEdit = () => {
    if (image?.processedUrl) {
      // 跳转到编辑页面，传递图片信息
      router.push(`/background-remover/edit?imageId=${image.id}`);
    }
  };

  if (!image) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="text-center text-gray-400">
          <p className="text-lg mb-2">Upload image to start processing</p>
          <p className="text-sm">Supports JPG, PNG, WebP formats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
      {/* 画布容器 */}
      <div
        className="w-full h-full flex items-center justify-center overflow-auto"
        style={{ transform: `scale(${zoom})` }}
      >
        {image.status === 'processing' ? (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="max-w-full max-h-[600px]"
            />
            {/* 处理中提示 */}
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg">
                <div className="flex gap-2 justify-center mb-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.6s',
                      }}
                    />
                  ))}
                </div>
                <p className="text-gray-800 font-medium mb-2">
                  High Demand! Please wait patiently
                </p>
                {userStatus !== 'pro' && (
                  <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity">
                    <span>🔔</span>
                    Speed Up
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : image.status === 'success' && image.processedUrl ? (
          <img
            src={image.processedUrl}
            alt={image.originalName}
            className="max-w-full max-h-full object-contain"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />
        ) : (
          <div className="text-center text-gray-400 p-8">
            <p>Processing failed, please try again</p>
          </div>
        )}
      </div>

      {/* 工具栏 */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleReset}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5 text-gray-700" />
        </button>
        {/* 编辑按钮 - 仅在处理成功时显示 */}
        {image.status === 'success' && (
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md transition-colors"
            title="Edit Image"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 原图对比按钮 */}
      {image.status === 'success' && (
        <button
          onMouseDown={() => {
            setShowOriginal(true);
            onCompareToggle?.(true);
          }}
          onMouseUp={() => {
            setShowOriginal(false);
            onCompareToggle?.(false);
          }}
          onMouseLeave={() => {
            setShowOriginal(false);
            onCompareToggle?.(false);
          }}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md hover:bg-white transition-colors text-sm font-medium text-gray-700"
        >
          {showOriginal ? 'View Result' : 'View Original'}
        </button>
      )}

      {/* Original Image Overlay */}
      {showOriginal && image.originalUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={image.originalUrl}
            alt="Original"
            className="max-w-full max-h-full object-contain opacity-100"
          />
        </div>
      )}
    </div>
  );
}
