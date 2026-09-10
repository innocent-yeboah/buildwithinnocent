/**
 * Blog content store. Posts are written in-code (TypeScript objects with
 * lightweight sections) so the blog ships fast, stays type-safe, and can
 * later migrate to a CMS without changing the page components.
 */
export type PostSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readMinutes: number;
  publishedAt: string; // ISO date
  sections: PostSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-your-business-needs-a-system-not-a-website",
    title: "Why Your Business Needs a System, Not Just a Website",
    description:
      "A website that just sits there is a business card. A system works: it attracts, captures, follows up, and sells — even at 2 AM.",
    category: "Strategy",
    readMinutes: 6,
    publishedAt: "2026-06-10",
    sections: [
      {
        type: "paragraph",
        text: "Every week, a business owner tells us some version of the same story: \"I paid for a website two years ago. It looks nice. It has brought me exactly zero customers.\" The website is not lying to them — it is doing exactly what it was built to do, which is nothing. It sits there, looking nice.",
      },
      {
        type: "paragraph",
        text: "The problem is not the website. The problem is what is missing around it. A website is one piece of a machine that was never assembled. Nobody connected it to anything, so nothing flows through it.",
      },
      { type: "heading", text: "What a website cannot do on its own" },
      {
        type: "list",
        items: [
          "It cannot follow up with the person who visited, almost bought, and left.",
          "It cannot remember who inquired last month and never came back.",
          "It cannot take a payment if there is no payment system behind it.",
          "It cannot answer the same pricing question for the fortieth time this week.",
          "It cannot remind your customer about tomorrow's appointment.",
        ],
      },
      {
        type: "paragraph",
        text: "Each of those jobs falls back on you. So you end up with a nice website and a phone that never stops buzzing — which is exactly where you were before, minus the money you paid for the website.",
      },
      { type: "heading", text: "What a system does differently" },
      {
        type: "paragraph",
        text: "A digital business system treats the website as the front door, not the whole house. Behind that door: a booking engine that takes appointments and deposits, a payment system that clears mobile money instantly, a CRM that remembers every person who ever showed interest, and automated follow-up that keeps talking to them until they are ready to buy.",
      },
      {
        type: "paragraph",
        text: "The difference shows up at 2 AM. A website sleeps when you sleep. A system takes a booking at 11:42 PM, collects a deposit at 1:07 AM, captures a lead at 3:15 AM, and sends twelve follow-up emails before you wake up. We know, because those are real timestamps from a system we run.",
      },
      {
        type: "callout",
        text: "The question is not \"do I need a website?\" It is \"what happens to a customer who finds me at midnight?\" If the answer is \"nothing,\" you have a website. If the answer is \"they book and pay,\" you have a system.",
      },
      { type: "heading", text: "Where to start" },
      {
        type: "paragraph",
        text: "Do not start by redesigning anything. Start by walking your own customer journey: search for your business, try to figure out your prices, try to book or buy. Every place you get stuck, your customers have been getting stuck for months. Those sticking points — not the design — are what a system fixes first.",
      },
    ],
  },
  {
    slug: "mobile-money-online-sales-ghana",
    title: "Mobile Money Is Your Superpower: Selling Online in Ghana",
    description:
      "Most global advice about 'online payments' ignores how West Africa actually pays. Here is how to turn mobile money into an always-on sales channel.",
    category: "Payments",
    readMinutes: 5,
    publishedAt: "2026-06-24",
    sections: [
      {
        type: "paragraph",
        text: "Read any international guide about selling online and it assumes your customer has a credit card and the patience to type sixteen digits into a checkout form. In Ghana, that assumption breaks immediately — and that is good news for you.",
      },
      {
        type: "paragraph",
        text: "Mobile money is faster than card checkout, more trusted than card checkout, and already in your customer's hand. The businesses winning online here are not the ones that copied a Western e-commerce playbook. They are the ones that made paying as easy as sending airtime.",
      },
      { type: "heading", text: "The DM-and-pray problem" },
      {
        type: "paragraph",
        text: "Most small businesses already accept mobile money — but manually. A customer DMs, you negotiate, you send your number, they transfer, you screenshot-check, then you fulfil. That works at five orders a week. At twenty-five, it eats your whole day, and every step is a chance for the customer to drift away.",
      },
      {
        type: "paragraph",
        text: "Every hour between \"I want it\" and \"I paid\" costs you sales. The DM flow routinely stretches that gap to a day. An integrated checkout shrinks it to about ninety seconds.",
      },
      { type: "heading", text: "What integrated mobile money changes" },
      {
        type: "list",
        items: [
          "Customers pay at the moment of highest intent — no waiting for you to reply.",
          "A payment prompt appears directly on their phone; no numbers to copy.",
          "Every payment is recorded automatically — no screenshots, no notebook.",
          "Deposits protect your bookings: a no-show who paid 50% usually shows.",
          "You see exactly which products and services actually make money.",
        ],
      },
      {
        type: "callout",
        text: "One client stopped chasing payments after delivery and switched to paid-upfront online orders. Result: 100% of orders paid before delivery, zero forgotten orders, and evenings back.",
      },
      { type: "heading", text: "How to get this without becoming a tech company" },
      {
        type: "paragraph",
        text: "You do not need to integrate payment APIs yourself. You need a system where the checkout, the order record, and the follow-up message are already wired together. That is the standard payment layer in every system we build — MTN, Telecel, and AT mobile money plus cards, connected to your CRM so every payment updates your books automatically.",
      },
    ],
  },
  {
    slug: "stop-losing-leads-in-your-dms",
    title: "You Are Losing Customers in Your DMs. Here Is the Fix.",
    description:
      "Instagram DMs feel like customer service. They are actually a leaky bucket. How to keep the conversations and stop the losses.",
    category: "Lead Capture",
    readMinutes: 5,
    publishedAt: "2026-07-08",
    sections: [
      {
        type: "paragraph",
        text: "Scroll your business DMs right now. Count the conversations that ended with a question you answered — and then nothing. \"How much is it?\" You replied. Silence. That silence is not a no. It is a customer you never followed up with.",
      },
      { type: "heading", text: "Why DMs leak" },
      {
        type: "list",
        items: [
          "DMs have no memory. Interested people from March are buried under memes from yesterday.",
          "DMs depend on your reply speed. Slow day for you means lost sales, not delayed ones.",
          "DMs do not scale. Ten inquiries a day is a part-time job; thirty is a crisis.",
          "DMs keep no records. You cannot follow up with people you cannot find.",
        ],
      },
      {
        type: "paragraph",
        text: "One of our clients measured it: about 10 hours per week answering DMs, and most of that time was spent answering the same four questions — price, availability, location, and \"do you do X?\". Ten hours of unpaid customer service that mostly did not convert.",
      },
      { type: "heading", text: "The fix is not answering faster" },
      {
        type: "paragraph",
        text: "Replying in two minutes instead of two hours helps, but it keeps you as the bottleneck. The real fix is giving interested people a path that does not require you at all: a page that answers the common questions, a form or booking flow that captures their details, and automation that follows up with everyone who did not buy yet.",
      },
      {
        type: "paragraph",
        text: "Keep the DMs — they are where relationships happen. But the transactional questions (price, availability, booking) should be handled by your system, so the conversation you personally have is the one that actually needs a human.",
      },
      {
        type: "callout",
        text: "After we built that path for our photography client, DM time dropped from 10 hours a week to 1 — and bookings doubled, because leads were captured and followed up instead of evaporating.",
      },
      { type: "heading", text: "A 15-minute audit you can do today" },
      {
        type: "list",
        items: [
          "Count last month's DM inquiries that never bought. That is your leak.",
          "Write down the four questions you answer most. Those belong on a page, not in chat.",
          "Check: if someone wants to buy at 11 PM, can they — without you? If not, that is the first thing to fix.",
        ],
      },
    ],
  },
  {
    slug: "follow-up-where-the-money-hides",
    title: "Follow-Up: Where the Money Has Been Hiding All Along",
    description:
      "Most sales do not happen at first contact. If you have no follow-up system, you are funding your competitors' pipeline.",
    category: "Automation",
    readMinutes: 6,
    publishedAt: "2026-07-15",
    sections: [
      {
        type: "paragraph",
        text: "Here is the uncomfortable math of small business sales: most people who ask about your product do not buy that day. Not because they chose someone else — because life happened. Salary was a week away. They got busy. They meant to come back.",
      },
      {
        type: "paragraph",
        text: "What determines whether they eventually buy from you is embarrassingly simple: whether they hear from you again. And for most businesses, the honest answer is never.",
      },
      { type: "heading", text: "Why nobody follows up manually" },
      {
        type: "paragraph",
        text: "It is not laziness. Manual follow-up requires remembering who asked, when they asked, what they asked about, and what you already said — for every single person — while also running the business. Past a handful of leads, no human does this reliably. This is not a discipline problem; it is a systems problem.",
      },
      { type: "heading", text: "What automated follow-up actually looks like" },
      {
        type: "list",
        items: [
          "Minute 0: instant confirmation — \"We got your inquiry, here is what happens next.\"",
          "Day 1: the useful answer — pricing details, availability, photos of relevant work.",
          "Day 3: proof — a short story or result from a customer like them.",
          "Day 7: a gentle nudge with a clear next step — book, order, or ask a question.",
          "After purchase: reminders, thank-yous, review requests, and a win-back message if they go quiet for 60 days.",
        ],
      },
      {
        type: "paragraph",
        text: "Notice the tone: helpful, not pushy. Automated does not mean robotic. The messages are written once, in your voice, and then sent at the right moment to the right person — which is more personal than the nothing they currently receive.",
      },
      {
        type: "callout",
        text: "Our restaurant client added one automated sequence — a follow-up to past customers who had not ordered in a while. Repeat orders rose 40%. Not from new customers: from people who already liked the food and simply needed a reminder.",
      },
      { type: "heading", text: "The compounding effect" },
      {
        type: "paragraph",
        text: "Follow-up compounds because your list only grows. Every captured lead stays in the system — this month's \"not yet\" becomes next month's sale, without any extra ad spend or effort. That is why Capture and Follow-Up are the third and fourth layers of every system we build: attention is expensive, but a lead you already captured is nearly free to convert.",
      },
      {
        type: "paragraph",
        text: "If you want to know how leaky your own follow-up is, take our free assessment — it scores exactly this, in about two minutes.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
