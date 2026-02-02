// 强制该路由动态渲染，避免 useSearchParams 在预渲染时报错
export const dynamic = 'force-dynamic';

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
