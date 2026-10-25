// Fake Job Checker — checks job offers / chats for fake-job red flags.
import { useState } from 'react';
import { Briefcase, AlertTriangle, Lightbulb, Trash2, Sparkles } from 'lucide-react';
import { checkJob, type JobSign } from '@/lib/analysis';
import { PageHeader, EmptyState, EstimateNote } from '@/components/ui';

const SAMPLES = [
  'Earn ₹5000/day from home! No experience needed. Like YouTube videos and earn. Pay ₹499 joining fee. WhatsApp only.',
  'Congratulations! You\'ve been selected for a work-from-home data entry job. Salary ₹40,000/week. Limited seats — join today! Message on Telegram @jobsindia.',
  'Hiring: Data Analyst at Infosys BPM. Apply via careers.infosys.com. Requires graduate degree, 1+ yr experience. Send resume to careers@infosys.com.',
  'Job in Dubai, salary 80,000 AED. Pay visa processing fee ₹15,000 to start. Urgent, only 2 seats left. Contact agent on WhatsApp.',
];

export default function JobChecker() {
  const [text, setText] = useState('');
  const [signs, setSigns] = useState<JobSign[] | null>(null);
  const [advice, setAdvice] = useState<string[]>([]);

  const run = () => { const r = checkJob(text); setSigns(r.signs); setAdvice(r.advice); };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Fake Job Checker"
        subtitle="Paste a job offer, WhatsApp message, or recruiter chat to check for fake-job warning signs."
        icon={<Briefcase size={20} />}
      />

      <div className="card p-5">
        <label className="label" htmlFor="jtxt">Job offer or message to check</label>
        <textarea
          id="jtxt"
          className="input min-h-[120px] resize-y"
          placeholder="Paste the job offer or recruiter message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={run} disabled={!text.trim()} className="btn-primary"><Briefcase size={16} /> Check job offer</button>
          <button onClick={() => { setText(''); setSigns(null); setAdvice([]); }} className="btn-ghost"><Trash2 size={15} /> Clear</button>
        </div>
        <div className="mt-4 rounded-xl bg-primary-50/60 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary-700"><Sparkles size={13} /> Try a sample</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s, i) => (
              <button key={i} onClick={() => { setText(s); setSigns(null); }} className="rounded-lg border border-primary-200 bg-white px-2.5 py-1.5 text-left text-xs text-ink-700/80 hover:border-primary-400 hover:bg-primary-50">
                {s.slice(0, 50)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {signs && (
        <div className="mt-5 space-y-4 animate-slide-up">
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
              <EmptyState icon={<Briefcase size={28} />} title="No strong fake-job signals found" hint="Still verify the company on official sites. This is only an estimate." />
            </div>
          )}

          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><Lightbulb size={18} className="text-primary-600" /> What to do</h3>
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
