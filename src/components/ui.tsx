// Small shared UI helpers used across feature pages.
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const map = {
    low: { text: 'Low risk', cls: 'bg-success-100 text-success-700 border-success-200' },
    medium: { text: 'Medium risk', cls: 'bg-warning-100 text-warning-700 border-warning-200' },
    high: { text: 'High risk', cls: 'bg-danger-100 text-danger-700 border-danger-200' },
  } as const;
  const m = map[level];
  return (
    <span className={`chip border ${m.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.text}
    </span>
  );
}

export function ProgressBar({ value, color = 'primary' }: { value: number; color?: 'primary' | 'success' | 'warning' | 'danger' }) {
  const colorMap = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100">
      <div
        className={`h-full rounded-full ${colorMap[color]} transition-all duration-500`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 px-6 py-10 text-center">
      <div className="mb-3 text-primary-300">{icon}</div>
      <p className="font-semibold text-ink-700">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink-700/60">{hint}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        <p className="mt-0.5 text-sm text-ink-700/70">{subtitle}</p>
      </div>
    </div>
  );
}

export function EstimateNote({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs text-ink-700/50 ${className}`}>
      This is an automated estimate, not a definitive verdict. When in doubt, trust your instincts and verify independently.
    </p>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} className="btn-secondary text-sm">
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}
