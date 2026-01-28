'use client';

import { Crown, User } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  userStatus: 'guest' | 'free' | 'pro';
  onUpgradeClick?: () => void;
}

export function Navbar({ userStatus, onUpgradeClick }: NavbarProps) {
  const [showPromoBanner, setShowPromoBanner] = useState(true);

  return (
    <>
      {/* 促销横幅 */}
      {showPromoBanner && userStatus !== 'pro' && (
        <div className="relative bg-purple-600 text-white py-2 px-4 text-center text-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>
              Only HKD22.42/mo for PRO - Limited time!
            </span>
            <span className="font-mono bg-purple-700 px-2 py-0.5 rounded">
              06:33:09
            </span>
            <button
              onClick={onUpgradeClick}
              className="ml-2 bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded text-xs font-semibold transition-colors"
            >
              Upgrade
            </button>
            <button
              onClick={() => setShowPromoBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 主导航栏 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/logo.svg" 
              alt="PhotoGrid Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">PhotoGrid</span>
          </div>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="#" className="hover:text-gray-900 relative">
              Create
              <span className="absolute -top-1 -right-6 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                Hot
              </span>
            </a>
            <a href="#" className="hover:text-gray-900">Templates</a>
            <a href="#" className="hover:text-gray-900">AI Image</a>
            <a href="#" className="hover:text-gray-900">AI Video</a>
            <a href="#" className="hover:text-gray-900">Pricing</a>
            <a href="#" className="hover:text-gray-900">Get App</a>
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center gap-3">
            {userStatus !== 'pro' && (
              <button
                onClick={onUpgradeClick}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span>44% Off Upgrade</span>
              </button>
            )}
            <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 面包屑 */}
        <div className="max-w-7xl mx-auto px-6 py-2 text-sm text-gray-500">
          Home / Background Remover
        </div>
      </nav>
    </>
  );
}
