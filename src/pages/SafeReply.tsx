// Safe Reply Generator — generates polite/firm replies with a working Copy button.
import { useState } from 'react';
import { MessageSquareReply, Trash2, RefreshCw } from 'lucide-react';
import { generateReply } from '@/lib/analysis';
import { PageHeader, CopyButton, EstimateNote } from '@/components/ui';

type Tone = 'firm' | 'polite' | 'busy';

const SAMPLES = [
  'Send me your OTP to verify your account, it\'s urgent.',
  'I\'ll leak your photos if you don\'t send me money.',
  'Pay ₹499 registration fee to start your work-from-home job.',
  'Just one photo, please. Everyone does it. Don\'t be shy.',
];

export default function SafeReply() {
  const [text, setText] = useState('');
  const [tone, setTone] = useState<Tone>('firm');
  const [reply, setReply] = useState('');

  const generate = (t: Tone = tone) => { setTone(t); setReply(generateReply(text, t)); };

  const tones: { id: Tone; label: string }[] = [
    { id: 'firm', label: 'Firm' },
    { id: 'polite', label: 'Polite' },
    { id: 'busy', label: 'Short / busy' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Safe Reply Generator"
        subtitle="Generate a clear, firm reply to a suspicious message. Copy it with one tap."
        icon={<MessageSquareReply size={20} />}
      />

      <div className="card p-5">
        <label className="label" htmlFor="rtxt">Message you received</label>
        <textarea
          id="rtxt"
          className="input min-h-[100px] resize-y"
          placeholder="Paste the message you want to reply to…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => generate()} disabled={!text.trim()} className="btn-primary"><RefreshCw size={15} /> Generate reply</button>
          <button onClick={() => { setText(''); setReply(''); }} className="btn-ghost"><Trash2 size={15} /> Clear</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SAMPLES.map((s, i) => (
            <button key={i} onClick={() => setText(s)} className="rounded-lg border border-primary-200 bg-white px-2.5 py-1.5 text-left text-xs text-ink-700/80 hover:border-primary-400 hover:bg-primary-50">
              {s.slice(0, 40)}…
            </button>
          ))}
        </div>
      </div>

      {reply && (
        <div className="mt-5 card p-5 animate-slide-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-ink-900">Suggested reply</h3>
            <CopyButton text={reply} />
          </div>
          <div className="rounded-xl bg-lavender-50 p-4">
            <p className="text-sm text-ink-900">{reply}</p>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-ink-700/60">Try a different tone</p>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => generate(t.id)}
                  className={`chip border ${tone === t.id ? 'border-primary-400 bg-primary-100 text-primary-700' : 'border-primary-200 bg-white text-ink-700/70 hover:bg-primary-50'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <EstimateNote className="mt-4" />
          <p className="mt-2 text-xs text-ink-700/50">
            You do not have to reply at all. For threats or blackmail, replying — even firmly — can sometimes escalate things. In those cases, save evidence, block, and report instead.
          </p>
        </div>
      )}
    </div>
  );
}
