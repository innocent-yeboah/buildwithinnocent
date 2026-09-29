/**
 * Rule-based assistant for the chat widget. Answers the questions
 * visitors actually ask, and hands off to WhatsApp for anything it
 * cannot handle. Runs entirely client-side — instant answers, no API
 * cost, works offline.
 *
 * Patterns use word boundaries so fragments like the "try" inside
 * "industry" or "country" do not steal the match.
 */
import { responseTimePhrase } from "@/lib/site";

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
    // Payment method questions before price, so "pay with MoMo" is not a price question.
    keywords:
      /\b(momo|mobile money|mtn|telecel|airteltigo|checkout)\b|\bcard payments?\b|\bpayment systems?\b/i,
    reply: {
      text: "Yes — every system we build accepts mobile money (MTN, Telecel, AT) and card payments directly on your website. Your customers pay the way they already pay.",
      link: { href: "/demo/booking", label: "Try the payment demo" },
    },
  },
  {
    keywords: /\b(price|prices|cost|costs|fee|fees|charge|charges|expensive|cheap|budget)\b|\bhow much\b/i,
    reply: {
      text: "The Complete Digital Business System is GHS 5,400 — pay 50% upfront to start and 50% on delivery — or GHS 1,000/month for 6 months. Website, booking, payments, CRM, email automation, plus 1 year of hosting and support, all included. Want to build your own estimate?",
      link: { href: "/calculator", label: "Open the pricing calculator" },
    },
  },
  {
    keywords: /\b(how long|timeline|duration|weeks|delivery time)\b|\bwhen\b.*\bready\b|\bfast\b/i,
    reply: {
      text: "Five weeks from first conversation to launch: Discovery (week 1), Design & Build (weeks 2-3), Review (week 4), Launch (week 5). Then we support you for a full year.",
      link: { href: "/how-it-works", label: "See the full process" },
    },
  },
  {
    keywords: /\b(guarantee|refund|risk|promise)\b|\bwork for free\b/i,
    reply: {
      text: "Our guarantee is simple: 10+ qualified leads in 30 days, or we work for free until we deliver. We can promise that because we run our own business on the exact system we sell.",
      link: { href: "/what-we-build", label: "Read about the guarantee" },
    },
  },
  {
    keywords:
      /\b(included|include|includes|package|features|deliverables?)\b|\bwhat\b.*\b(get|included)\b|\bwebsite only\b/i,
    reply: {
      text: "One partnership includes: a professional website, admin dashboard, payment system, CRM, social media integration, automated email, and 1 year of domain, hosting, and support.",
      link: { href: "/what-we-build", label: "See everything included" },
    },
  },
  {
    keywords: /\b(demo|sandbox|example|sample)\b|\btry\b|\bsee it\b/i,
    reply: {
      text: "You can click through a live sandbox right now — the booking flow your customers would use, and the dashboard you would manage everything from.",
      link: { href: "/demo", label: "Open the live demo" },
    },
  },
  {
    keywords:
      /\b(spa|salon|restaurant|shop|store|ecommerce|e-commerce|artist|creative|barber|fashion|clinic|industry|industries)\b|\bphotograph\w*\b|\bfood\b|\bmy business\b/i,
    reply: {
      text: "We build for spas and wellness, food and beverage, creatives, retail and e-commerce, and service providers — and every system is customized around how your business actually works.",
      link: { href: "/industries", label: "See what we build for your industry" },
    },
  },
  {
    keywords: /\b(support|maintain|hosting|domain|broken|update)\b|\bafter launch\b/i,
    reply: {
      text: "Your first year of domain, hosting, and support is included. We monitor, update, and optimize your system — if something breaks at midnight, that is our problem, not yours.",
    },
  },
  {
    keywords: /\b(assessment|score|audit|readiness)\b|\bcheck my\b/i,
    reply: {
      text: "The free assessment takes about 2 minutes: 8 questions, and you get a Digital Business Readiness Score out of 100 with a breakdown of exactly where you are losing customers.",
      link: { href: "/assessment", label: "Get my free score" },
    },
  },
  {
    keywords: /\b(referral|commission)\b|\brefer\b|\bearn\b/i,
    reply: {
      text: "Know a business that needs customers? Our referral program pays GHS 300 per business you refer that becomes a client — straight to your mobile money.",
      link: { href: "/referral", label: "Get my referral link" },
    },
  },
  {
    keywords: /\b(who|about|innocent|founder|team|trust)\b/i,
    reply: {
      text: "Innocent builds the system with you — the call, the scope, and the build. He learned the craft between Uber shifts and still does the work himself. This website is the piece you can inspect.",
      link: { href: "/about", label: "Read the story" },
    },
  },
  {
    keywords: /\b(start|begin|proposal|interested|hire)\b|\bsign ?up\b|\blet'?s go\b|\bbook you\b/i,
    reply: {
      text: `Book a strategy call with Innocent — your name and WhatsApp number are enough, and budget is optional. He replies ${responseTimePhrase}.`,
      link: { href: "/strategy-call", label: "Book a strategy call" },
    },
  },
  {
    keywords: /\b(human|person|talk|call|whatsapp|agent)\b|\bsomeone real\b/i,
    reply: {
      text: `Of course — Innocent personally answers WhatsApp messages, ${responseTimePhrase}. Tap below and continue this conversation with a real human.`,
      offerWhatsApp: true,
    },
  },
  {
    keywords: /\b(hi|hello|hey|greetings)\b|\bgood (morning|afternoon|evening)\b/i,
    reply: {
      text: "Hello! I am the Build With Innocent assistant. Ask me about pricing, timelines, the guarantee, or what is included — or tap a question below to get started.",
    },
  },
  {
    keywords: /\b(thank|thanks|great|awesome|cool)\b|\bok(?:ay)?\b/i,
    reply: {
      text: "You are welcome! If anything else comes to mind, I am right here — or you can take it to WhatsApp anytime.",
      offerWhatsApp: true,
    },
  },
];

const fallback: BotReply = {
  text: `That is a great question — and honestly one better answered by a human. Message us on WhatsApp and Innocent will reply personally, ${responseTimePhrase}.`,
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
