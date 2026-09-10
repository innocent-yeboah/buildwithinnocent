import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import CtaBand from "@/components/CtaBand";
import { CheckIcon, ChartIcon, MagnetIcon, ChatIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Free Resources — Checklists and Tools for Growing Your Business",
  description:
    "Free, practical checklists: audit your online presence, plug your lead leaks, and prepare your business for a digital system. No email required.",
  alternates: { canonical: "/resources" },
};

type Resource = {
  id: string;
  icon: typeof CheckIcon;
  title: string;
  description: string;
  items: string[];
};

const checklists: Resource[] = [
  {
    id: "online-presence-audit",
    icon: ChartIcon,
    title: "The 10-Minute Online Presence Audit",
    description:
      "Walk your own customer journey and find out where people are getting stuck — the same audit we run in every discovery session.",
    items: [
      "Google your business name. Do you appear in the first three results?",
      "Search what you sell (e.g. 'spa in Accra'). Are you anywhere on page one?",
      "Open your website or social page on a phone. Can a stranger tell what you sell in 10 seconds?",
      "Try to find your prices without messaging anyone. Possible?",
      "Try to book or buy right now, at this moment. What happens?",
      "Check your DMs: how many inquiries from the last 30 days never got a reply or follow-up?",
      "Look at your last 9 posts. Would a stranger know what you sell — or just that you exist?",
      "Ask a friend to try contacting your business. Time how long a reply takes.",
    ],
  },
  {
    id: "lead-leak-checklist",
    icon: MagnetIcon,
    title: "The Lead Leak Checklist",
    description:
      "Seven places businesses lose customers without noticing. Tick every box you can honestly answer 'yes' to — each unticked box is money leaking.",
    items: [
      "Every person who inquires ends up on a list I can see (not buried in chats).",
      "Someone who asks about price gets a follow-up within 3 days — automatically.",
      "A customer can book or order without waiting for me to reply.",
      "Deposits or prepayment protect me from no-shows and fake orders.",
      "Past customers hear from me at least once a month without me remembering to do it.",
      "I know exactly how many inquiries I received last month, and how many bought.",
      "If I fell ill for a week, sales would still come in.",
    ],
  },
  {
    id: "system-readiness",
    icon: ChatIcon,
    title: "Before You Hire Any Web Developer: 8 Questions to Ask",
    description:
      "Use these questions to protect yourself from paying for a website that just sits there — no matter who you hire.",
    items: [
      "\"What happens to a visitor who is interested but not ready to buy?\" (Listen for: capture and follow-up, not 'they can contact you'.)",
      "\"How will customers pay?\" (Mobile money should be first-class, not an afterthought.)",
      "\"Who updates the website after launch, and how?\" (You should be able to do it from a dashboard.)",
      "\"What exactly do I own when we finish?\" (Domain, content, and data should be yours.)",
      "\"What happens after launch?\" (Support, monitoring, and optimization — or a goodbye?)",
      "\"How will I know it is working?\" (Ask what numbers they will show you, and how often.)",
      "\"Can I see a system you built that is live right now?\" (Demos beat portfolios.)",
      "\"What does it cost — all of it?\" (Hosting, domain, changes. Surprises are a red flag.)",
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container-site max-w-3xl text-center">
          <p className="animate-fade-in section-eyebrow !text-gold">Free Resources</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Tools You Can Use Today — Client or Not.
          </h1>
          <p
            className="animate-fade-up mt-5 text-lg text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            No email walls, no locked PDFs. These are the actual checklists
            we use with clients. Take them, use them, grow.
          </p>
        </div>
      </section>

      <section aria-label="Checklists" className="bg-primary-50 py-16 sm:py-24">
        <div className="container-site max-w-4xl space-y-8">
          {checklists.map((resource, index) => (
            <RevealOnScroll key={resource.id} delay={index * 80}>
              <article className="overflow-hidden rounded-3xl bg-white shadow-card">
                <div className="flex items-start gap-4 border-b border-primary-50 p-8">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-gold">
                    <resource.icon className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-primary">
                      {resource.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {resource.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-4 p-8">
                  {resource.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-growth text-growth"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </span>
                      <p className="text-[15px] leading-relaxed text-ink/90">{item}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealOnScroll>
          ))}

          <RevealOnScroll>
            <div className="rounded-3xl bg-primary p-8 text-center sm:p-10">
              <h2 className="font-display text-2xl font-bold text-white">
                Want Your Score Instead of a Checklist?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-primary-100">
                The free assessment turns these questions into a number — your
                Digital Business Readiness Score — in about 2 minutes.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/assessment" className="btn-primary">
                  Take the Free Assessment <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link href="/blog" className="btn-ghost-light">
                  Read the Blog
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
