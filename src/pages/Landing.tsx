// Landing page — hero + feature grid + reassurance strip.
import { ArrowRight, ShieldCheck, Eye, HeartHandshake, Lock, Zap } from 'lucide-react';
import { FEATURES, GROUP_LABELS } from '@/lib/features';
import { navigate } from '@/lib/router';

export default function Landing() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-100/80 via-lavender-50 to-lavender-50" />
        <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
        <div className="absolute -left-16 top-40 -z-10 h-56 w-56 rounded-full bg-primary-200/40 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="animate-slide-up">
              <span className="chip border border-primary-200 bg-white/70 text-primary-700">
                <ShieldCheck size={13} /> Your safety, in your hands
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink-900 md:text-6xl">
                Detect. Decide.{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Protect.</span>
              </h1>
              <p className="mt-4 max-w-md text-base text-ink-700/80 md:text-lg">
                NariShield helps you spot scams, manage unsafe messages, and build a personal safety plan — all on your device, privately.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => navigate('scanner')} className="btn-primary px-6 py-3 text-base">
                  Get Started <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('dashboard')} className="btn-secondary px-6 py-3 text-base">
                  See your readiness
                </button>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-700/60">
                <Lock size={12} /> Works offline. Your data stays on this device.
              </p>
            </div>

            <div className="relative animate-scale-in">
              <div className="grid grid-cols-2 gap-4">
                <HeroStat icon={<Eye size={18} />} label="Scan messages for scam signs" accent="from-primary-500 to-primary-700" />
                <HeroStat icon={<Zap size={18} />} label="Get a risk score in seconds" accent="from-accent-500 to-accent-700" delay="0.1s" />
                <HeroStat icon={<HeartHandshake size={18} />} label="Guidance for abuse & threats" accent="from-lavender-500 to-lavender-700" delay="0.2s" />
                <HeroStat icon={<ShieldCheck size={18} />} label="Build a safety plan" accent="from-primary-600 to-accent-500" delay="0.3s" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-ink-900">Everything you need, in one place</h2>
          <p className="mt-2 text-ink-700/70">From spotting a scam SMS to planning a safe journey — pick what you need right now.</p>
        </div>

        {(['detect', 'decide', 'protect'] as const).map((g) => (
          <div key={g} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="font-display text-xl font-bold text-primary-700">{GROUP_LABELS[g]}</h3>
              <span className="h-px flex-1 bg-primary-100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.filter((f) => f.group === g).map((f) => (
                <button
                  key={f.route}
                  onClick={() => navigate(f.route)}
                  className="card group p-5 text-left transition-all hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <f.icon size={20} />
                  </div>
                  <h4 className="font-semibold text-ink-900">{f.title}</h4>
                  <p className="mt-1 text-sm text-ink-700/70">{f.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Open <ArrowRight size={14} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Reassurance */}
      <section className="bg-white/60 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-ink-900">Honest by design</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Promise icon={<Lock size={20} />} title="Private by default" text="Your data lives on your device. We don't upload your messages or contacts anywhere." />
            <Promise icon={<ShieldCheck size={20} />} title="Real, not fake" text="We won't pretend to block messages in other apps or auto-call police. What we offer, we actually do." />
            <Promise icon={<HeartHandshake size={20} />} title="Supportive" text="For abuse or threats, you'll find clear next steps and real helpline numbers — never judgement." />
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ icon, label, accent, delay = '0s' }: { icon: React.ReactNode; label: string; accent: string; delay?: string }) {
  return (
    <div className="card p-4" style={{ animationDelay: delay }}>
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white`}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-ink-900">{label}</p>
    </div>
  );
}

function Promise({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-lavender-50 p-5">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600">{icon}</div>
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-700/70">{text}</p>
    </div>
  );
}
