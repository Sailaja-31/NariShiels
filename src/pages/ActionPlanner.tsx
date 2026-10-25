// Personal Safety Action Planner — builds a checklist from the user's situation.
import { useState } from 'react';
import { ClipboardList, Check, ChevronRight, RotateCcw } from 'lucide-react';
import { SITUATIONS, tasksForSituation, type Situation } from '@/lib/safetyTasks';
import { PageHeader, EmptyState } from '@/components/ui';
import { load, save } from '@/lib/storage';

const COMPLETED_KEY = 'planner-completed';

export default function ActionPlanner() {
  const [selected, setSelected] = useState<Situation | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>(() => load(COMPLETED_KEY, {}));

  const persist = (next: Record<string, boolean>) => { setDone(next); save(COMPLETED_KEY, next); };

  const tasks = selected ? tasksForSituation(selected) : [];
  const completedCount = tasks.filter((t) => done[t.id]).length;

  const reset = () => { persist({}); setSelected(null); };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Personal Safety Action Planner"
        subtitle="Pick the situation that fits you best, and get a personal checklist to work through."
        icon={<ClipboardList size={20} />}
      />

      {/* Step 1: pick a situation */}
      <div className="card p-5">
        <h3 className="mb-3 font-semibold text-ink-900">What's your situation?</h3>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {SITUATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                selected === s.id ? 'border-primary-400 bg-primary-50' : 'border-primary-100 bg-white hover:border-primary-300 hover:bg-primary-50/50'
              }`}
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">{s.label}</p>
                <p className="mt-0.5 text-xs text-ink-700/60">{s.description}</p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-primary-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: checklist */}
      {selected && (
        <div className="mt-5 card p-5 animate-slide-up">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink-900">Your action plan</h3>
            <button onClick={reset} className="btn-ghost text-sm"><RotateCcw size={14} /> Start over</button>
          </div>

          <div className="mb-4 rounded-xl bg-primary-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ink-700">{completedCount} of {tasks.length} done</span>
              <span className="font-semibold text-primary-700">{Math.round((completedCount / tasks.length) * 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-100">
              <div className="h-full rounded-full bg-primary-500 transition-all duration-500" style={{ width: `${(completedCount / tasks.length) * 100}%` }} />
            </div>
          </div>

          {completedCount === tasks.length && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 p-3 text-sm font-medium text-success-800">
              <Check size={16} /> You've completed every action on your plan. Well done — you're safer for it.
            </div>
          )}

          <ul className="space-y-2">
            {tasks.map((t) => {
              const isDone = !!done[t.id];
              return (
                <li key={t.id}>
                  <button
                    onClick={() => persist({ ...done, [t.id]: !isDone })}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                      isDone ? 'border-success-200 bg-success-50' : 'border-primary-100 bg-white hover:bg-primary-50/40'
                    }`}
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      isDone ? 'border-success-500 bg-success-500 text-white' : 'border-primary-300'
                    }`}>
                      {isDone && <Check size={13} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold ${isDone ? 'text-ink-700/60 line-through' : 'text-ink-900'}`}>{t.label}</p>
                      <p className="mt-0.5 text-sm text-ink-700/60">{t.detail}</p>
                      <span className="mt-1.5 inline-block chip bg-primary-100/60 text-primary-700 capitalize">{t.category}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {!selected && (
        <div className="mt-5">
          <EmptyState icon={<ClipboardList size={28} />} title="Pick a situation above to begin" hint="Your checklist saves automatically on this device." />
        </div>
      )}
    </div>
  );
}
