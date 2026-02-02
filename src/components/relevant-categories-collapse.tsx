'use client';

import Link from 'next/link';
import { Youtube, TreePine, Circle, Drumstick } from 'lucide-react';
import type { TemplateDetail } from '@/data/template-detail';

export function RelevantCategoriesCollapse({ template }: { template: TemplateDetail }) {
  const { relevantCategories } = template;

  return (
    <div className="flex flex-col">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Relevant Categories</h2>
      <div className="flex flex-wrap gap-2">
        {relevantCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/templates/${cat.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-700 text-sm transition-colors"
          >
            {cat.id === 'youtube' && <Youtube className="w-4 h-4 text-red-500" />}
            {cat.id === 'christmas' && <TreePine className="w-4 h-4 text-green-600" />}
            {cat.id === 'halloween' && <Circle className="w-4 h-4 text-orange-500 fill-orange-500" />}
            {cat.id === 'thanksgiving' && <Drumstick className="w-4 h-4 text-amber-600" />}
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
