// Scam / manipulation detection engine.
// Heuristic, rule-based — produces an *estimate*, never a definitive verdict.

export type RiskLevel = 'low' | 'medium' | 'high';

export interface WarningSign {
  id: string;
  label: string;
  detail: string;
  weight: number; // contribution to the risk score
}

export interface ScanResult {
  score: number; // 0-100
  level: RiskLevel;
  signs: WarningSign[];
  advice: string[];
}

interface Rule {
  id: string;
  label: string;
  detail: string;
  weight: number;
  // returns true if the rule fires on the given text
  test: (t: string, lower: string) => boolean;
}

// --- Rule definitions -------------------------------------------------

const urgencyWords =
  /(immediately|urgent|right now|asap|last chance|today only|within \d+ (?:hour|minute|day)|expires (?:today|in \d+)|before midnight|act now|hurry|don'?t wait)/;
const moneyWords =
  /(₹\s?\d|\bpayment\b|\btransfer\b|\bupi\b|\bpaytm\b|\bgpay\b|\bphonepe\b|\bbank account\b|\baccount number\b|\bifsc\b|\bdeposit\b|\bfee\b|\bregistration fee\b|\bprocessing fee\b|\bshipping fee\b|\brefund\b|\bwin\b|\bwon\b|\bprize\b|\blottery\b|\bgift card\b|\bcrypto\b|\bbitcoin\b|\binvestment\b|\bdoubled?\b)/;
const threatWords =
  /(blackmail|leak(?:ing|ed)? (?:your |the )?(?:photos?|videos?|messages?|data)|post (?:your )?(?:photos?|videos?|nudes?|private)|send (?:your )?(?:nudes?|photos?|videos?)|expose you|ruin (?:your )?(?:reputation|life|family|career)|tell (?:your )?(?:family|husband|parents|boss)|hack(?:ed|ing)? (?:your )?(?:phone|account|camera)|kms|harm (?:you|your family)|kill you|threaten)/;
const authorityWords =
  /(i am (?:a |an )?(?:police|officer|agent|manager|executive|representative|official|inspector|from (?:the )?(?:bank|rbi|income tax|customs|cyber cell))|on behalf of|this is (?:from|an? )?(?:the )?(?:bank|rbi|income tax|customs|cyber cell|headquarters)|official (?:notice|warning|alert|message)|your (?:account|card|number|pan|aadhaar) (?:is )?(?:blocked|suspended|locked|frozen|under review))/;
const credentialWords =
  /(otp|one time password|password|pin|cvv|card number|expiry date|login (?:details|credentials)|verify (?:your )?(?:account|identity|number)|confirm (?:your )?(?:account|identity|number|details)|update (?:your )?(?:details|info|kyc|pan|aadhaar)|kyc (?:update|verification|failed|pending))/;
const linkPattern =
  /(https?:\/\/|www\.|[a-z0-9-]+\.(?:com|in|net|org|co|io|xyz|tk|ml|ga|cf|info|biz|cc)\b|bit\.ly|tinyurl|t\.co|goo\.gl|rebrand\.ly|shorte\.st)/i;
const suspiciousDomain =
  /(free|gift|win|prize|offer|deal|cheap|bonus|claim|reward|verify|update|secure|login|account|support|service|alert|notice|confirm|check|collect|delivery|parcel|customs)/i;
const romanceWords =
  /(love you|miss you|my dear|sweetheart|baby|darling|i? fallen? in love|soul ?mate|my (?:future )?(?:wife|husband|partner)|send (?:me )?(?:money|a (?:gift|card))|i'?ll (?:come|visit) (?:to )?(?:see )?you|my (?:wife|husband) (?:died|passed)|i'?m a (?:widow|widower|doctor|soldier|military|army|un (?:soldier|peacekeeper))|stuck (?:in|at) (?:the )?(?:airport|customs|lagos|nigeria|dubai|hotel))/;
const jobWords =
  /(work from home|part time job|earning (?:opportunity|offer)|earn (?:₹|\$|rs\.?|upto|up to)|(?:high )?salary (?:offer|package)|no (?:experience|interview) (?:needed|required)|easy money|typing job|data entry job|whatsapp job|like (?:and )?earn|click (?:and )?earn|commission (?:based|job)|joining bonus|seat (?:booking|reserved)|limited (?:seats|vacancies)|recruitment (?:officer|drive)|hiring now|urgent hiring)/;
const flatteryWords =
  /(congratulations|you have been (?:selected|chosen|shortlisted)|lucky (?:user|winner|customer)|you (?:are|re) (?:our )?(?:winner|lucky)|special (?:offer|customer)|exclusive (?:offer|deal|invitation)|you (?:won|have won|have been awarded))/;
const impersonationWords =
  /(this is (?:your )?(?:boss|manager|hr|ceo|colleague|friend|uncle|aunty|cousin|relative)|it'?s me|new number|i lost my (?:phone|number)|saved (?:my )?number\?|this is (?:amazon|flipkart|snapchat|whatsapp|telegram|instagram|facebook|microsoft|google) (?:support|team|security))/;

const RULES: Rule[] = [
  { id: 'urgency', label: 'Creates false urgency', detail: 'Pressures you to act immediately so you can\'t think clearly.', weight: 15, test: (_t, l) => urgencyWords.test(l) },
  { id: 'money', label: 'Asks for money or payment', detail: 'Mentions payments, fees, UPI, bank details, prizes, or investments.', weight: 20, test: (_t, l) => moneyWords.test(l) },
  { id: 'threat', label: 'Threatens or blackmails you', detail: 'Threatens to leak private material or harm you or your family.', weight: 30, test: (_t, l) => threatWords.test(l) },
  { id: 'authority', label: 'Impersonates authority', detail: 'Claims to be police, bank, RBI, government, or a company official.', weight: 18, test: (_t, l) => authorityWords.test(l) },
  { id: 'credentials', label: 'Requests OTP / passwords / KYC', detail: 'No real institution ever asks for OTP, PIN, CVV, or passwords.', weight: 25, test: (_t, l) => credentialWords.test(l) },
  { id: 'link', label: 'Contains a link', detail: 'Links can lead to fake login pages or install malware. Examine any link carefully.', weight: 10, test: (t) => linkPattern.test(t) },
  { id: 'suspicious-link', label: 'Link looks like a trap', detail: 'The link domain contains words scammers often use (free, gift, verify, claim, etc.).', weight: 12, test: (t) => linkPattern.test(t) && suspiciousDomain.test(t) },
  { id: 'romance', label: 'Romance / advance-fee pattern', detail: 'Fast affection from a stranger who soon needs money or a "fee".', weight: 18, test: (_t, l) => romanceWords.test(l) },
  { id: 'job', label: 'Fake-job pattern', detail: 'Work-from-home offers, "easy money", or asks for a joining fee.', weight: 16, test: (_t, l) => jobWords.test(l) },
  { id: 'flattery', label: 'False flattery / "you won"', detail: 'Claims you were selected, won, or are a "lucky customer".', weight: 14, test: (_t, l) => flatteryWords.test(l) },
  { id: 'impersonation', label: 'Possibly impersonating someone you know', detail: '"New number", "it\'s me", or claims to be a contact from a fresh number.', weight: 10, test: (_t, l) => impersonationWords.test(l) },
  { id: 'poor-grammar', label: 'Unusual phrasing or grammar', detail: 'Strange wording can be a sign of mass-sent scam templates.', weight: 5, test: (t) => {
    // very short or full of ALL CAPS words and excessive exclamation
    const caps = (t.match(/[A-Z]{4,}/g) || []).length;
    const excl = (t.match(/!/g) || []).length;
    const emojis = (t.match(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || []).length;
    return caps >= 2 || excl >= 3 || emojis >= 4;
  }},
  { id: 'too-good', label: 'Sounds too good to be true', detail: 'Big rewards for little effort almost always hide a scam.', weight: 10, test: (_t, l) => /(free|guaranteed|100%|risk.?free|no risk|double your|earn \d+|salary of \d+)/.test(l) },
];

function adviceFor(signs: WarningSign[]): string[] {
  const out: string[] = [];
  const ids = new Set(signs.map((s) => s.id));

  out.push('Do not share any OTP, password, PIN, CVV, or Aadhaar number with anyone. No genuine institution will ask for these.');
  if (ids.has('money') || ids.has('credentials'))
    out.push('Do not make any payment or transfer. Stop and verify through an official channel you trust (a known phone number or app), not the one in the message.');
  if (ids.has('link'))
    out.push('Do not click the link. If you must check, type the real website address yourself in the browser instead.');
  if (ids.has('threat'))
    out.push('Threats to leak photos or videos are a crime. Save evidence (screenshots + the sender\'s number), tell someone you trust, and report to cybercrime.gov.in or call 1930. You are not alone and you are not at fault.');
  if (ids.has('authority') || ids.has('impersonation'))
    out.push('Verify the person independently. Call back on a number you already had, not one they just gave you.');
  if (ids.has('romance'))
    out.push('Be cautious of strangers who express strong feelings quickly and then ask for money — this is a classic romance scam.');
  if (ids.has('job'))
    out.push('Genuine employers do not ask for a joining fee, and do not offer large earnings for "liking" or "clicking". Search the company name + "fraud" online.');
  if (ids.has('urgency'))
    out.push('Slow down. Urgency is a manipulation tactic designed to stop you from thinking. Take 10 minutes before doing anything.');

  out.push('When in doubt, talk to someone you trust before acting.');
  return out;
}

export function scanMessage(text: string): ScanResult {
  const trimmed = text.trim();
  if (!trimmed) return { score: 0, level: 'low', signs: [], advice: [] };
  const lower = trimmed.toLowerCase();

  const signs: WarningSign[] = RULES.filter((r) => r.test(trimmed, lower)).map((r) => ({
    id: r.id,
    label: r.label,
    detail: r.detail,
    weight: r.weight,
  }));

  const raw = signs.reduce((sum, s) => sum + s.weight, 0);
  // gentle diminishing returns so multiple signs cap out near 100
  const score = Math.min(100, Math.round(raw * (1 - (raw * 0.004))));

  let level: RiskLevel = 'low';
  if (score >= 55) level = 'high';
  else if (score >= 25) level = 'medium';

  return { score, level, signs, advice: adviceFor(signs) };
}

// --- Manipulation detector (broader emotional patterns) -----------------

export interface ManipulationSign {
  id: string;
  label: string;
  detail: string;
}

const MANIPULATION_RULES: { id: string; label: string; detail: string; test: (l: string) => boolean }[] = [
  { id: 'guilt', label: 'Guilt-tripping', detail: 'Makes you feel responsible for their feelings or problems ("after all I did for you", "you\'re the only one who…").', test: (l) => /(after all i(?:'ve| have)? done|you'?re the only (?:one|person) who|if you really (?:loved|cared)|how could you|i (?:thought|trusted) you|because of you|you made me)/.test(l) },
  { id: 'gaslighting', label: 'Possible gaslighting', detail: 'Denies things you know happened, or insists you\'re misremembering or "crazy".', test: (l) => /(you'?re (?:imagining|crazy|overreact(?:ing|ive)|paranoid|too sensitive)|that never happened|you'?re misremembering|i never said that|you'?re making it up|it'?s all in your head|stop (?:being|acting) dramatic)/.test(l) },
  { id: 'isolation', label: 'Isolation tactics', detail: 'Tries to cut you off from friends, family, or support.', test: (l) => /(don'?t (?:talk|listen) to (?:them|your (?:family|friends|parents))|they'?re (?:just )?(?:jealous|against us|trying to (?:ruin|break) us)|i'?m the only one who (?:understands|gets|loves) you|choose (?:me|us) (?:over|instead of) (?:them|your (?:family|friends)))/.test(l) },
  { id: 'ultimatum', label: 'Ultimatums / threats to leave', detail: 'Forces a choice with consequences ("do this or I\'ll leave / hurt myself").', test: (l) => /(if you don'?t|i'?ll (?:leave|go|end it|kill myself|hurt myself|never speak)|it'?s (?:me|them|this) or|last (?:chance|warning)|or else)/.test(l) },
  { id: 'lovebombing', label: 'Love-bombing / pressure', detail: 'Overwhelming affection, rapid commitment, or pressure to commit fast.', test: (l) => /(you'?re my (?:soulmate|everything|entire world|only reason)|i (?:can'?t|cannot) live without|marry me (?:now|today)|move in (?:with me|together) (?:now|today)|i (?:love|adore) you (?:so )?much.*after.*(?:day|week|hour|met))/.test(l) },
  { id: 'pressure', label: 'Pressure for photos / intimacy', detail: 'Repeatedly pushes for private photos, videos, or physical contact after you said no.', test: (l) => /(send (?:me )?(?:a )?(?:pic|photo|picture|nude|video)|just one (?:photo|pic)|everyone does it|if you (?:loved|trusted) me you'?d|don'?t be (?:shy|a prude)|prove (?:it|you (?:love|trust) me))/.test(l) },
  { id: 'financial-control', label: 'Financial control', detail: 'Tries to control your money, accounts, or asks you to hand over access.', test: (l) => /(give me (?:your )?(?:card|pin|password|otp|upi)|send (?:me )?(?:money|₹|cash)|transfer (?:to|into) (?:my|the) account|i'?ll (?:manage|handle) (?:your )?(?:money|account|salary)|you don'?t need (?:your own )?(?:money|account|bank))/.test(l) },
  { id: 'threat', label: 'Direct threats or blackmail', detail: 'Threatens to harm you, themselves, or to expose you.', test: (l) => /(i'?ll (?:hurt|kill|ruin|expose|leak|post)|threaten|blackmail|do what i say or|i (?:will|'ll) (?:show|send|post) (?:everyone|your (?:family|parents|husband))) /.test(l) },
];

export function detectManipulation(text: string): { signs: ManipulationSign[]; advice: string[] } {
  const lower = text.toLowerCase();
  const signs = MANIPULATION_RULES.filter((r) => r.test(lower)).map((r) => ({ id: r.id, label: r.label, detail: r.detail }));
  const advice: string[] = [];
  if (signs.length === 0) {
    return { signs, advice: ['No strong manipulation patterns were detected in this text. This is only an estimate — trust your instincts if something feels off.'] };
  }
  advice.push('These patterns can be signs of emotional abuse. You do not have to respond immediately, and you are not responsible for the other person\'s reactions.');
  if (signs.some((s) => s.id === 'threat'))
    advice.push('Threats and blackmail are illegal. Save evidence (screenshots, messages, the person\'s number). Report to cybercrime.gov.in or call 1930 for financial fraud, and tell someone you trust.');
  if (signs.some((s) => s.id === 'pressure'))
    advice.push('You never owe anyone private photos. Sharing private images without consent is a crime. Say no clearly once, then stop engaging.');
  if (signs.some((s) => s.id === 'gaslighting') || signs.some((s) => s.id === 'isolation'))
    advice.push('Reconnect with people you trust. Keeping a private record of what actually happened can help counter gaslighting.');
  advice.push('Consider talking to a counsellor or a women\'s helpline — iCall (9152987821) offers free, confidential support.');
  return { signs, advice };
}

// --- Fake job checker --------------------------------------------------

export interface JobSign {
  id: string;
  label: string;
  detail: string;
}

const JOB_RULES: { id: string; label: string; detail: string; test: (l: string) => boolean }[] = [
  { id: 'fee', label: 'Asks for a fee upfront', detail: 'Real employers pay you. Any "registration", "security", "training", or "refundable" fee is a red flag.', test: (l) => /(registration fee|security deposit|joining fee|training fee|refundable (?:fee|deposit)|pay (?:₹|rs\.?|rs)\s?\d|pay (?:a )?(?:small )?fee|fee (?:of|is) ₹)/.test(l) },
  { id: 'easy-money', label: '"Easy money" / no skills needed', detail: 'No genuine job pays well for liking posts, watching ads, or clicking links.', test: (l) => /(easy money|no (?:experience|skills|interview) (?:needed|required)|like (?:and|posts?) (?:and )?(?:earn|money)|click (?:and )?(?:earn|money)|watch (?:ads|videos) (?:and )?earn|whatsapp (?:job|earning)|typing job|data entry (?:job|work))/ .test(l) },
  { id: 'huge-salary', label: 'Salary sounds unrealistically high', detail: 'Offers of ₹30k–₹1lakh/week for simple tasks are almost always scams.', test: (l) => /(earn (?:upto|up to|₹|rs\.?)\s?\d{4,}|salary (?:of|upto|up to) (?:₹|rs\.?)\s?\d{4,}|₹\s?\d{2,4}[,.\s]?\d{3}\s?(?:per|\/) (?:day|week|hour)|(?:daily|weekly) (?:income|earning|payout) of)/.test(l) },
  { id: 'telegram-whatsapp', label: 'Only communicates on WhatsApp/Telegram', detail: 'Legitimate companies use official email and portals, not only chat apps.', test: (l) => /(whatsapp (?:only|us at|message)|telegram (?:only|us at|message)|message (?:me|us) on (?:whatsapp|telegram)|contact (?:via|on) (?:whatsapp|telegram))/ .test(l) },
  { id: 'urgency', label: 'Urgency / limited seats', detail: '"Limited seats", "today only", or pressure to join immediately.', test: (l) => /(limited (?:seats|vacancies|positions)|today only|hurry|urgent (?:hiring|required)|seat (?:reserved|booking)|join (?:now|today|immediately)|first come first)/.test(l) },
  { id: 'no-interview', label: 'No interview / no verification', detail: 'A real job involves an interview and verification in both directions.', test: (l) => /(no interview|no (?:resume|cv) needed|join directly|no (?:qualification|experience) (?:needed|required))/ .test(l) },
  { id: 'vague-company', label: 'Vague or no company identity', detail: 'No clear company name, website, address, or official email domain.', test: (l) => !/@[a-z0-9.-]+\.(com|in|org|net|co)/.test(l) && /(work from home|part time|earning opportunity|hiring)/.test(l) },
  { id: 'overseas', label: 'Overseas "recruiter" without process', detail: 'Foreign job offers that skip embassies, verified agencies, or proper visas are common scams.', test: (l) => /(job in (?:dubai|abu dhabi|uk|usa|canada|australia|singapore|qatar|saudi)|foreign (?:job|placement)|visa (?:fee|charges)|recruitment (?:agent|agency) (?:fee|charges))/ .test(l) },
];

export function checkJob(text: string): { signs: JobSign[]; advice: string[] } {
  const lower = text.toLowerCase();
  const signs = JOB_RULES.filter((r) => r.test(lower)).map((r) => ({ id: r.id, label: r.label, detail: r.detail }));
  const advice: string[] = [];
  if (signs.length === 0) {
    return { signs, advice: ['No strong fake-job signals were found. Still, verify the company on official sites and never pay to get a job. This is only an estimate.'] };
  }
  advice.push('Do not pay any fee — no matter how small or "refundable". A real job never requires you to pay first.');
  advice.push('Search the company name online with the word "fraud" or "scam" and check reviews on independent sites.');
  advice.push('A genuine recruiter uses a company email (name@company.com), not a free Gmail/Yahoo address or only WhatsApp.');
  if (signs.some((s) => s.id === 'overseas')) advice.push('For overseas jobs, verify through the eMigrate portal (emigrate.gov.in) and the Indian embassy. Never pay visa fees to an unknown agent.');
  advice.push('Report job fraud at cybercrime.gov.in or call 1930 if you have already paid.');
  return { signs, advice };
}

// --- Link checker ------------------------------------------------------

export interface LinkSign {
  id: string;
  label: string;
  detail: string;
}

export function checkLink(input: string): { signs: LinkSign[]; advice: string[]; url: string | null } {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/(https?:\/\/)?([\w-]+\.)*([\w-]+)\.([\w]{2,})([^\s]*)?/i);
  const advice: string[] = [];
  if (!urlMatch) {
    return { signs: [], advice: ['No web address was found in what you entered. Paste a full link (https://…) to check.'], url: null };
  }
  const url = urlMatch[0];
  const lower = url.toLowerCase();
  const signs: LinkSign[] = [];

  if (/^https:\/\//.test(url) === false && /^http:\/\//.test(url) === false) {
    signs.push({ id: 'no-https', label: 'No secure (https) prefix', detail: 'Links without https are sent unencrypted. Be cautious before entering any information.' });
  }
  if (/bit\.ly|tinyurl|t\.co|goo\.gl|rebrand\.ly|shorte\.st|cutt\.ly|is\.gd|buff\.ly/.test(lower)) {
    signs.push({ id: 'shortener', label: 'Shortened link', detail: 'Short links hide the real destination. Use a link expander (e.g. unshorten.it) before clicking.' });
  }
  const suspiciousTld = /\.(tk|ml|ga|cf|xyz|info|biz|cc|top|work|date|review)$/i.test(lower);
  if (suspiciousTld) signs.push({ id: 'odd-tld', label: 'Unusual domain ending', detail: 'Scammers often use cheap or unusual domain endings (.tk, .ml, .xyz, etc.).' });
  if (/(free|gift|win|prize|offer|deal|cheap|bonus|claim|reward|verify|update|secure|login|account|support|service|alert|notice|confirm|check|collect|delivery|parcel|customs|refund|bank|rbi|sbi|amazon|flipkart|paytm|phonepe)/.test(lower)) {
    signs.push({ id: 'keyword', label: 'Domain contains common scam keywords', detail: 'Words like "verify", "claim", "free", or a brand name in a random domain are warning signs.' });
  }
  // misspelled brand detection (simple)
  const brands = ['amazon', 'flipkart', 'paytm', 'phonepe', 'google', 'facebook', 'instagram', 'whatsapp', 'snapchat', 'sbi', 'hdfc', 'icici', 'axis'];
  for (const b of brands) {
    const variants = [b.replace(/(.)(.)/, '$1'), b + 's', b + 'inc', b + 'online', b + 'india', 'my' + b, 'the' + b];
    if (lower.includes(b) === false && variants.some((v) => lower.includes(v))) {
      signs.push({ id: 'typo', label: 'Possible misspelled brand', detail: `Looks like a near-misspelling of "${b}". Check spelling carefully — scammers rely on typos.` });
      break;
    }
  }
  const subdomainCount = (lower.match(/\./g) || []).length;
  if (subdomainCount >= 4) signs.push({ id: 'many-dots', label: 'Many subdomains / dots', detail: 'Lots of dots can hide the real domain. The real site is just before the last domain ending.' });
  if (/(\d{1,3}\.){3}\d{1,3}/.test(lower)) signs.push({ id: 'ip', label: 'Uses a raw IP address', detail: 'Legitimate services use domain names, not raw numbers.' });
  if (/@/.test(lower)) signs.push({ id: 'at-sign', label: 'Contains an @ symbol', detail: 'An @ in a URL can hide the real destination (anything before @ is ignored by browsers).' });

  if (signs.length === 0) {
    advice.push('No obvious warning signs were found in the link text. This does NOT mean the link is safe — it only means our pattern check did not flag it.');
  } else {
    if (signs.some((s) => s.id === 'typo')) advice.push('Check the spelling letter by letter against the real website. Scammers swap one letter (e.g. amaz0n.com) to fool you.');
    if (signs.some((s) => s.id === 'shortener')) advice.push('Expand the short link with an unshorten service before visiting, or just don\'t click it.');
    advice.push('When in doubt, type the official website name yourself in the browser instead of clicking the link.');
    advice.push('Never enter bank details, OTP, or passwords on a page you reached through a link in a message.');
  }
  return { signs, advice, url };
}

// --- Safe reply generator ----------------------------------------------

export function generateReply(message: string, tone: 'firm' | 'polite' | 'busy'): string {
  const lower = message.toLowerCase();
  const asksMoney = /(₹|payment|upi|pay|fee|transfer|bank|account|otp|refund)/.test(lower);
  const asksInfo = /(otp|password|pin|aadhaar|pan|kyc|details|verify|confirm|account number)/.test(lower);
  const asksPhoto = /(photo|pic|picture|nude|video|send (?:me )?(?:a )?)/.test(lower);
  const threatens = /(leak|expose|post|ruin|threat|blackmail|harm|tell your)/.test(lower);

  const intros: Record<string, string> = {
    firm: 'I need to be clear:',
    polite: 'Thank you for reaching out, but',
    busy: 'I can\'t engage with this right now.',
  };

  const body: string[] = [];
  if (asksInfo) body.push('I will never share OTPs, passwords, or personal details over a message.');
  if (asksMoney) body.push('I will not make any payment or transfer to someone I have not independently verified.');
  if (asksPhoto) body.push('I am not comfortable sharing photos or videos, and I will not do so.');
  if (threatens) body.push('Threats to share private material are a crime, and I will report them with evidence.');
  if (body.length === 0) body.push('I am not interested and I\'d like you to stop contacting me.');

  const close = 'Please do not message me again. I will not respond further.';
  return `${intros[tone]} ${body.join(' ')} ${close}`;
}
