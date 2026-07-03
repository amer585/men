import { Logo } from './Logo';

interface HeaderProps {
  view: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onHome: () => void;
  onLogout?: () => void;
  identity?: string;
}

export function Header({ view, theme, onToggleTheme, onHome, onLogout, identity }: HeaderProps) {
  const loggedIn = view === 'student' || view === 'teacher';
  return (
    <header className="sticky top-0 z-30 border-b border-gold-500/10 bg-ink-950/80 backdrop-blur-xl">
      {/* Thin gold hairline at the very top */}
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="flex w-full items-center justify-between gap-4 px-5 py-3 md:px-10">
        {/* Right corner — logo + brand */}
        <button onClick={onHome} className="flex items-center gap-3 transition hover:opacity-90">
          <Logo size={38} glow />
          <div className="text-right leading-tight">
            <p className="text-[15px] font-extrabold tracking-tight text-white">إدارتنا الشاملة</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold-500/70">Student Portal</p>
          </div>
        </button>

        {/* Left corner — theme toggle + identity + home/logout */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/15 bg-white/[0.03] text-lg transition hover:bg-white/[0.06]"
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {loggedIn && identity && (
            <span className="hidden rounded-full border border-gold-500/15 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 sm:inline">
              {identity}
            </span>
          )}
          {loggedIn ? (
            <button
              onClick={onLogout}
              className="rounded-xl border border-rose-400/15 bg-rose-500/5 px-4 py-2 text-sm font-semibold text-rose-300/90 transition hover:bg-rose-500/15"
            >
              خروج
            </button>
          ) : (
            <button
              onClick={onHome}
              className="rounded-xl border border-gold-500/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
            >
              الرئيسية
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
