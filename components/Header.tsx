interface HeaderProps {
  view: string;
  onHome: () => void;
  onLogout?: () => void;
  identity?: string;
}

export function Header({ view, onHome, onLogout, identity }: HeaderProps) {
  const loggedIn = view === 'student' || view === 'staff';
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <button onClick={onHome} className="flex items-center gap-3 transition hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-sky-500 text-xl shadow-lg shadow-brand-500/30">
            📚
          </div>
          <div className="text-right leading-tight">
            <p className="text-base font-extrabold text-white">مدرستنا</p>
            <p className="text-[11px] text-brand-300/80">بوابة الانطلاقة</p>
          </div>
        </button>

        <div className="ms-auto flex items-center gap-3">
          {loggedIn && identity && (
            <span className="hidden rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:inline">
              👋 {identity}
            </span>
          )}
          {loggedIn ? (
            <button
              onClick={onLogout}
              className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              تسجيل الخروج
            </button>
          ) : (
            <a
              href="#enter"
              onClick={(e) => {
                e.preventDefault();
                onHome();
              }}
              className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 ring-1 ring-inset ring-white/10 transition hover:bg-white/10"
            >
              الرئيسية
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
