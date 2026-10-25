// Manipulation Detector — checks text for emotional/psychological manipulation patterns.
import { useState } from 'react';
import { Brain, AlertTriangle, Lightbulb, Trash2, Sparkles } from 'lucide-react';
import { detectManipulation, type ManipulationSign } from '@/lib/analysis';
import { PageHeader, EmptyState, EstimateNote } from '@/components/ui';

const SAMPLES = [
  'After everything I\'ve done for you, you can\'t even do this one thing? You\'re the only person who understands me.',
  'You\'re overreacting. That never happened, you\'re just being paranoid. I never said that.',
  'If you really loved me you\'d send me the photo. Everyone does it. Don\'t be so dramatic.',
  'I\'ll hurt myself if you leave. You have to choose — it\'s me or your friends. You can\'t talk to them anymore.',
];

export default function Manipulation() {
  const [text, setText] = useState('');
  const [signs, setSigns] = useState<ManipulationSign[] | null>(null);
  const [advice, setAdvice] = useState<string[]>([]);

  const run = () => {
    const r = detectManipulation(text);
    setSigns(r.signs);
    setAdvice(r.advice);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Manipulation Detector"
        subtitle="Check a message for guilt-tripping, gaslighting, pressure, and other emotional tactics."
        icon={<Brain size={20} />}
      />

      <div className="card p-5">
        <label className="label" htmlFor="mtxt">Message to check</label>
        <textarea
          id="mtxt"
          className="input min-h-[120px] resize-y"
          placeholder="Paste a message — from a partner, family member, boss, or anyone…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={run} disabled={!text.trim()} className="btn-primary"><Brain size={16} /> Check for patterns</button>
          <button onClick={() => { setText(''); setSigns(null); setAdvice([]); }} className="btn-ghost"><Trash2 size={15} /> Clear</button>
        </div>
        <div className="mt-4 rounded-xl bg-primary-50/60 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary-700"><Sparkles size={13} /> Try a sample</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s, i) => (
              <button key={i} onClick={() => { setText(s); setSigns(null); }} className="rounded-lg border border-primary-200 bg-white px-2.5 py-1.5 text-left text-xs text-ink-700/80 hover:border-primary-400 hover:bg-primary-50">
                {s.slice(0, 45)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {signs && (
        <div className="mt-5 space-y-4 animate-slide-up">
          {signs.length > 0 ? (
            <div className="card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><AlertTriangle size={18} className="text-danger-600" /> Patterns detected</h3>
              <ul className="space-y-2.5">
                {signs.map((s) => (
                  <li key={s.id} className="flex gap-3 rounded-xl bg-danger-50 p-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-danger-100 text-xs font-bold text-danger-700">!</span>
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
              <EmptyState icon={<Brain size={28} />} title="No strong manipulation patterns found" hint="This is only an estimate — if a message feels wrong, trust that feeling." />
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
