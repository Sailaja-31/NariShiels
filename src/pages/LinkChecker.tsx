// Suspicious Link Checker — checks URL patterns for warning signs.
import { useState } from 'react';
import { Link2, AlertTriangle, Lightbulb, Trash2, ShieldCheck } from 'lucide-react';
import { checkLink, type LinkSign } from '@/lib/analysis';
import { PageHeader, EmptyState, EstimateNote } from '@/components/ui';

const SAMPLES = [
  'http://sbi-kyc-verify.tk/urgent',
  'https://amaz0n-india.com/claim-prize?id=4993',
  'https://bit.ly/3xY7kPp',
  'https://www.hdfcbank.com/login',
];

export default function LinkChecker() {
  const [input, setInput] = useState('');
  const [signs, setSigns] = useState<LinkSign[] | null>(null);
  const [advice, setAdvice] = useState<string[]>([]);
  const [url, setUrl] = useState<string | null>(null);

  const run = () => { const r = checkLink(input); setSigns(r.signs); setAdvice(r.advice); setUrl(r.url); };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Suspicious Link Checker"
        subtitle="Check a web address for warning signs. We never claim a link is definitely safe — only flag patterns to watch."
        icon={<Link2 size={20} />}
      />

      <div className="card p-5">
        <label className="label" htmlFor="link">Link to check</label>
        <input
          id="link"
          className="input font-mono text-sm"
          placeholder="https://example.com/something"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={run} disabled={!input.trim()} className="btn-primary"><Link2 size={16} /> Check link</button>
          <button onClick={() => { setInput(''); setSigns(null); setAdvice([]); setUrl(null); }} className="btn-ghost"><Trash2 size={15} /> Clear</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SAMPLES.map((s, i) => (
            <button key={i} onClick={() => { setInput(s); setSigns(null); }} className="rounded-lg border border-primary-200 bg-white px-2.5 py-1.5 font-mono text-xs text-ink-700/80 hover:border-primary-400 hover:bg-primary-50">
              {s}
            </button>
          ))}
        </div>
        <p className="mt-3 rounded-xl bg-warning-50 p-3 text-xs text-warning-800">
          We check the link <em>text</em> only — we never visit the link. A clean result does not mean a link is safe.
        </p>
      </div>

      {signs && (
        <div className="mt-5 space-y-4 animate-slide-up">
          {url && (
            <div className="card p-4">
              <p className="text-xs text-ink-700/50">Link checked</p>
              <p className="break-all font-mono text-sm text-ink-900">{url}</p>
            </div>
          )}

          {signs.length > 0 ? (
            <div className="card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><AlertTriangle size={18} className="text-warning-600" /> Warning signs</h3>
              <ul className="space-y-2.5">
                {signs.map((s) => (
                  <li key={s.id} className="flex gap-3 rounded-xl bg-warning-50 p-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-warning-100 text-xs font-bold text-warning-700">!</span>
                    <div>
                      <p className="font-semibold text-ink-900">{s.label}</p>
                      <p className="text-sm text-ink-700/70">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="card p-5">
              <div className="flex items-center gap-3 text-success-700">
                <ShieldCheck size={22} />
                <p className="font-semibold">No obvious patterns flagged.</p>
              </div>
              <p className="mt-2 text-sm text-ink-700/70">This does <strong>not</strong> mean the link is safe. It only means our text-based check didn't find warning signs.</p>
            </div>
          )}

          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><Lightbulb size={18} className="text-primary-600" /> Guidance</h3>
            <ul className="space-y-2">
              {advice.map((a, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-700/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />{a}
                </li>
              ))}
            </ul>
          </div>
          <EstimateNote />
        </div>
      )}
    </div>
  );
}
