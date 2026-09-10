import type { Metadata } from "next";
import RevealOnScroll from "@/components/RevealOnScroll";
import ReferralSignup from "@/components/ReferralSignup";
import { ShareIcon, CardIcon, HandshakeIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Referral Program — Earn GHS 300 for Every Business You Refer",
  description:
    "Know a business that needs customers? Share your link. When they become a client, you earn GHS 300 — paid to your mobile money.",
  alternates: { canonical: "/referral" },
};

const steps = [
  {
    icon: ShareIcon,
    title: "Share your link",
    description:
      "Get your personal link below and send it to any business owner who needs more customers — a friend, a client, your favorite restaurant.",
  },
  {
    icon: HandshakeIcon,
    title: "They become a partner",
    description:
      "When they sign up through your link and become a client, the referral is locked to you automatically. No screenshots, no proving anything.",
  },
  {
    icon: CardIcon,
    title: "You get paid GHS 300",
    description:
      "Straight to your mobile money once their project kicks off. Refer three businesses and that is nearly a full system paid for.",
  },
];

export default function ReferralPage() {
  return (
    <>
      <section className="bg-primary py-16 sm:py-24">
        <div className="container-site max-w-3xl text-center">
          <p className="animate-fade-in section-eyebrow !text-gold">Referral Program</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Know a Business That Needs Customers? Earn GHS 300.
          </h1>
          <p
            className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            The best businesses we work with come through people like you.
            So we pay for good introductions — every single one.
          </p>
        </div>
      </section>

      <section aria-labelledby="how-referrals-work" className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <RevealOnScroll className="mx-auto max-w-2xl text-center">
            <h2 id="how-referrals-work" className="section-title">
              Three Steps. No Catch.
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <RevealOnScroll key={step.title} delay={index * 110}>
                <div className="h-full rounded-2xl border border-primary-50 bg-white p-8 text-center shadow-card">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-gold">
                    <step.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-primary">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">
                    {step.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Create your referral link" className="bg-primary-50 py-16 sm:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <RevealOnScroll>
            <p className="section-eyebrow">Why We Do This</p>
            <h2 className="section-title">
              Your Recommendation Is Worth More Than Any Ad.
            </h2>
            <p className="mt-5 leading-relaxed text-ink/80">
              When you tell a friend &ldquo;these people are serious,&rdquo;
              that carries more weight than anything we could say about
              ourselves. We would rather pay you for that trust than pay an
              ad platform.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink/80">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-growth" />
                No limit — refer as many businesses as you like.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-growth" />
                You do not need to be a client yourself.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-growth" />
                Paid via mobile money when the referred project kicks off.
              </li>
            </ul>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <ReferralSignup />
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
