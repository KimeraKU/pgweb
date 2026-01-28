'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';

function EditContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageId = searchParams.get('imageId');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageId) {
      setImageUrl('/placeholder-image.jpg');
    }
  }, [imageId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Background Remover</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Image</h1>
          {imageId ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Image ID: {imageId}</p>
              <p className="text-gray-500">Image editing functionality coming soon...</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No image selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <EditContent />
    </Suspense>
  );
}
