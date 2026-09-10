/**
 * Rule-based assistant for the chat widget. Answers the questions
 * visitors actually ask (from real DM history), and hands off to
 * WhatsApp for anything it cannot handle. Runs entirely client-side —
 * instant answers, no API cost, works offline.
 */
export type BotReply = {
  text: string;
  /** Optional in-site link offered with the answer. */
  link?: { href: string; label: string };
  /** Suggest continuing on WhatsApp. */
  offerWhatsApp?: boolean;
};

type Rule = {
  keywords: RegExp;
  reply: BotReply;
};

const rules: Rule[] = [
  {
    keywords: /price|cost|how much|fee|charge|expensive|cheap|budget|pay(?!ment system)/i,
    reply: {
      text: "The Complete Digital Business System is GHS 5,400 — pay 50% upfront to start and 50% on delivery — or GHS 1,000/month for 6 months. Website, booking, payments, CRM, email automation, plus 1 year of hosting and support, all included. Want to build your own estimate?",
      link: { href: "/calculator", label: "Open the pricing calculator" },
    },
  },
  {
    keywords: /how long|timeline|duration|weeks|when.*ready|delivery time|fast/i,
    reply: {
      text: "Five weeks from first conversation to launch: Discovery (week 1), Design & Build (weeks 2-3), Review (week 4), Launch (week 5). Then we support you for a full year.",
      link: { href: "/how-it-works", label: "See the full process" },
    },
  },
  {
    keywords: /guarantee|refund|risk|work for free|promise/i,
    reply: {
      text: "Our guarantee is simple: 10+ qualified leads in 30 days, or we work for free until we deliver. We can promise that because we run our own business on the exact system we sell.",
      link: { href: "/what-we-build", label: "Read about the guarantee" },
    },
  },
  {
    keywords: /momo|mobile money|mtn|telecel|airteltigo|card payment|payment system|checkout/i,
    reply: {
      text: "Yes — every system we build accepts mobile money (MTN, Telecel, AT) and card payments directly on your website. Your customers pay the way they already pay.",
      link: { href: "/demo/booking", label: "Try the payment demo" },
    },
  },
  {
    keywords: /what.*(included|get)|include|package|website only|features|deliver/i,
    reply: {
      text: "One partnership includes: a professional website, admin dashboard, payment system, CRM, social media integration, automated email, and 1 year of domain, hosting, and support.",
      link: { href: "/what-we-build", label: "See everything included" },
    },
  },
  {
    keywords: /demo|try|sandbox|example|sample|see it/i,
    reply: {
      text: "You can click through a live sandbox right now — the booking flow your customers would use, and the dashboard you would manage everything from.",
      link: { href: "/demo", label: "Open the live demo" },
    },
  },
  {
    keywords: /spa|salon|restaurant|food|shop|store|ecommerce|e-commerce|photograph|artist|creative|service|industry|my business|barber|fashion|clinic/i,
    reply: {
      text: "We build for spas and wellness, food and beverage, creatives, retail and e-commerce, and service providers — and every system is customized around how your business actually works.",
      link: { href: "/industries", label: "See what we build for your industry" },
    },
  },
  {
    keywords: /support|maintain|after launch|hosting|domain|broken|update/i,
    reply: {
      text: "Your first year of domain, hosting, and support is included. We monitor, update, and optimize your system — if something breaks at midnight, that is our problem, not yours.",
    },
  },
  {
    keywords: /assessment|score|audit|check my|readiness/i,
    reply: {
      text: "The free assessment takes about 2 minutes: 8 questions, and you get a Digital Business Readiness Score out of 100 with a breakdown of exactly where you are losing customers.",
      link: { href: "/assessment", label: "Get my free score" },
    },
  },
  {
    keywords: /refer|referral|commission|earn/i,
    reply: {
      text: "Know a business that needs customers? Our referral program pays GHS 300 per business you refer that becomes a client — straight to your mobile money.",
      link: { href: "/referral", label: "Get my referral link" },
    },
  },
  {
    keywords: /who|about|innocent|founder|team|trust/i,
    reply: {
      text: "Build With Innocent is led by Innocent Golden — from Uber driver to full-stack developer to building digital business systems for African enterprises. And this website runs on the exact system we sell.",
      link: { href: "/about", label: "Read the story" },
    },
  },
  {
    keywords: /start|begin|proposal|sign ?up|interested|let'?s go|hire|book you/i,
    reply: {
      text: "Wonderful. Tell us about your project — takes about 3 minutes — and you will get a tailored proposal within 24-48 hours. No obligation.",
      link: { href: "/start", label: "Tell us about your project" },
    },
  },
  {
    keywords: /human|person|talk|call|whatsapp|someone real|agent/i,
    reply: {
      text: "Of course — Innocent personally answers WhatsApp messages. Tap below and continue this conversation with a real human.",
      offerWhatsApp: true,
    },
  },
  {
    keywords: /hi|hello|hey|good (morning|afternoon|evening)|greetings/i,
    reply: {
      text: "Hello! I am the Build With Innocent assistant. Ask me about pricing, timelines, the guarantee, or what is included — or tap a question below to get started.",
    },
  },
  {
    keywords: /thank|thanks|great|awesome|ok(ay)?|cool/i,
    reply: {
      text: "You are welcome! If anything else comes to mind, I am right here — or you can take it to WhatsApp anytime.",
      offerWhatsApp: true,
    },
  },
];

const fallback: BotReply = {
  text: "That is a great question — and honestly one better answered by a human. Message us on WhatsApp and Innocent will reply personally, usually within the hour.",
  offerWhatsApp: true,
};

/** Returns the best-matching scripted answer for a visitor message. */
export function getBotReply(message: string): BotReply {
  const trimmed = message.trim();
  if (!trimmed) return fallback;

  for (const rule of rules) {
    if (rule.keywords.test(trimmed)) {
      return rule.reply;
    }
  }
  return fallback;
}

/** Quick-tap starter questions shown in the widget. */
export const quickQuestions = [
  "How much does it cost?",
  "What is included?",
  "How long does it take?",
  "Tell me about the guarantee",
];
