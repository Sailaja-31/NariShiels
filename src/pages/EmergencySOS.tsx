// Emergency SOS — 112 call shortcut, editable trusted contacts, clear instructions.
// Does NOT simulate a call. Only provides tel: shortcuts and guidance.
import { useState } from 'react';
import { Siren, Phone, Plus, Trash2, Info, ShieldAlert, AlertCircle } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/ui';
import { load, save } from '@/lib/storage';

interface SosContact {
  id: string;
  name: string;
  phone: string;
}

const HELPLINES = [
  { num: '112', label: 'Emergency (all-India, 24x7)' },
  { num: '181', label: "Women's helpline (24x7)" },
  { num: '100', label: 'Police' },
  { num: '1930', label: 'Cyber crime (financial fraud)' },
  { num: '1091', label: "Women's helpline (alt)" },
  { num: '9152987821', label: 'iCall — free counselling' },
];

export default function EmergencySOS() {
  const [contacts, setContacts] = useState<SosContact[]>(() => load('sos-contacts', []));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const persist = (n: SosContact[]) => { setContacts(n); save('sos-contacts', n); };
  const add = () => {
    if (!name.trim() || !phone.trim()) return;
    persist([...contacts, { id: crypto.randomUUID(), name: name.trim(), phone: phone.trim() }]);
    setName(''); setPhone('');
  };
  const remove = (id: string) => persist(contacts.filter((c) => c.id !== id));

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Emergency SOS"
        subtitle="Quick access to emergency numbers and your trusted contacts."
        icon={<Siren size={20} />}
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl bg-warning-50 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-warning-600" />
        <p className="text-sm text-ink-700/80">
          Tapping a number below opens your phone's dialer with the number filled in — you still need to press call. NariShield does not place any call automatically.
        </p>
      </div>

      {/* Big 112 button */}
      <div className="card mb-5 overflow-hidden">
        <a href="tel:112" className="flex items-center justify-center gap-3 bg-gradient-to-br from-danger-600 to-danger-700 py-8 text-white transition-transform active:scale-[0.99]">
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring" />
            <Phone size={26} className="relative" />
          </span>
          <span className="text-left">
            <span className="block font-display text-4xl font-bold leading-none">112</span>
            <span className="text-sm text-white/80">Tap to call emergency services</span>
          </span>
        </a>
      </div>

      {/* Trusted contacts */}
      <div className="card p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><Phone size={18} className="text-primary-600" /> Your trusted contacts</h3>
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button onClick={add} disabled={!name.trim() || !phone.trim()} className="btn-secondary"><Plus size={15} /> Add contact</button>

        {contacts.length === 0 ? (
          <div className="mt-4"><EmptyState icon={<Phone size={24} />} title="No trusted contacts yet" hint="Add people you'd call in an emergency." /></div>
        ) : (
          <ul className="mt-4 space-y-2">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl border border-primary-100 p-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink-900">{c.name}</p>
                  <a href={`tel:${c.phone}`} className="text-sm text-primary-700">{c.phone}</a>
                </div>
                <div className="flex items-center gap-1">
                  <a href={`tel:${c.phone}`} className="btn-primary px-3 py-2 text-sm"><Phone size={14} /> Call</a>
                  <button onClick={() => remove(c.id)} className="btn-ghost p-2"><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Helplines */}
      <div className="mt-5 card p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><ShieldAlert size={18} className="text-primary-600" /> Important helplines</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {HELPLINES.map((h) => (
            <a key={h.num} href={`tel:${h.num}`} className="flex items-center justify-between rounded-xl border border-primary-100 p-3 transition-colors hover:bg-primary-50">
              <span className="text-sm text-ink-700/80">{h.label}</span>
              <span className="font-mono font-semibold text-primary-700">{h.num}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-5 card p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900"><AlertCircle size={18} className="text-primary-600" /> If you're in danger</h3>
        <ol className="space-y-2 text-sm text-ink-700/80">
          <li className="flex gap-2.5"><span className="font-bold text-primary-600">1.</span> Call <strong>112</strong> if you are in immediate danger. Tell them your location clearly.</li>
          <li className="flex gap-2.5"><span className="font-bold text-primary-600">2.</span> If you can't speak, keep the line open so the operator can hear what's happening.</li>
          <li className="flex gap-2.5"><span className="font-bold text-primary-600">3.</span> Move to a safe, public place if you can.</li>
          <li className="flex gap-2.5"><span className="font-bold text-primary-600">4.</span> Call a trusted contact from your list above once you're safe.</li>
          <li className="flex gap-2.5"><span className="font-bold text-primary-600">5.</span> For online abuse or fraud, report at <strong>cybercrime.gov.in</strong> or call <strong>1930</strong>.</li>
        </ol>
      </div>
    </div>
  );
}
