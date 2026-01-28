'use client';

import { Undo2, Redo2, Download, Crown, Plus, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Language } from '@/lib/i18n';

interface EditorHeaderProps {
  userStatus?: 'guest' | 'free' | 'pro';
  onCreateNew?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDownload?: () => void;
  onUpgrade?: () => void;
  className?: string;
}

export function EditorHeader({
  userStatus = 'free',
  onCreateNew,
  onUndo,
  onRedo,
  onDownload,
  onUpgrade,
  className = '',
}: EditorHeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between ${className}`}>
      {/* 左侧：Logo 和 Create new */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.svg" 
            alt="PhotoGrid Logo" 
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-gray-900">PhotoGrid</span>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createNew}</span>
        </button>
      </div>

      {/* 中间：Undo/Redo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={t.undo}
        >
          <Undo2 className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onRedo}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={t.redo}
        >
          <Redo2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* 右侧：Language, Download 和 Pro */}
      <div className="flex items-center gap-3">
        {/* 语言切换按钮 */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          title={t.language}
        >
          <Languages className="w-4 h-4" />
          <span>{language === 'zh' ? '中文' : 'EN'}</span>
        </button>
        
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{t.download}</span>
        </button>
        {userStatus !== 'pro' && (
          <button
            onClick={onUpgrade}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span>{t.pro}</span>
          </button>
        )}
      </div>
    </div>
  );
}
