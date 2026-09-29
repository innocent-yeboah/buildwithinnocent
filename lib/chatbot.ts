/**
 * Rule-based assistant for the chat widget. Answers from facts already
 * published on the site. If a fact is not published, the reply says
 * Innocent confirms it on the strategy call. Runs in the browser.
 *
 * Patterns use word boundaries so fragments like the "try" inside
 * "industry" or "country" do not steal the match.
 */
import { responseTimePhrase, site } from "@/lib/site";

export type BotReply = {
  text: string;
  /** Optional in-site link offered with the answer. */
  link?: { href: string; label: string };
  /** Suggest continuing on WhatsApp. */
  offerWhatsApp?: boolean;
  /**
   * True when part of the reply is not a published fact and is left
   * for the strategy call. The widget does not show this flag.
   */
  confirmsOnCall?: boolean;
};

type Rule = {
  keywords: RegExp;
  reply: BotReply;
};

const callLink = { href: "/strategy-call", label: "Book a strategy call" } as const;

const paymentFact =
  "Customers pay on the site with Mobile Money — MTN, Telecel, and AT — and by card.";

const rules: Rule[] = [
  {
    // Bank is not listed anywhere on the site. Check it before MoMo/card.
    keywords: /\bbank( transfer| payment)?s?\b/i,
    reply: {
      text: `${paymentFact} The site does not list bank transfer. Innocent confirms that on the strategy call.`,
      link: callLink,
      offerWhatsApp: true,
      confirmsOnCall: true,
    },
  },
  {
    // Payment method questions before price, so "pay with MoMo" is not a price question.
    keywords:
      /\b(momo|mobile money|mtn|telecel|airteltigo|airtel|tigo)\b|\b(card|cards|visa|mastercard)s?\b|\bcard payments?\b|\bpayment systems?\b/i,
    reply: {
      text: paymentFact,
      link: { href: "/demo/booking", label: "Try the payment demo" },
    },
  },
  {
    keywords: /\b(deposit|deposits|upfront|down payment)\b|\b50\s*%|\bhalf (now|upfront|to start)\b/i,
    reply: {
      text: `The published partnership is ${site.offer.total}. Half is paid upfront to start — ${site.offer.upfront} — and ${site.offer.onDelivery} is due on delivery. Or ${site.offer.monthly}.`,
      link: { href: "/what-we-build", label: "See the partnership" },
    },
  },
  {
    keywords: /\b(price|prices|cost|costs|fee|fees|charge|charges|expensive|cheap|budget)\b|\bhow much\b/i,
    reply: {
      text: `The Complete Digital Business System is ${site.offer.total} — ${site.offer.split.toLowerCase()} — or ${site.offer.monthly}. The website, booking, payments, CRM, email, and the first year of hosting and support are included.`,
      link: { href: "/calculator", label: "Open the pricing calculator" },
    },
  },
  {
    // Before "how long", so "how long is support" is not a build timeline.
    keywords:
      /\b(after launch|first year|hosting|domain|support|maintain|maintenance|broken|update)\b|\bwhen (it|you) (go(?:es)? live|launch)\b/i,
    reply: {
      text: "After launch, domain, hosting, and support for the first year are part of the partnership, not a later invoice. That year is technical support, monitoring, and check-ins.",
      link: { href: "/how-it-works", label: "See the year after launch" },
    },
  },
  {
    keywords:
      /\bhow (long|fast)\b|\btimeline\b|\bhow many weeks\b|\b(five|5) weeks\b|\bdelivery time\b|\bwhen\b.*\b(ready|live)\b/i,
    reply: {
      text: "Five weeks from the first conversation to launch. Week 1 is discovery, weeks 2–3 are design and build, week 4 is your review, and week 5 the system goes live. Then Innocent stays for the first year.",
      link: { href: "/how-it-works", label: "See the 5-week process" },
    },
  },
  {
    keywords:
      /\b(included|include|includes|package|features|deliverables?)\b|\bwhat\b.*\b(get|included)\b|\bwebsite only\b|\bcomplete (digital )?system\b/i,
    reply: {
      text: "The complete system includes the website, admin dashboard, booking, Mobile Money and card payments, CRM, social integration, and automated email, plus domain, hosting, and support for the first year.",
      link: { href: "/what-we-build", label: "See everything included" },
    },
  },
  {
    // Before the generic "call" / "book" handoff.
    keywords:
      /\bstrategy call\b|\bbook( a| the)? call\b|\bhow (do i|to) book\b|\bthe call\b|\bdiscovery call\b/i,
    reply: {
      text: `It is one conversation about the business you already run. You leave with a recommendation, and a price agreed before any build. If a system is not the right spend, Innocent says so. The form needs your name, WhatsApp number, and type of business. Budget and timing can wait. He replies ${responseTimePhrase}.`,
      link: callLink,
    },
  },
  {
    keywords:
      /\b(who builds|builds it|founder)\b|\binnocent\b|\byourself\b|\bwho (do i|will i) work with\b/i,
    reply: {
      text: "Innocent builds it himself. The strategy call, the scope, and the build are with him. There is no account manager between you and the work.",
      link: { href: "/about", label: "About Innocent" },
    },
  },
  {
    keywords:
      /\bwhere (are|do) you\b|\bwhere.*(based|located|office|work)\b|\b(location|office|accra)\b|\b(ghana|africa|country|city)\b|\bbased in\b/i,
    reply: {
      text: `Innocent works with owners in Ghana and elsewhere in Africa. The first conversation can be in person or on a call. The site does not publish an office address — Innocent confirms a city or a meeting place on the strategy call. He replies ${responseTimePhrase}.`,
      link: callLink,
      offerWhatsApp: true,
      confirmsOnCall: true,
    },
  },
  {
    keywords: /\b(guarantee|refund|money back)\b|\bwork for free\b/i,
    reply: {
      text: `The site says: "${site.promise}" The terms page is a draft, not a client contract, and it does not set a refund of money already paid. Innocent confirms that on the strategy call.`,
      link: { href: "/terms", label: "Read the terms" },
      offerWhatsApp: true,
      confirmsOnCall: true,
    },
  },
  {
    keywords:
      /\b(e-?mail address|your e-?mail|email you|contact e-?mail|write to you)\b|\bwhat('?s| is) (your |the )?e-?mail\b/i,
    reply: site.email
      ? {
          text: `Email Innocent at ${site.email}. He replies ${responseTimePhrase}.`,
        }
      : {
          text: `The site is not showing a public email right now. Innocent confirms the address on the strategy call. He replies ${responseTimePhrase}.`,
          link: callLink,
          offerWhatsApp: true,
          confirmsOnCall: true,
        },
  },
  {
    keywords: /\bwhats?app\b|\b(your|the) number\b|\bphone number\b/i,
    reply: {
      text: `WhatsApp Innocent on ${site.phoneDisplay}. He replies ${responseTimePhrase}.`,
      offerWhatsApp: true,
    },
  },
  {
    keywords: /\b(demo|sandbox|example|sample)\b|\btry\b|\bsee it\b/i,
    reply: {
      text: "You can click through a live sandbox — the booking flow, and the dashboard.",
      link: { href: "/demo", label: "Open the live demo" },
    },
  },
  {
    keywords:
      /\b(spa|salon|restaurant|shop|store|ecommerce|e-commerce|artist|creative|barber|fashion|clinic|industry|industries)\b|\bphotograph\w*\b|\bfood\b|\bmy business\b/i,
    reply: {
      text: "Innocent builds for spas and wellness, food and beverage, creatives, retail and e-commerce, and service providers. The system is shaped around how that business already works.",
      link: { href: "/industries", label: "See the industries" },
    },
  },
  {
    keywords: /\b(assessment|score|audit|readiness)\b|\bcheck my\b/i,
    reply: {
      text: "The free assessment is about 2 minutes: 8 questions, then a Digital Business Readiness Score out of 100.",
      link: { href: "/assessment", label: "Get my free score" },
    },
  },
  {
    keywords: /\b(referral|commission)\b|\brefer\b|\bearn\b/i,
    reply: {
      text: "The referral page offers GHS 300 when someone you refer becomes a paying client.",
      link: { href: "/referral", label: "Get my referral link" },
    },
  },
  {
    keywords: /\b(start|begin|proposal|interested|hire)\b|\bsign ?up\b|\blet'?s go\b/i,
    reply: {
      text: `Book a strategy call with Innocent. Your name, WhatsApp number, and type of business are enough to request it. Budget can wait. He replies ${responseTimePhrase}.`,
      link: callLink,
    },
  },
  {
    keywords: /\b(human|person|talk|agent)\b|\bsomeone real\b|\bcall\b/i,
    reply: {
      text: `Innocent answers WhatsApp himself, ${responseTimePhrase}.`,
      offerWhatsApp: true,
    },
  },
  {
    keywords: /\b(hi|hello|hey|greetings)\b|\bgood (morning|afternoon|evening)\b/i,
    reply: {
      text: "Hello. I am the assistant for Innocent. Ask about the timeline, what is included, payment, or the strategy call.",
    },
  },
  {
    keywords: /\b(thank|thanks|great|awesome|cool)\b|\bok(?:ay)?\b/i,
    reply: {
      text: "You are welcome. Ask another question, or take it to WhatsApp.",
      offerWhatsApp: true,
    },
  },
];

const fallback: BotReply = {
  text: `I don't have that on the site. Innocent confirms it on the strategy call, and he replies ${responseTimePhrase}.`,
  link: callLink,
  offerWhatsApp: true,
  confirmsOnCall: true,
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

/** Quick-tap starter questions shown under the opening greeting. */
export const quickQuestions = [
  "How long does it take?",
  "What is included?",
  "Can I pay with MoMo?",
  "How do I book?",
  "Who builds it?",
];
