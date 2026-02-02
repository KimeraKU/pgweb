import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Aggregation Editor
        </h1>
        <p className="text-slate-600 text-lg mb-8">
          Welcome to Aggregation Editor
        </p>
        
        <div className="space-y-4">
          <Link
            href="/background-remover"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg"
          >
            🎨 Background Remover
          </Link>
          <Link
            href="/editor"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg ml-4"
          >
            ✏️ Aggregation Editor
          </Link>
          <Link
            href="/templates/youtube-1"
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg ml-4"
          >
            📄 模板详情
          </Link>
        </div>
      </div>
    </main>
  );
}
