import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";
import RevealOnScroll from "@/components/RevealOnScroll";
import { MailIcon, ChartIcon, MagnetIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Newsletter — One Useful Growth Idea, Every Two Weeks",
  description:
    "Practical ideas for growing your business online: lead capture, mobile money, automation, and lessons from real client systems. Free, every two weeks.",
  alternates: { canonical: "/newsletter" },
};

const expectations = [
  {
    icon: MagnetIcon,
    title: "One practical idea per issue",
    text: "Something you can apply the same week — not theory, not trends.",
  },
  {
    icon: ChartIcon,
    title: "Real numbers from real systems",
    text: "What actually happened when clients automated bookings, payments, and follow-up.",
  },
  {
    icon: MailIcon,
    title: "Short enough to finish",
    text: "A 3-minute read, every two weeks. Your inbox has suffered enough.",
  },
];

export default function NewsletterPage() {
  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <RevealOnScroll>
          <p className="section-eyebrow">The Newsletter</p>
          <h1 className="font-display text-4xl font-bold leading-tight text-primary sm:text-5xl">
            One Useful Idea, Every Two Weeks.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/80">
            The same lessons we learn building digital business systems for
            African enterprises — written so you can use them whether you
            ever hire us or not.
          </p>
          <ul className="mt-8 space-y-5">
            {expectations.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-gold">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-primary">{item.title}</p>
                  <p className="mt-0.5 text-sm text-ink/70">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <div className="rounded-3xl bg-white p-8 shadow-card sm:p-10">
            <h2 className="font-display text-xl font-bold text-primary">
              Join Free
            </h2>
            <p className="mt-1 text-sm text-ink/70">
              Read by business owners across Ghana and beyond.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
