// Scam Simulator scenarios — interactive multiple-choice training.

export interface Choice {
  id: string;
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  situation: string;
  question: string;
  choices: Choice[];
  tip: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'sms-1',
    title: 'The "Delivery" SMS',
    emoji: '📦',
    situation: 'You get an SMS: "Your parcel is on hold. Pay ₹35 customs charge now to release it: bit.ly/customs-pay"',
    question: 'What is the safest action?',
    choices: [
      { id: 'a', text: 'Pay ₹35 — it\'s a small amount and my parcel is waiting', correct: false, explanation: 'Even ₹35 hands scammers your card or UPI details, which they then use for bigger fraud. Customs never asks for payment via a bit.ly link.' },
      { id: 'b', text: 'Open the link to check if it looks real', correct: false, explanation: 'Fake pages are designed to look real. Clicking can also install malware. Never click these links.' },
      { id: 'c', text: 'Ignore it and check the real courier app/website I used to order', correct: true, explanation: 'Correct. Track your order only through the official app or website you ordered from. Real delivery updates come there, not via random links.' },
    ],
    tip: 'Customs / "parcel on hold" SMS with a payment link is one of the most common scams in India. Always verify in the real app.',
  },
  {
    id: 'job-1',
    title: 'The "Work From Home" Offer',
    emoji: '💼',
    situation: 'A WhatsApp message: "Earn ₹5,000/day from home, no experience needed. Like YouTube videos and earn. Pay ₹499 joining fee to start."',
    question: 'What should you do?',
    choices: [
      { id: 'a', text: 'Pay ₹499 — it\'s much less than I\'d earn', correct: false, explanation: 'This is the scam. Once you pay, they may ask for more "fees", or pay you a tiny amount first to build trust before taking a larger amount.' },
      { id: 'b', text: 'Search the company name + "fraud" online first', correct: true, explanation: 'Yes. And remember: a real job never asks you to pay to start. The "like and earn" model is a well-known scam.' },
      { id: 'c', text: 'Do it but only after earning some money first', correct: false, explanation: 'Scammers often pay a small amount first to gain your trust, then trap you into a bigger "task" with a large fee. Don\'t engage at all.' },
    ],
    tip: 'Any job that asks you to pay first, or pays you to "like/click", is a scam. Report it at cybercrime.gov.in.',
  },
  {
    id: 'otp-1',
    title: 'The "Verification" Call',
    emoji: '🔐',
    situation: 'Someone calls: "I\'m from your bank. There\'s suspicious activity — I\'ll send you an OTP to verify it\'s you. Please read it out."',
    question: 'The right response is:',
    choices: [
      { id: 'a', text: 'Read out the OTP — they\'re from my bank and trying to help', correct: false, explanation: 'Never. Banks never ask for your OTP. This is a fraudster trying to use it to reset your password or transfer money.' },
      { id: 'b', text: 'Hang up and call the bank on the number from their official app', correct: true, explanation: 'Exactly. Always call back on a number you find from an official source, never one the caller gave you.' },
      { id: 'c', text: 'Ask them to prove they\'re from the bank first', correct: false, explanation: 'A scammer can "prove" anything with fake details. The safe move is to hang up and verify independently.' },
    ],
    tip: 'OTP = One-Time Password. The "O" is for you only. No one legitimate will ever ask for it.',
  },
  {
    id: 'romance-1',
    title: 'The Online "Partner"',
    emoji: '💔',
    situation: 'You\'ve been chatting with someone on Instagram for 2 weeks. They call you "my love", say they\'re a soldier abroad, and now ask you to send ₹10,000 for a "visa to come visit you".',
    question: 'What\'s the warning sign here?',
    choices: [
      { id: 'a', text: 'They\'re in the army, so it must be real', correct: false, explanation: 'Impersonating soldiers/UN peacekeepers is extremely common in romance scams. The army doesn\'t ask partners for visa money.' },
      { id: 'b', text: 'Fast affection + a money request + overseas = classic romance scam', correct: true, explanation: 'Correct on all counts. Strong feelings in days, an excuse to ask for money, and an overseas reason they "can\'t" meet — the three classic signs.' },
      { id: 'c', text: 'Only ₹10,000 is a reasonable amount for a visa', correct: false, explanation: 'The amount doesn\'t matter. Once you pay once, the requests grow. And a real visa process doesn\'t go through an Instagram contact.' },
    ],
    tip: 'Romance scammers move fast, avoid video calls, and always end up asking for money. Never send money to someone you haven\'t met in person.',
  },
  {
    id: 'blackmail-1',
    title: 'The Private Photo Threat',
    emoji: '🛑',
    situation: 'Someone you chatted with is threatening: "Send me more photos or I\'ll leak the ones you sent to your followers."',
    question: 'The best immediate step is:',
    choices: [
      { id: 'a', text: 'Send the photos so they don\'t leak the old ones', correct: false, explanation: 'Never. More photos only give them more power. The demands will not stop. This is sextortion and it is a crime.' },
      { id: 'b', text: 'Delete my account and hope it goes away', correct: false, explanation: 'You may lose evidence. Instead, save evidence first, then use platform tools to block and report.' },
      { id: 'c', text: 'Save screenshots, block the person, tell someone I trust, and report on cybercrime.gov.in', correct: true, explanation: 'Yes. Save evidence, cut contact, get support, and report. You are not at fault — the person threatening you is committing a crime.' },
    ],
    tip: 'Sextortion is illegal. Do not pay or send more. Report at cybercrime.gov.in. Reach out to iCall (9152987821) for emotional support.',
  },
  {
    id: 'impersonation-1',
    title: 'The "New Number" from a "Friend"',
    emoji: '👤',
    situation: 'A message from an unknown number: "Hi, it\'s me, I lost my phone so this is my new number. Can you send ₹2,000 urgently? I\'ll return it tomorrow."',
    question: 'How do you respond?',
    choices: [
      { id: 'a', text: 'Send it — they sound like my friend and it\'s urgent', correct: false, explanation: 'Urgency + money from a "new number" is the most common impersonation scam. Always verify.' },
      { id: 'b', text: 'Call my friend on their old number to confirm it\'s really them', correct: true, explanation: 'Right. If the old number doesn\'t work, ask a question only the real person would know. Never send money to a "new number" without verifying.' },
      { id: 'c', text: 'Send half now, half after they confirm', correct: false, explanation: 'Even half is too much without verification. Confirm identity first through a different channel.' },
    ],
    tip: 'A "new number" asking for money is a top scam. Always verify through a channel you already trust.',
  },
];
