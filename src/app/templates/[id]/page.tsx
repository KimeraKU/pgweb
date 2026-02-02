import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PenSquare, ChevronRight, Instagram, Youtube } from 'lucide-react';
import { getTemplateById, getMoreLikeThis } from '@/data/template-detail';
import { TemplateDetailShell } from '@/components/template-detail-shell';
import { RelevantCategoriesCollapse } from '@/components/relevant-categories-collapse';
import { TemplateDescription } from '@/components/template-description';

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) notFound();
  const hasPreviewImage = template.previewImage && (template.previewImage.startsWith('http') || template.previewImage.startsWith('/'));

  const moreLikeThis = getMoreLikeThis(id);

  return (
    <TemplateDetailShell>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 bg-white">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/templates/youtube-1" className="hover:text-teal-600">Templates</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{template.category}</span>
        </nav>

        {/* Main: 中间灰色画布 + 右侧白色信息栏 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16 lg:items-start">
          {/* Left: 灰色画布区域，画板（白框）在其上 */}
          <div className="lg:col-span-2 w-full bg-gray-200 rounded-2xl p-6 min-h-[320px] flex items-center justify-center">
            <div className="aspect-square max-w-2xl w-full rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
              {hasPreviewImage ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${template.previewImage})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 via-white to-teal-50 flex items-center justify-center text-gray-400 text-lg">
                  <span className="text-center px-4">Template Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Info 固定高度 = 左侧画布（aspect-[1/2] 使高=2×列宽，与左侧正方形同高；max-h 与 max-w-2xl 对齐） */}
          <div className="lg:col-span-1 w-full lg:aspect-[1/2] lg:max-h-[42rem] min-h-0 rounded-xl bg-white overflow-hidden">
            <div className="h-full overflow-y-auto pt-0 px-6 pb-6 space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 mt-0 pt-0">{template.name}</h1>
              <TemplateDescription text={template.description} />

              <Link
                href={`/editor?template=${template.id}`}
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md"
              >
                <PenSquare className="w-5 h-5" />
                Edit now
              </Link>

              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Template Details</h2>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Size: {template.size}</li>
                  <li>Images: {template.imageCount}</li>
                </ul>
              </div>

              {/* Relevant Categories：折叠时固定高度 + 底部渐变遮罩，展开后可滚动 */}
              <RelevantCategoriesCollapse template={template} />
            </div>
          </div>
        </section>

        {/* More like this */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">More like this</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {moreLikeThis.map((item) => (
              <Link
                key={item.id}
                href={`/templates/${item.id}`}
                className="group block rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-xs">
                  {item.name}
                </div>
                <p className="p-3 text-sm font-medium text-gray-900 truncate group-hover:text-teal-600">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/templates/youtube-1"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Discover More
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-semibold">
              <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center text-white text-sm font-bold">
                PG
              </div>
              PhotoGrid
            </div>
            <p className="text-sm">Follow us</p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white" aria-label="TikTok">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">© 2025 PhotoGrid. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-3">Download</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white">On the web</Link></li>
                <li><Link href="/" className="hover:text-white">App Store</Link></li>
                <li><Link href="/" className="hover:text-white">Google Play</Link></li>
                <li><Link href="/" className="hover:text-white">Android app</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Free tools</h3>
              <ul className="space-y-2">
                <li><Link href="/background-remover" className="hover:text-white">Background Remover</Link></li>
                <li><Link href="/editor" className="hover:text-white">Photo Editor</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">About & Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white">Blog</Link></li>
                <li><Link href="/" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/" className="hover:text-white">Help center</Link></li>
                <li><Link href="/" className="hover:text-white">Terms</Link></li>
                <li><Link href="/" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </TemplateDetailShell>
  );
}
