// Shared definition of safety "readiness" tasks. Used by both the
// Action Planner (builds a checklist from a situation) and the
// Readiness Dashboard (tracks completion across all generated tasks).

export interface SafetyTask {
  id: string;
  label: string;
  detail: string;
  category: 'documents' | 'contacts' | 'digital' | 'physical' | 'legal';
}

export const ALL_TASKS: SafetyTask[] = [
  { id: 'id-copy', label: 'Keep a photocopy of your ID (Aadhaar/PAN)', detail: 'Store a copy somewhere you can reach quickly.', category: 'documents' },
  { id: 'phone-backup', label: 'Back up your phone contacts & photos', detail: 'Use cloud backup so evidence and contacts are safe even if your phone is lost.', category: 'documents' },
  { id: 'emergency-contacts', label: 'Save at least 2 trusted contacts', detail: 'People you can call any time — add them in Emergency SOS too.', category: 'contacts' },
  { id: 'helpline-numbers', label: 'Save key helpline numbers', detail: '112 (emergency), 181 (women\'s helpline), 1930 (cyber crime), 9152987821 (iCall counselling).', category: 'contacts' },
  { id: 'strong-passwords', label: 'Use strong, unique passwords', detail: 'Different password for each important account. Use a password manager if possible.', category: 'digital' },
  { id: '2fa', label: 'Turn on two-step verification', detail: 'Enable 2FA on email, banking, and social accounts.', category: 'digital' },
  { id: 'check-privacy', label: 'Review social media privacy settings', detail: 'Limit who can see your photos, location, and contact info.', category: 'digital' },
  { id: 'block-suspicious', label: 'Block suspicious senders', detail: 'Use NariShield\'s Message Guard to keep your local blocklist.', category: 'digital' },
  { id: 'location-off', label: 'Turn off live location sharing', detail: 'Don\'t share your live location with people you don\'t fully trust.', category: 'digital' },
  { id: 'share-location-trusted', label: 'Share live location with 1 trusted person', detail: 'When travelling, let one trusted person know your route.', category: 'physical' },
  { id: 'safe-route', label: 'Note a safe, well-lit route for regular travel', detail: 'Know which streets have people and shops open late.', category: 'physical' },
  { id: 'transport-apps', label: 'Keep verified transport apps ready', detail: 'Ride apps with trip-sharing, and the driver\'s details visible.', category: 'physical' },
  { id: 'charged-phone', label: 'Carry a charged power bank', detail: 'Your phone is your safety line — keep it powered.', category: 'physical' },
  { id: 'evidence-screenshots', label: 'Save screenshots of threats or abuse', detail: 'Screenshot + note the date and the sender\'s number. Keep them in a safe folder.', category: 'legal' },
  { id: 'know-cyber-portal', label: 'Know how to report cyber crime', detail: 'cybercrime.gov.in or call 1930. Save the link.', category: 'legal' },
  { id: 'know-women-helpline', label: 'Know the women\'s helpline', detail: '181 is the 24x7 women\'s helpline. 112 for emergencies.', category: 'legal' },
  { id: 'bank-hotline', label: 'Save your bank\'s fraud hotline', detail: 'So you can block your card instantly if needed.', category: 'legal' },
];

export type Situation =
  | 'online-harassment'
  | 'blackmail'
  | 'domestic'
  | 'traveling'
  | 'new-online'
  | 'general';

export interface SituationInfo {
  id: Situation;
  label: string;
  description: string;
  taskIds: string[];
}

export const SITUATIONS: SituationInfo[] = [
  {
    id: 'online-harassment',
    label: 'Facing online harassment or abuse',
    description: 'Someone is sending abusive, threatening, or unwanted messages online.',
    taskIds: ['evidence-screenshots', 'block-suspicious', 'helpline-numbers', 'know-cyber-portal', 'check-privacy', 'emergency-contacts', 'strong-passwords', 'know-women-helpline'],
  },
  {
    id: 'blackmail',
    label: 'Being blackmailed (photos, videos, secrets)',
    description: 'Someone is threatening to leak private material unless you do what they say.',
    taskIds: ['evidence-screenshots', 'helpline-numbers', 'know-cyber-portal', 'know-women-helpline', 'emergency-contacts', 'bank-hotline', 'phone-backup', 'check-privacy'],
  },
  {
    id: 'domestic',
    label: 'Feeling unsafe at home',
    description: 'Concerns about a partner, family member, or someone you live with.',
    taskIds: ['emergency-contacts', 'helpline-numbers', 'know-women-helpline', 'evidence-screenshots', 'id-copy', 'bank-hotline', 'charged-phone', 'share-location-trusted'],
  },
  {
    id: 'traveling',
    label: 'Travelling alone soon',
    description: 'You\'re planning a journey and want to be prepared.',
    taskIds: ['share-location-trusted', 'safe-route', 'transport-apps', 'charged-phone', 'emergency-contacts', 'helpline-numbers', 'phone-backup', 'id-copy'],
  },
  {
    id: 'new-online',
    label: 'New to online apps / social media',
    description: 'You want to set up safe habits as you start using apps more.',
    taskIds: ['strong-passwords', '2fa', 'check-privacy', 'location-off', 'block-suspicious', 'helpline-numbers', 'know-cyber-portal', 'phone-backup'],
  },
  {
    id: 'general',
    label: 'General safety preparedness',
    description: 'Build a strong everyday safety baseline.',
    taskIds: ['emergency-contacts', 'helpline-numbers', 'strong-passwords', '2fa', 'check-privacy', 'id-copy', 'phone-backup', 'charged-phone', 'evidence-screenshots', 'know-cyber-portal'],
  },
];

export function tasksForSituation(id: Situation): SafetyTask[] {
  const info = SITUATIONS.find((s) => s.id === id);
  if (!info) return [];
  return info.taskIds.map((tid) => ALL_TASKS.find((t) => t.id === tid)!).filter(Boolean);
}
