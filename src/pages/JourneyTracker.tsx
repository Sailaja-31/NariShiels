// Safe Journey Tracker — optional check-ins and trusted-contact details.
// Privacy-first: everything stays on the device. We do not send automatic alerts.
import { useState } from 'react';
import { MapPin, Phone, Plus, Trash2, Check, Info, Clock, Users } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/ui';
import { load, save } from '@/lib/storage';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

interface CheckIn {
  id: string;
  status: 'started' | 'arrived' | 'safe';
  note: string;
  at: number;
}

interface Journey {
  id: string;
  from: string;
  to: string;
  contactId: string | null;
  startedAt: number;
  checkins: CheckIn[];
  finished: boolean;
}

export default function JourneyTracker() {
  const [contacts, setContacts] = useState<TrustedContact[]>(() => load('journey-contacts', []));
  const [journeys, setJourneys] = useState<Journey[]>(() => load('journeys', []));
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [contactId, setContactId] = useState<string>('');
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cRelation, setCRelation] = useState('');

  const persistContacts = (n: TrustedContact[]) => { setContacts(n); save('journey-contacts', n); };
  const persistJourneys = (n: Journey[]) => { setJourneys(n); save('journeys', n); };

  const addContact = () => {
    if (!cName.trim() || !cPhone.trim()) return;
    persistContacts([...contacts, { id: crypto.randomUUID(), name: cName.trim(), phone: cPhone.trim(), relation: cRelation.trim() || 'Trusted contact' }]);
    setCName(''); setCPhone(''); setCRelation('');
  };

  const removeContact = (id: string) => {
    persistContacts(contacts.filter((c) => c.id !== id));
    if (contactId === id) setContactId('');
  };

  const startJourney = () => {
    if (!from.trim() || !to.trim()) return;
    const j: Journey = { id: crypto.randomUUID(), from: from.trim(), to: to.trim(), contactId: contactId || null, startedAt: Date.now(), checkins: [], finished: false };
    persistJourneys([j, ...journeys]);
    setFrom(''); setTo('');
  };

  const checkIn = (jid: string, status: CheckIn['status']) => {
    const next = journeys.map((j) => {
      if (j.id !== jid) return j;
      const ci: CheckIn = { id: crypto.randomUUID(), status, note: '', at: Date.now() };
      return { ...j, checkins: [ci, ...j.checkins], finished: status === 'safe' ? true : j.finished };
    });
    persistJourneys(next);
  };

  const removeJourney = (id: string) => persistJourneys(journeys.filter((j) => j.id !== id));

  const statusLabel: Record<CheckIn['status'], string> = { started: 'Started', arrived: 'Arrived', safe: 'Safe' };
  const statusCls: Record<CheckIn['status'], string> = { started: 'bg-primary-100 text-primary-700', arrived: 'bg-warning-100 text-warning-700', safe: 'bg-success-100 text-success-700' };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Safe Journey Tracker"
        subtitle="Optional check-ins and trusted-contact details for when you travel."
        icon={<MapPin size={20} />}
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl bg-primary-50 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-primary-600" />
        <p className="text-sm text-ink-700/80">
          <strong>Privacy:</strong> All journey and contact details are stored only on this device. NariShield does <strong>not</strong> automatically send alerts to your contacts. Check-in buttons record a timestamp for your own record — you decide whether to share it with your trusted contact.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Trusted contacts */}
        <div className="card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><Users size={18} className="text-primary-600" /> Trusted contacts</h3>
          <div className="space-y-2">
            <input className="input" placeholder="Name" value={cName} onChange={(e) => setCName(e.target.value)} />
            <input className="input" placeholder="Phone number" value={cPhone} onChange={(e) => setCPhone(e.target.value)} />
            <input className="input" placeholder="Relation (e.g. sister, friend)" value={cRelation} onChange={(e) => setCRelation(e.target.value)} />
            <button onClick={addContact} disabled={!cName.trim() || !cPhone.trim()} className="btn-secondary w-full"><Plus size={15} /> Add contact</button>
          </div>
          {contacts.length === 0 ? (
            <div className="mt-4"><EmptyState icon={<Users size={24} />} title="No contacts yet" hint="Add someone you trust to notify during travel." /></div>
          ) : (
            <ul className="mt-4 space-y-2">
              {contacts.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-xl border border-primary-100 p-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900">{c.name}</p>
                    <p className="text-sm text-ink-700/60">{c.relation} · <a href={`tel:${c.phone}`} className="text-primary-700">{c.phone}</a></p>
                  </div>
                  <button onClick={() => removeContact(c.id)} className="btn-ghost p-1.5"><Trash2 size={15} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Start a journey */}
        <div className="card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><MapPin size={18} className="text-primary-600" /> Start a journey</h3>
          <div className="space-y-2">
            <input className="input" placeholder="From (starting point)" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input className="input" placeholder="To (destination)" value={to} onChange={(e) => setTo(e.target.value)} />
            <select className="input" value={contactId} onChange={(e) => setContactId(e.target.value)}>
              <option value="">No trusted contact (optional)</option>
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
            </select>
            <button onClick={startJourney} disabled={!from.trim() || !to.trim()} className="btn-primary w-full"><MapPin size={15} /> Start tracking</button>
          </div>
        </div>
      </div>

      {/* Active / past journeys */}
      <div className="mt-5 card p-5">
        <h3 className="mb-3 font-semibold text-ink-900">Your journeys</h3>
        {journeys.length === 0 ? (
          <EmptyState icon={<MapPin size={28} />} title="No journeys yet" hint="Start one above to keep a private record of your travel." />
        ) : (
          <ul className="space-y-3">
            {journeys.map((j) => {
              const contact = contacts.find((c) => c.id === j.contactId);
              return (
                <li key={j.id} className="rounded-xl border border-primary-100 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink-900">{j.from} → {j.to}</p>
                      <p className="text-xs text-ink-700/50">Started {new Date(j.startedAt).toLocaleString()}</p>
                      {contact && <p className="mt-0.5 text-xs text-ink-700/60">Contact: {contact.name} · <a href={`tel:${contact.phone}`} className="text-primary-700">{contact.phone}</a></p>}
                      {j.finished && <span className="mt-1 inline-block chip bg-success-100 text-success-700"><Check size={12} /> Completed safely</span>}
                    </div>
                    <button onClick={() => removeJourney(j.id)} className="btn-ghost p-1.5"><Trash2 size={15} /></button>
                  </div>
                  {!j.finished && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => checkIn(j.id, 'started')} className="btn-secondary text-xs"><Clock size={13} /> Check in: started</button>
                      <button onClick={() => checkIn(j.id, 'arrived')} className="btn-secondary text-xs"><MapPin size={13} /> Check in: arrived</button>
                      <button onClick={() => checkIn(j.id, 'safe')} className="btn-primary text-xs"><Check size={13} /> Mark safe</button>
                    </div>
                  )}
                  {j.checkins.length > 0 && (
                    <ul className="mt-3 space-y-1 border-t border-primary-100 pt-2">
                      {j.checkins.map((ci) => (
                        <li key={ci.id} className="flex items-center gap-2 text-xs">
                          <span className={`chip ${statusCls[ci.status]}`}>{statusLabel[ci.status]}</span>
                          <span className="text-ink-700/50">{new Date(ci.at).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
