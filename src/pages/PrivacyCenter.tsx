// Privacy Center — explains stored data, provides controls, and Quick Exit.
import { useState } from 'react';
import { Lock, Trash2, LogOut, ShieldCheck, Info, Database, Eye } from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { load, clearAll, allKeys } from '@/lib/storage';

interface DataItem {
  key: string;
  label: string;
  description: string;
  countFn: (v: unknown) => number;
}

const DATA_ITEMS: DataItem[] = [
  { key: 'planner-completed', label: 'Action plan progress', description: 'Which safety tasks you have marked complete.', countFn: (v) => Object.keys(v as object).filter((k) => (v as Record<string, boolean>)[k]).length },
  { key: 'guard-flagged', label: 'Flagged messages', description: 'Messages you flagged as scam / safe / unsure.', countFn: (v) => Array.isArray(v) ? v.length : 0 },
  { key: 'guard-blocked', label: 'Blocklist entries', description: 'Numbers/handles you added to your local blocklist.', countFn: (v) => Array.isArray(v) ? v.length : 0 },
  { key: 'sos-contacts', label: 'SOS trusted contacts', description: 'Names and phone numbers for emergency use.', countFn: (v) => Array.isArray(v) ? v.length : 0 },
  { key: 'journey-contacts', label: 'Journey trusted contacts', description: 'Contacts you trust during travel.', countFn: (v) => Array.isArray(v) ? v.length : 0 },
  { key: 'journeys', label: 'Journey records', description: 'Your travel check-ins and timestamps.', countFn: (v) => Array.isArray(v) ? v.length : 0 },
  { key: 'scan-history', label: 'Scan history', description: 'Recent messages you scanned (first 120 chars only).', countFn: (v) => Array.isArray(v) ? v.length : 0 },
  { key: 'simulator-best', label: 'Simulator best score', description: 'Your highest score in the scam simulator.', countFn: (v) => (typeof v === 'number' && v > 0) ? 1 : 0 },
];

export default function PrivacyCenter({ onQuickExit }: { onQuickExit?: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);
  const keys = allKeys();

  const handleClear = () => {
    clearAll();
    setCleared(true);
    setConfirm(false);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Privacy Center"
        subtitle="See what NariShield stores and control your data."
        icon={<Lock size={20} />}
      />

      {/* Principles */}
      <div className="card mb-5 p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><ShieldCheck size={18} className="text-primary-600" /> How NariShield handles your data</h3>
        <ul className="space-y-2 text-sm text-ink-700/80">
          <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />Everything is stored locally in your browser, on this device only.</li>
          <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />Your messages, contacts, and check-ins are never uploaded to any server.</li>
          <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />NariShield does not have accounts and does not track you across sessions.</li>
          <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />Clearing your browser data or using a private/incognito window also removes everything.</li>
        </ul>
      </div>

      {/* Quick Exit */}
      <div className="card mb-5 border-accent-200 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-ink-900"><LogOut size={18} className="text-accent-600" /> Quick Exit</h3>
            <p className="mt-1 text-sm text-ink-700/70">Instantly replace this screen with a neutral page. You can also press <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-mono border border-primary-200">Esc</kbd> twice quickly.</p>
          </div>
          <button onClick={() => onQuickExit?.()} className="btn-danger shrink-0"><LogOut size={15} /> Exit now</button>
        </div>
      </div>

      {/* Stored data */}
      <div className="card mb-5 p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><Database size={18} className="text-primary-600" /> What's stored on this device</h3>
        {keys.length === 0 && <p className="text-sm text-ink-700/60">No data stored yet. As you use NariShield, your entries will appear here.</p>}
        <ul className="space-y-2">
          {DATA_ITEMS.map((item) => {
            const raw = load(item.key, null);
            const has = raw !== null && raw !== undefined;
            const count = has ? item.countFn(raw) : 0;
            if (!has) return null;
            return (
              <li key={item.key} className="flex items-start justify-between gap-3 rounded-xl border border-primary-100 p-3">
                <div className="flex gap-3">
                  <Eye size={16} className="mt-0.5 shrink-0 text-primary-400" />
                  <div>
                    <p className="font-semibold text-ink-900">{item.label} <span className="ml-1 text-xs font-normal text-ink-700/50">({count} {count === 1 ? 'item' : 'items'})</span></p>
                    <p className="text-sm text-ink-700/60">{item.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Delete controls */}
      <div className="card border-danger-200 p-5">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-danger-800"><Trash2 size={18} /> Delete your data</h3>
        <p className="mb-3 text-sm text-ink-700/70">This permanently removes all NariShield data from this device. This cannot be undone.</p>
        {cleared ? (
          <p className="rounded-xl bg-success-50 p-3 text-sm font-medium text-success-800">All your NariShield data has been cleared.</p>
        ) : confirm ? (
          <div className="flex flex-wrap gap-2">
            <button onClick={handleClear} className="btn-danger">Yes, delete everything</button>
            <button onClick={() => setConfirm(false)} className="btn-ghost">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} className="btn-danger"><Trash2 size={15} /> Clear all data</button>
        )}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-primary-50 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-primary-600" />
        <p className="text-sm text-ink-700/80">
          NariShield is an educational safety tool. It is not a substitute for emergency services or professional legal advice. In an emergency, call 112.
        </p>
      </div>
    </div>
  );
}
