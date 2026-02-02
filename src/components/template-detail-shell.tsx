'use client';

import { useRouter } from 'next/navigation';
import { LanguageProvider } from '@/contexts/language-context';
import { EditorHeader } from '@/components/editor/editor-header';

export function TemplateDetailShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <EditorHeader
          userStatus="free"
          onCreateNew={() => router.push('/editor')}
          onUndo={() => {}}
          onRedo={() => {}}
          onDownload={() => {}}
          onUpgrade={() => {}}
        />
        {children}
      </div>
    </LanguageProvider>
  );
}
