// App shell: routing + Quick Exit overlay + double-Escape shortcut.
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import QuickExit from '@/components/QuickExit';
import Landing from '@/pages/Landing';
import { useRoute } from '@/lib/router';
import Scanner from '@/pages/Scanner';
import Guard from '@/pages/Guard';
import Simulator from '@/pages/Simulator';
import Manipulation from '@/pages/Manipulation';
import JobChecker from '@/pages/JobChecker';
import LinkChecker from '@/pages/LinkChecker';
import SafeReply from '@/pages/SafeReply';
import SafetyAssistant from '@/pages/SafetyAssistant';
import ActionPlanner from '@/pages/ActionPlanner';
import JourneyTracker from '@/pages/JourneyTracker';
import EmergencySOS from '@/pages/EmergencySOS';
import ReadinessDashboard from '@/pages/ReadinessDashboard';
import PrivacyCenter from '@/pages/PrivacyCenter';

export default function App() {
  const route = useRoute();
  const [quickExit, setQuickExit] = useState(false);

  useEffect(() => {
    let lastEscape = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscape < 600) {
          setQuickExit(true);
          lastEscape = 0;
        } else {
          lastEscape = now;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (quickExit) return <QuickExit />;

  const page = () => {
    switch (route) {
      case 'home': return <Landing />;
      case 'scanner': return <Scanner />;
      case 'guard': return <Guard />;
      case 'simulator': return <Simulator />;
      case 'manipulation': return <Manipulation />;
      case 'job': return <JobChecker />;
      case 'link': return <LinkChecker />;
      case 'reply': return <SafeReply />;
      case 'assistant': return <SafetyAssistant />;
      case 'planner': return <ActionPlanner />;
      case 'journey': return <JourneyTracker />;
      case 'sos': return <EmergencySOS />;
      case 'dashboard': return <ReadinessDashboard />;
      case 'privacy': return <PrivacyCenter onQuickExit={() => setQuickExit(true)} />;
      default: return <Landing />;
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar onQuickExit={() => setQuickExit(true)} />
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">{page()}</main>
      <footer className="border-t border-primary-100/60 bg-white/50 py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-ink-700/50">
          <p>NariShield is an educational safety tool, not a substitute for emergency services or legal advice.</p>
          <p className="mt-1">In an emergency, call 112. For cyber crime, report at cybercrime.gov.in or call 1930.</p>
        </div>
      </footer>
    </div>
  );
}
