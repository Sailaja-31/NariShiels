// Scam Message Scanner — paste a message, get risk score, signs, advice.
import { useMemo, useState } from 'react';
import { ScanSearch, AlertTriangle, Lightbulb, Sparkles, Trash2, ShieldCheck } from 'lucide-react';
import { scanMessage, type ScanResult } from '@/lib/analysis';
import { PageHeader, RiskBadge, ProgressBar, EstimateNote } from '@/components/ui';
import { save, load } from '@/lib/storage';
import { navigate } from '@/lib/router';

const SAMPLES = [
  'Dear Customer, your SBI account is on hold. Verify your KYC within 2 hours or account will be blocked permanently. Click: http://sbi-kyc-verify.tk/now',
  'Congratulations! You are our lucky winner of ₹2,00,000 in the Amazon Grand Prize. Pay ₹499 processing fee to claim. WhatsApp 98765xxxxx now!',
  'Hi Priya, it\'s me, I lost my phone so this is my new number. Can you send ₹2000 urgently? Will return tomorrow morning.',
  'I have your private photos. Send ₹50,000 to this UPI or I will send them to your family and followers. Don\'t ignore.',
  'Hey! Just wanted to check if you\'re still coming to dinner on Friday? Let me know :)',
];

export default function Scanner() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = () => {
    const r = scanMessage(text);
    setResult(r);
    if (text.trim()) {
      const history = load<{ text: string; score: number; level: string; at: number }[]>('scan-history', []);
      history.unshift({ text: text.slice(0, 120), score: r.score, level: r.level, at: Date.now() });
      save('scan-history', history.slice(0, 20));
    }
  };

  const scoreColor = useMemo<'primary' | 'success' | 'warning' | 'danger'>(() => {
    if (!result) return 'primary';
    if (result.level === 'high') return 'danger';
    if (result.level === 'medium') return 'warning';
    return 'success';
  }, [result]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Scam Message Scanner"
        subtitle="Paste a suspicious SMS, WhatsApp, or email message to check it for scam signs."
        icon={<ScanSearch size={20} />}
      />

      <div className="card p-5">
        <label className="label" htmlFor="msg">Message to check</label>
        <textarea
          id="msg"
          className="input min-h-[120px] resize-y font-sans"
          placeholder="Paste the full message here, including any links or phone numbers…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={handleScan} disabled={!text.trim()} className="btn-primary">
            <ScanSearch size={16} /> Scan message
          </button>
          <button onClick={() => { setText(''); setResult(null); }} className="btn-ghost">
            <Trash2 size={15} /> Clear
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-primary-50/60 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary-700">
            <Sparkles size={13} /> Try a sample message
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                onClick={() => { setText(s); setResult(null); }}
                className="rounded-lg border border-primary-200 bg-white px-2.5 py-1.5 text-left text-xs text-ink-700/80 hover:border-primary-400 hover:bg-primary-50"
              >
                {s.length > 50 ? s.slice(0, 50) + '…' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-5 space-y-4 animate-slide-up">
          {/* Score */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-700/60">Risk score</p>
                <p className="font-display text-4xl font-bold text-ink-900">{result.score}<span className="text-lg text-ink-700/40">/100</span></p>
              </div>
              <RiskBadge level={result.level} />
            </div>
            <div className="mt-3">
              <ProgressBar value={result.score} color={scoreColor} />
            </div>
            <EstimateNote className="mt-3" />
          </div>

          {/* Warning signs */}
          {result.signs.length > 0 ? (
            <div className="card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900">
                <AlertTriangle size={18} className="text-warning-600" /> Warning signs found
              </h3>
              <ul className="space-y-2.5">
                {result.signs.map((s) => (
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
                <p className="font-semibold">No strong scam signals were detected.</p>
              </div>
              <p className="mt-2 text-sm text-ink-700/70">This is only an estimate. Even a clean scan doesn't guarantee a message is safe — stay alert to anything that feels off.</p>
            </div>
          )}

          {/* Advice */}
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900">
              <Lightbulb size={18} className="text-primary-600" /> What to do
            </h3>
            <ul className="space-y-2">
              {result.advice.map((a, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-700/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {result.level !== 'low' && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => navigate('guard')} className="btn-secondary">Add to blocklist</button>
              <button onClick={() => navigate('reply')} className="btn-secondary">Generate a safe reply</button>
              <button onClick={() => navigate('assistant')} className="btn-secondary">Get support</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
