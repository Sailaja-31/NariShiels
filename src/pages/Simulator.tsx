// Scam Simulator — interactive scenarios with MCQs, explanations, final score.
import { useMemo, useState } from 'react';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, Lightbulb } from 'lucide-react';
import { SCENARIOS, type Scenario } from '@/lib/scenarios';
import { PageHeader, ProgressBar } from '@/components/ui';
import { save, load } from '@/lib/storage';

type Phase = 'intro' | 'playing' | 'done';

export default function Simulator() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const bestScore = load('simulator-best', 0);

  const scenario: Scenario | undefined = SCENARIOS[index];
  const progress = useMemo(() => ((index + (answered ? 1 : 0)) / SCENARIOS.length) * 100, [index, answered]);

  const start = () => { setPhase('playing'); setIndex(0); setSelected(null); setAnswered(false); setCorrectCount(0); };

  const choose = (id: string) => {
    if (answered) return;
    setSelected(id);
    setAnswered(true);
    const choice = scenario?.choices.find((c) => c.id === id);
    if (choice?.correct) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (index + 1 >= SCENARIOS.length) {
      const final = correctCount;
      if (final > bestScore) save('simulator-best', final);
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (phase === 'intro') {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Scam Simulator" subtitle="Practice spotting scams with realistic scenarios. No score is shared — it's just for you." icon={<GraduationCap size={20} />} />
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-primary-50 p-4">
            <GraduationCap size={28} className="text-primary-600" />
            <div>
              <p className="font-semibold text-ink-900">{SCENARIOS.length} short scenarios</p>
              <p className="text-sm text-ink-700/70">Multiple choice. You'll see why each answer is right or wrong.</p>
            </div>
          </div>
          {bestScore > 0 && (
            <p className="mb-4 text-sm text-ink-700/70">Your best so far: <span className="font-semibold text-primary-700">{bestScore}/{SCENARIOS.length}</span></p>
          )}
          <button onClick={start} className="btn-primary">Start practicing <ArrowRight size={16} /></button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const pct = Math.round((correctCount / SCENARIOS.length) * 100);
    const message = pct === 100 ? 'Perfect! You can spot a scam from a mile away.' : pct >= 60 ? 'Good instincts. A little practice and you\'ll be even sharper.' : 'Keep going — every scenario makes you safer. Try again!';
    return (
      <div className="animate-fade-in">
        <PageHeader title="Scam Simulator" subtitle="Practice spotting scams with realistic scenarios." icon={<GraduationCap size={20} />} />
        <div className="card p-8 text-center">
          <Award size={48} className="mx-auto text-primary-500" />
          <p className="mt-4 font-display text-5xl font-bold text-ink-900">{correctCount}<span className="text-2xl text-ink-700/40">/{SCENARIOS.length}</span></p>
          <p className="mt-2 text-ink-700/80">{message}</p>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={start} className="btn-primary"><RotateCcw size={16} /> Try again</button>
          </div>
        </div>
      </div>
    );
  }

  if (!scenario) return null;
  const selectedChoice = scenario.choices.find((c) => c.id === selected);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Scam Simulator" subtitle={`Scenario ${index + 1} of ${SCENARIOS.length}`} icon={<GraduationCap size={20} />} />
      <div className="mb-4"><ProgressBar value={progress} /></div>

      <div className="card p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl">{scenario.emoji}</span>
          <h3 className="font-display text-xl font-bold text-ink-900">{scenario.title}</h3>
        </div>
        <div className="rounded-xl bg-lavender-50 p-4">
          <p className="text-sm text-ink-700/80">{scenario.situation}</p>
        </div>
        <p className="mt-4 font-semibold text-ink-900">{scenario.question}</p>

        <div className="mt-3 space-y-2.5">
          {scenario.choices.map((c) => {
            const isSelected = selected === c.id;
            const showResult = answered && isSelected;
            const showCorrect = answered && c.correct;
            return (
              <button
                key={c.id}
                onClick={() => choose(c.id)}
                disabled={answered}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  showCorrect ? 'border-success-300 bg-success-50' :
                  showResult ? 'border-danger-300 bg-danger-50' :
                  isSelected ? 'border-primary-400 bg-primary-50' :
                  'border-primary-100 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                } ${answered ? 'cursor-default' : ''}`}
              >
                <span className="mt-0.5">
                  {showCorrect ? <CheckCircle2 size={18} className="text-success-600" /> :
                   showResult ? <XCircle size={18} className="text-danger-600" /> :
                   <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-200 text-xs font-bold text-primary-400">{c.id.toUpperCase()}</span>}
                </span>
                <span className="text-sm text-ink-700/90">{c.text}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 animate-fade-in space-y-3">
            <div className={`rounded-xl p-4 ${selectedChoice?.correct ? 'bg-success-50' : 'bg-danger-50'}`}>
              <p className="text-sm font-semibold text-ink-900">{selectedChoice?.correct ? 'Correct!' : 'Not quite.'}</p>
              <p className="mt-1 text-sm text-ink-700/80">{selectedChoice?.explanation}</p>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl bg-primary-50 p-3">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-primary-600" />
              <p className="text-sm text-ink-700/80">{scenario.tip}</p>
            </div>
            <button onClick={next} className="btn-primary">
              {index + 1 >= SCENARIOS.length ? 'See your score' : 'Next scenario'} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
