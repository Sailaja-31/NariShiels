// Safety Assistant — supportive, practical guidance for abuse situations.
// This is educational content, not a substitute for professional or legal help.

export interface SafetyTopic {
  id: string;
  label: string;
  emoji: string;
  summary: string;
  immediate: string[];   // do right now
  next: string[];        // do in the next few hours/days
  remember: string;      // one-line reassurance
  resources: { label: string; detail: string }[];
}

export const SAFETY_TOPICS: SafetyTopic[] = [
  {
    id: 'blackmail',
    label: 'Blackmail / Sextortion',
    emoji: '🛑',
    summary: 'Someone is threatening to share private photos, videos, or information unless you do what they say. This is a crime, and you are not at fault.',
    immediate: [
      'Do not send more photos, videos, or money. More will not make them stop — it gives them more power.',
      'Do not delete the messages. Take screenshots that show the sender\'s number/username and the date.',
      'Do not reply or argue. One clear "Stop contacting me" is enough, then silence.',
      'Block the person on the platform where they contacted you.',
    ],
    next: [
      'Report to the National Cyber Crime portal: cybercrime.gov.in, or call 1930 for financial fraud.',
      'Tell at least one person you trust. You do not have to handle this alone.',
      'Use the platform\'s report tool for the threatening messages.',
      'Consider reporting to your local police cyber cell with your evidence.',
    ],
    remember: 'Threatening to share private images is their crime, not your shame. You are not alone.',
    resources: [
      { label: 'National Cyber Crime', detail: 'cybercrime.gov.in  |  1930 (financial fraud)' },
      { label: 'iCall counselling', detail: '9152987821 — free, confidential, Mon–Sat 8am–10pm' },
      { label: 'Women\'s Helpline', detail: '181 (24x7)' },
    ],
  },
  {
    id: 'harassment',
    label: 'Online Harassment / Trolling',
    emoji: '💬',
    summary: 'Repeated unwanted messages, abusive comments, or being targeted by many accounts online.',
    immediate: [
      'Take screenshots of the abuse, including usernames and dates, before you block anyone.',
      'Block and report the accounts on the platform.',
      'Turn off message requests and restrict who can comment/DM you in the platform\'s privacy settings.',
      'Do not engage or argue — engagement is often what the harasser wants.',
    ],
    next: [
      'If it is organised targeting (many accounts), report to cybercrime.gov.in.',
      'Tell friends or family so you have support — harassment is exhausting and you don\'t have to face it alone.',
      'Consider taking a break from the platform for your mental health.',
      'If threats of violence appear, report to police with your screenshots.',
    ],
    remember: 'Being harassed is not your fault, and you have the right to a safe online space.',
    resources: [
      { label: 'cybercrime.gov.in', detail: 'Report online harassment and threats' },
      { label: 'iCall', detail: '9152987821 — emotional support' },
      { label: 'Women\'s Helpline', detail: '181' },
    ],
  },
  {
    id: 'threats',
    label: 'Threats of Violence',
    emoji: '⚠️',
    summary: 'Someone is threatening to hurt you or someone you care about. Take all threats seriously.',
    immediate: [
      'If you are in immediate danger, call 112 (or 100).',
      'Save the threat — screenshot, note the time, and note who said it if you know them.',
      'Get to a safe place or to people you trust if you can.',
      'Tell at least two people what is happening.',
    ],
    next: [
      'File a report at your nearest police station with your evidence. Threats are a criminal offence.',
      'Inform someone at your workplace or institution if the threatener knows where you go.',
      'Set up a check-in routine with a trusted contact (see the Safe Journey Tracker).',
      'If the threat is from someone you live with, contact a women\'s helpline (181) about shelter options.',
    ],
    remember: 'A threat is a crime. You deserve protection, and help is available.',
    resources: [
      { label: 'Emergency', detail: '112 (all-India, 24x7)' },
      { label: 'Women\'s Helpline', detail: '181 (24x7)' },
      { label: 'Police', detail: '100  |  nearest police station' },
    ],
  },
  {
    id: 'stalking',
    label: 'Stalking or Persistent Contact',
    emoji: '👁️',
    summary: 'Someone keeps contacting you, following you, or showing up even after you have said no.',
    immediate: [
      'Tell the person once, clearly, in writing: "Do not contact me again." Then stop responding.',
      'Save every attempt they make to reach you — every message, call log, and sighting with date and time.',
      'Do not meet them alone or in private, ever, even if they say it\'s "to talk".',
      'Tell people around you — family, friends, workplace security, your college — so they can watch for them.',
    ],
    next: [
      'File a police complaint. Stalking is a criminal offence in India (Section 354D IPC).',
      'Vary your routine and routes so your movements are less predictable.',
      'Check your social media privacy and turn off location sharing.',
      'Share your live location with one trusted person when you move (Safe Journey Tracker can help).',
    ],
    remember: 'Stalking is a crime, not flattery. Your "no" is enough.',
    resources: [
      { label: 'Emergency', detail: '112' },
      { label: 'Women\'s Helpline', detail: '181' },
      { label: 'cybercrime.gov.in', detail: 'For online stalking components' },
    ],
  },
  {
    id: 'domestic',
    label: 'Abuse at Home',
    emoji: '🏠',
    summary: 'Feeling unsafe where you live — with a partner or family member. There is help, and you are not alone.',
    immediate: [
      'If you are in immediate danger, call 112 or move to a room near an exit.',
      'Keep your phone charged and with you, and keep some money and your ID somewhere you can grab quickly.',
      'Identify a trusted person you can call or go to.',
      'Note unsafe patterns quietly — dates and what happened — and keep them somewhere the person cannot access.',
    ],
    next: [
      'Call the Women\'s Helpline 181 — they can advise on shelters, legal aid, and counselling.',
      'Contact a local NGO supporting women (Shakti Shalini, Sneha, or state women\'s commissions).',
      'Keep copies of important documents outside the home (with a friend or in cloud storage).',
      'Talk to a counsellor — iCall 9152987821 offers free, confidential support.',
    ],
    remember: 'Abuse is never your fault. Leaving is a process, and support exists for every step.',
    resources: [
      { label: 'Women\'s Helpline', detail: '181 (24x7, all-India)' },
      { label: 'Emergency', detail: '112' },
      { label: 'iCall', detail: '9152987821 — counselling' },
    ],
  },
  {
    id: 'revenge-porn',
    label: 'Private Images Shared Online',
    emoji: '📷',
    summary: 'Someone has shared (or is threatening to share) intimate images of you without consent. This is a crime.',
    immediate: [
      'Do not pay or give in to demands. Report instead.',
      'Screenshot the posts/messages and the account that shared them.',
      'Use the platform\'s report tool — most have a specific "intimate image" / "non-consensual content" option that removes content quickly.',
      'Do not contact the sharer directly.',
    ],
    next: [
      'Report to cybercrime.gov.in — they have a dedicated portal for this (Report Women/Child Related Crime).',
      'You can also approach the cyber cell of your local police.',
      'Tell someone you trust for emotional support.',
      'Reach out to iCall (9152987821) — this is traumatic and you deserve support.',
    ],
    remember: 'Sharing private images without consent is their crime. The shame is theirs, not yours.',
    resources: [
      { label: 'cybercrime.gov.in', detail: 'Women/child-related crime report' },
      { label: 'Women\'s Helpline', detail: '181' },
      { label: 'iCall', detail: '9152987821' },
    ],
  },
];
