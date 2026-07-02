import { API_BASE_URL } from '../config';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950/40">
      <div className="flex w-full flex-col items-center justify-between gap-3 px-5 py-6 text-center text-xs text-slate-500 md:flex-row md:px-10 md:text-right">
        <p>© {new Date().getFullYear()} إدارتنا الشاملة — جميع الحقوق محفوظة</p>
        <p className="font-mono text-[11px] text-slate-600">
          API: {API_BASE_URL.replace(/^https?:\/\//, '')}
        </p>
      </div>
    </footer>
  );
}
