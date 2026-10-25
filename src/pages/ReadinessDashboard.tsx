// Safety Readiness Dashboard — score from completed safety tasks + activity.
import { LayoutDashboard, ClipboardList, ShieldCheck, Phone, Ban, ScanSearch, GraduationCap, ArrowRight, TrendingUp } from 'lucide-react';
import { ALL_TASKS } from '@/lib/safetyTasks';
import { PageHeader, ProgressBar } from '@/components/ui';
import { load, allKeys } from '@/lib/storage';
import { navigate } from '@/lib/router';

export default function ReadinessDashboard() {
  const completed = load<Record<string, boolean>>('planner-completed', {});
  const sosContacts = load<{ id: string }[]>('sos-contacts', []);
  const journeyContacts = load<{ id: string }[]>('journey-contacts', []);
  const blocked = load<{ id: string }[]>('guard-blocked', []);
  const flagged = load<{ id: string }[]>('guard-flagged', []);
  const scans = load<{ text: string }[]>('scan-history', []);
  const simBest = load<number>('simulator-best', 0);

  const totalTasks = ALL_TASKS.length;
  const doneTasks = ALL_TASKS.filter((t) => completed[t.id]).length;
  const taskPct = Math.round((doneTasks / totalTasks) * 100);

  // Overall score: weighted blend of signals
  const signals = [
    { label: 'Action plan tasks', pct: taskPct, weight: 0.5 },
    { label: 'Trusted contacts saved', pct: Math.min(100, (sosContacts.length + journeyContacts.length) * 33), weight: 0.2 },
    { label: 'Simulator practice', pct: Math.round((simBest / 6) * 100), weight: 0.15 },
    { label: 'Message Guard usage', pct: Math.min(100, (blocked.length + flagged.length) * 20), weight: 0.1 },
    { label: 'Scanner usage', pct: Math.min(100, scans.length * 15), weight: 0.05 },
  ];
  const score = Math.round(signals.reduce((s, x) => s + x.pct * x.weight, 0));

  const level = score >= 80 ? 'Well prepared' : score >= 50 ? 'Getting ready' : 'Just starting';
  const levelColor = score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger';

  const quickLinks = [
    { icon: <ClipboardList size={18} />, label: 'Build your action plan', route: 'planner' as const, done: taskPct === 100 },
    { icon: <Phone size={18} />, label: 'Add SOS trusted contacts', route: 'sos' as const, done: sosContacts.length >= 2 },
    { icon: <GraduationCap size={18} />, label: 'Practice the scam simulator', route: 'simulator' as const, done: simBest >= 5 },
    { icon: <Ban size={18} />, label: 'Manage your blocklist', route: 'guard' as const, done: false },
    { icon: <ScanSearch size={18} />, label: 'Scan a suspicious message', route: 'scanner' as const, done: false },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Safety Readiness Dashboard"
        subtitle="Track how prepared you are, and see what to do next."
        icon={<LayoutDashboard size={20} />}
      />

      {/* Score */}
      <div className="card mb-5 p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-ink-700/60">Your readiness score</p>
            <p className="font-display text-6xl font-bold text-ink-900">{score}<span className="text-2xl text-ink-700/30">/100</span></p>
          </div>
          <span className={`chip border ${levelColor === 'success' ? 'bg-success-100 text-success-700 border-success-200' : levelColor === 'warning' ? 'bg-warning-100 text-warning-700 border-warning-200' : 'bg-danger-100 text-danger-700 border-danger-200'}`}>
            <TrendingUp size={13} /> {level}
          </span>
        </div>
        <div className="mt-4"><ProgressBar value={score} color={levelColor === 'success' ? 'success' : levelColor === 'warning' ? 'warning' : 'danger'} /></div>
        <p className="mt-3 text-xs text-ink-700/50">Score is calculated from your action plan, contacts, simulator practice, and tool usage — all stored on this device.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Signal breakdown */}
        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-ink-900">What's contributing</h3>
          <ul className="space-y-3">
            {signals.map((s) => (
              <li key={s.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink-700/80">{s.label}</span>
                  <span className="font-semibold text-ink-900">{s.pct}%</span>
                </div>
                <ProgressBar value={s.pct} />
              </li>
            ))}
          </ul>
        </div>

        {/* Action plan progress */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink-900">Action plan</h3>
            <button onClick={() => navigate('planner')} className="btn-ghost text-sm">Open <ArrowRight size={14} /></button>
          </div>
          <p className="font-display text-4xl font-bold text-ink-900">{doneTasks}<span className="text-xl text-ink-700/30">/{totalTasks}</span></p>
          <p className="text-sm text-ink-700/60">safety tasks completed</p>
          <div className="mt-3"><ProgressBar value={taskPct} /></div>
          <div className="mt-4 flex flex-wrap gap-2">
            {ALL_TASKS.slice(0, 4).map((t) => (
              <span key={t.id} className={`chip ${completed[t.id] ? 'bg-success-100 text-success-700' : 'bg-primary-100/60 text-primary-700'}`}>
                {completed[t.id] && <ShieldCheck size={12} />} {t.label.length > 28 ? t.label.slice(0, 28) + '…' : t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 card p-5">
        <h3 className="mb-3 font-semibold text-ink-900">Recommended next steps</h3>
        <ul className="space-y-2">
          {quickLinks.map((q) => (
            <li key={q.label}>
              <button onClick={() => navigate(q.route)} className="flex w-full items-center gap-3 rounded-xl border border-primary-100 p-3 text-left hover:bg-primary-50/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600">{q.icon}</span>
                <span className="flex-1 text-sm font-semibold text-ink-900">{q.label}</span>
                {q.done ? <ShieldCheck size={18} className="text-success-600" /> : <ArrowRight size={16} className="text-primary-300" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-center text-xs text-ink-700/50">
        {allKeys().length} data items stored on this device. Manage them in the Privacy Center.
      </p>
    </div>
  );
}
