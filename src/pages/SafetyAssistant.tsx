// Safety Assistant — supportive guidance for abuse / harassment / threats.
import { useState } from 'react';
import { LifeBuoy, Phone, Globe, Heart, ChevronRight } from 'lucide-react';
import { SAFETY_TOPICS, type SafetyTopic } from '@/lib/safetyTopics';
import { PageHeader } from '@/components/ui';

export default function SafetyAssistant() {
  const [active, setActive] = useState<SafetyTopic | null>(null);

  if (active) {
    return (
      <div className="animate-fade-in">
        <button onClick={() => setActive(null)} className="btn-ghost mb-4 text-sm">← All topics</button>
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">{active.emoji}</span>
            <h1 className="font-display text-2xl font-bold text-ink-900">{active.label}</h1>
          </div>
          <p className="rounded-xl bg-lavender-50 p-4 text-sm text-ink-700/80">{active.summary}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-danger-200 bg-danger-50/60 p-4">
              <h3 className="mb-2 font-semibold text-danger-800">Do this right now</h3>
              <ul className="space-y-2">
                {active.immediate.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-700/90"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger-500" />{s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-4">
              <h3 className="mb-2 font-semibold text-primary-800">In the next hours / days</h3>
              <ul className="space-y-2">
                {active.next.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-700/90"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-accent-50 p-4">
            <Heart size={20} className="mt-0.5 shrink-0 text-accent-600" />
            <p className="text-sm font-medium text-accent-900">{active.remember}</p>
          </div>

          <div className="mt-5">
            <h3 className="mb-3 font-semibold text-ink-900">Real resources</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {active.resources.map((r, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-primary-100 p-3">
                  <Globe size={16} className="mt-0.5 text-primary-500" />
                  <div>
                    <p className="font-semibold text-ink-900">{r.label}</p>
                    <p className="text-sm text-ink-700/70">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Safety Assistant"
        subtitle="Practical, supportive guidance if you're facing blackmail, harassment, threats, or abuse."
        icon={<LifeBuoy size={20} />}
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl bg-accent-50 p-4">
        <Heart size={20} className="mt-0.5 shrink-0 text-accent-600" />
        <p className="text-sm text-accent-900">
          If you are in immediate danger, call <strong>112</strong> now. This guidance is supportive and educational — it is not a substitute for professional or legal help.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SAFETY_TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t)}
            className="card group flex items-center gap-4 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <span className="text-3xl">{t.emoji}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-ink-900">{t.label}</h3>
              <p className="mt-0.5 text-sm text-ink-700/60 line-clamp-2">{t.summary}</p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-primary-300 group-hover:text-primary-600" />
          </button>
        ))}
      </div>

      <div className="mt-6 card p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><Phone size={16} className="text-primary-600" /> Key helpline numbers</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { num: '112', label: 'Emergency (all-India, 24x7)' },
            { num: '181', label: 'Women\'s helpline (24x7)' },
            { num: '1930', label: 'Cyber crime (financial fraud)' },
            { num: '9152987821', label: 'iCall — free counselling' },
          ].map((h) => (
            <a key={h.num} href={`tel:${h.num}`} className="flex items-center justify-between rounded-xl border border-primary-100 p-3 hover:bg-primary-50">
              <span className="text-sm text-ink-700/80">{h.label}</span>
              <span className="font-mono font-semibold text-primary-700">{h.num}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
