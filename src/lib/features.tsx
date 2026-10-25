// Central feature registry — drives navigation, landing cards, and the dashboard.
import {
  ScanSearch, ShieldCheck, GraduationCap, Brain, Briefcase, Link2,
  MessageSquareReply, LifeBuoy, ClipboardList, MapPin, Siren, LayoutDashboard, Lock,
} from 'lucide-react';
import type { Route } from './router';

export interface FeatureMeta {
  route: Route;
  title: string;
  short: string;
  description: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  group: 'detect' | 'decide' | 'protect';
}

export const FEATURES: FeatureMeta[] = [
  { route: 'scanner', title: 'Scam Message Scanner', short: 'Scan a message', description: 'Paste a suspicious message and get a risk score, warning signs, and advice.', icon: ScanSearch, group: 'detect' },
  { route: 'guard', title: 'Message Guard', short: 'Blocklist & flags', description: 'Flag messages as scam or safe, and manage your local blocklist.', icon: ShieldCheck, group: 'detect' },
  { route: 'simulator', title: 'Scam Simulator', short: 'Practice spotting scams', description: 'Try realistic scam scenarios and learn to spot the red flags.', icon: GraduationCap, group: 'detect' },
  { route: 'manipulation', title: 'Manipulation Detector', short: 'Spot emotional tactics', description: 'Check a message for guilt-trips, gaslighting, and pressure tactics.', icon: Brain, group: 'detect' },
  { route: 'job', title: 'Fake Job Checker', short: 'Check a job offer', description: 'Paste a job offer or chat to check for fake-job warning signs.', icon: Briefcase, group: 'detect' },
  { route: 'link', title: 'Link Checker', short: 'Check a link', description: 'Check a web address for suspicious patterns — without claiming it is safe.', icon: Link2, group: 'detect' },
  { route: 'reply', title: 'Safe Reply Generator', short: 'Firm, polite replies', description: 'Generate a clear reply to a suspicious message. Copy with one tap.', icon: MessageSquareReply, group: 'decide' },
  { route: 'assistant', title: 'Safety Assistant', short: 'Guidance for abuse', description: 'Practical, supportive guidance for blackmail, harassment, and threats.', icon: LifeBuoy, group: 'decide' },
  { route: 'planner', title: 'Action Planner', short: 'Build a safety plan', description: 'Answer a few questions and get a personal safety checklist.', icon: ClipboardList, group: 'decide' },
  { route: 'journey', title: 'Safe Journey Tracker', short: 'Check-ins & contacts', description: 'Optional check-ins and trusted-contact details for when you travel.', icon: MapPin, group: 'protect' },
  { route: 'sos', title: 'Emergency SOS', short: '112 + trusted contacts', description: 'Quick-call shortcut to 112, your trusted contacts, and clear instructions.', icon: Siren, group: 'protect' },
  { route: 'dashboard', title: 'Readiness Dashboard', short: 'Your safety score', description: 'See your safety readiness score and track your progress.', icon: LayoutDashboard, group: 'protect' },
  { route: 'privacy', title: 'Privacy Center', short: 'Your data, your control', description: 'See what is stored and manage your data. Includes Quick Exit.', icon: Lock, group: 'protect' },
];

export const GROUP_LABELS: Record<FeatureMeta['group'], string> = {
  detect: 'Detect',
  decide: 'Decide',
  protect: 'Protect',
};
