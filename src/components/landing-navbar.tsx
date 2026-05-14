import Image from 'next/image';

interface LandingNavbarProps {
  onLoginClick: () => void;
}

const navItems = [
  '创作',
  '模板',
  'AI图像',
  'AI视频',
  '定价',
  '获取应用',
];

export function LandingNavbar({
  onLoginClick,
}: LandingNavbarProps) {
  return (
    <>
      <div className="relative bg-[linear-gradient(90deg,#6f2dbd_0%,#a03ab0_36%,#d9485a_100%)] px-4 py-2 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 text-xs font-medium sm:text-sm">
          <span className="hidden rounded-full bg-white/14 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-white/90 sm:inline-flex">
            PRO
          </span>
          <span>限时特惠，PRO年度会员 44% OFF</span>
          <span className="rounded-full bg-white/16 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em]">
            17:15:30
          </span>
        </div>
      </div>

      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="PhotoGrid" width={28} height={28} />
            <span className="text-[24px] font-semibold tracking-tight text-slate-900">
              PhotoGrid
            </span>
          </div>

          <div className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
            {navItems.map((item) => (
              <a key={item} href="#" className="transition hover:text-slate-950">
                {item}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            登录
          </button>
        </div>
      </nav>
    </>
  );
}
