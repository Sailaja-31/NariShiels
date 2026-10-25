// Top navigation bar + mobile drawer + persistent Quick Exit button.
import { useEffect, useState } from 'react';
import { Menu, X, LogOut, Shield } from 'lucide-react';
import { FEATURES, GROUP_LABELS } from '@/lib/features';
import { navigate, useRoute, type Route } from '@/lib/router';

export default function NavBar({ onQuickExit }: { onQuickExit: () => void }) {
  const route = useRoute();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const go = (r: Route) => {
    navigate(r);
    setOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-primary-100/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <button onClick={() => go('home')} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-soft">
              <Shield size={18} />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink-900">
              Nari<span className="text-primary-600">Shield</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {(['detect', 'decide', 'protect'] as const).map((g) => (
              <div key={g} className="group relative">
                <button className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-primary-50 hover:text-primary-700">
                  {GROUP_LABELS[g]}
                </button>
                <div className="invisible absolute left-0 top-full z-50 w-64 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <div className="card overflow-hidden p-1.5">
                    {FEATURES.filter((f) => f.group === g).map((f) => (
                      <button
                        key={f.route}
                        onClick={() => go(f.route)}
                        className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-primary-50"
                      >
                        <f.icon size={16} className="mt-0.5 text-primary-500" />
                        <span>
                          <span className="block text-sm font-semibold text-ink-900">{f.title}</span>
                          <span className="block text-xs text-ink-700/60">{f.short}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={onQuickExit} className="btn-ghost hidden sm:inline-flex text-sm">
              <LogOut size={15} /> Quick Exit
            </button>
            <button onClick={() => setOpen((o) => !o)} className="btn-ghost md:hidden" aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-lavender-50 p-4 shadow-2xl animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-ink-900">Menu</span>
              <button onClick={() => setOpen(false)} className="btn-ghost p-2"><X size={18} /></button>
            </div>
            {(['detect', 'decide', 'protect'] as const).map((g) => (
              <div key={g} className="mb-4">
                <p className="mb-1.5 px-2 text-xs font-bold uppercase tracking-wider text-primary-400">{GROUP_LABELS[g]}</p>
                <div className="space-y-0.5">
                  {FEATURES.filter((f) => f.group === g).map((f) => (
                    <button
                      key={f.route}
                      onClick={() => go(f.route)}
                      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left ${route === f.route ? 'bg-primary-100 text-primary-700' : 'hover:bg-primary-50'}`}
                    >
                      <f.icon size={18} className="shrink-0 text-primary-500" />
                      <span className="text-sm font-semibold text-ink-900">{f.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={onQuickExit} className="btn-danger mt-4 w-full">
              <LogOut size={16} /> Quick Exit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
