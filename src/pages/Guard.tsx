// Message Guard — flag messages, mark safe, manage a local blocklist.
import { useState } from 'react';
import { ShieldCheck, Flag, Ban, Trash2, CheckCircle2, ShieldX } from 'lucide-react';
import { PageHeader, EmptyState, EstimateNote } from '@/components/ui';
import { load, save } from '@/lib/storage';
import { scanMessage } from '@/lib/analysis';

interface Flagged {
  id: string;
  text: string;
  sender: string;
  status: 'scam' | 'safe' | 'unsure';
  score: number;
  at: number;
}

interface BlockedEntry {
  id: string;
  value: string; // phone, email, or handle
  note?: string;
  at: number;
}

export default function Guard() {
  const [flagged, setFlagged] = useState<Flagged[]>(() => load('guard-flagged', []));
  const [blocked, setBlocked] = useState<BlockedEntry[]>(() => load('guard-blocked', []));
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [blockValue, setBlockValue] = useState('');
  const [blockNote, setBlockNote] = useState('');

  const persistFlagged = (next: Flagged[]) => { setFlagged(next); save('guard-flagged', next); };
  const persistBlocked = (next: BlockedEntry[]) => { setBlocked(next); save('guard-blocked', next); };

  const addFlagged = (status: Flagged['status']) => {
    if (!text.trim()) return;
    const score = scanMessage(text).score;
    const entry: Flagged = { id: crypto.randomUUID(), text: text.trim(), sender: sender.trim() || 'Unknown', status, score, at: Date.now() };
    persistFlagged([entry, ...flagged].slice(0, 50));
    setText(''); setSender('');
  };

  const removeFlagged = (id: string) => persistFlagged(flagged.filter((f) => f.id !== id));

  const addBlock = () => {
    if (!blockValue.trim()) return;
    persistBlocked([{ id: crypto.randomUUID(), value: blockValue.trim(), note: blockNote.trim() || undefined, at: Date.now() }, ...blocked]);
    setBlockValue(''); setBlockNote('');
  };

  const removeBlock = (id: string) => persistBlocked(blocked.filter((b) => b.id !== id));

  const statusChip = (s: Flagged['status']) =>
    s === 'scam' ? 'bg-danger-100 text-danger-700' : s === 'safe' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700';
  const statusLabel = (s: Flagged['status']) => s === 'scam' ? 'Scam' : s === 'safe' ? 'Safe' : 'Unsure';

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Message Guard"
        subtitle="Flag messages as scam or safe, and keep your own local blocklist."
        icon={<ShieldCheck size={20} />}
      />

      {/* Flag a message */}
      <div className="card p-5">
        <h3 className="mb-3 font-semibold text-ink-900">Flag a message</h3>
        <div className="space-y-3">
          <div>
            <label className="label" htmlFor="sender">Sender (optional)</label>
            <input id="sender" className="input" placeholder="Phone number, name, or handle" value={sender} onChange={(e) => setSender(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="gmsg">Message</label>
            <textarea id="gmsg" className="input min-h-[100px] resize-y" placeholder="Paste the message you want to flag…" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => addFlagged('scam')} disabled={!text.trim()} className="btn-danger">
              <Flag size={15} /> Mark as scam
            </button>
            <button onClick={() => addFlagged('safe')} disabled={!text.trim()} className="btn-secondary">
              <CheckCircle2 size={15} /> Mark as safe
            </button>
            <button onClick={() => addFlagged('unsure')} disabled={!text.trim()} className="btn-ghost">
              <ShieldX size={15} /> Unsure
            </button>
          </div>
        </div>
        <EstimateNote className="mt-3" />
      </div>

      {/* Flagged list */}
      <div className="mt-5 card p-5">
        <h3 className="mb-3 flex items-center justify-between font-semibold text-ink-900">
          <span>Flagged messages</span>
          {flagged.length > 0 && <span className="text-xs font-normal text-ink-700/50">{flagged.length} stored</span>}
        </h3>
        {flagged.length === 0 ? (
          <EmptyState icon={<Flag size={28} />} title="No flagged messages yet" hint="Flag messages above to keep a record. This list stays on your device." />
        ) : (
          <ul className="space-y-2.5">
            {flagged.map((f) => (
              <li key={f.id} className="rounded-xl border border-primary-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`chip ${statusChip(f.status)}`}>{statusLabel(f.status)}</span>
                      <span className="text-xs text-ink-700/50">from {f.sender}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-700/80 line-clamp-3">{f.text}</p>
                    <p className="mt-1 text-xs text-ink-700/40">Scan score: {f.score}/100</p>
                  </div>
                  <button onClick={() => removeFlagged(f.id)} className="btn-ghost p-1.5" aria-label="Remove">
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Blocklist */}
      <div className="mt-5 card p-5">
        <h3 className="mb-1 font-semibold text-ink-900">Local blocklist</h3>
        <p className="mb-3 text-sm text-ink-700/60">
          This blocklist works only inside NariShield. It cannot block someone from texting you in WhatsApp, SMS, or any other app — for that, use the block feature in that app.
        </p>
        <div className="space-y-3 rounded-xl bg-primary-50/50 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="input" placeholder="Phone, email, or handle to block" value={blockValue} onChange={(e) => setBlockValue(e.target.value)} />
            <input className="input" placeholder="Note (optional)" value={blockNote} onChange={(e) => setBlockNote(e.target.value)} />
          </div>
          <button onClick={addBlock} disabled={!blockValue.trim()} className="btn-secondary">
            <Ban size={15} /> Add to blocklist
          </button>
        </div>

        {blocked.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={<Ban size={28} />} title="Your blocklist is empty" hint="Add numbers or handles you want to remember to avoid." />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {blocked.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-xl border border-primary-100 p-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink-900">{b.value}</p>
                  {b.note && <p className="text-sm text-ink-700/60">{b.note}</p>}
                </div>
                <button onClick={() => removeBlock(b.id)} className="btn-ghost p-1.5" aria-label="Remove">
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
