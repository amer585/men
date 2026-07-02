import { API_BASE_URL } from '../config';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-slate-500 md:flex-row md:px-6 md:text-right">
        <p>© {new Date().getFullYear()} منصة مدرستنا — جميع الحقوق محفوظة</p>
        <p className="font-mono text-[11px] text-slate-600">
          API: {API_BASE_URL.replace(/^https?:\/\//, '')}
        </p>
      </div>
    </footer>
  );
}
