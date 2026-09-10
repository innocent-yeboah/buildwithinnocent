import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

type CtaBandProps = {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
};

/**
 * The closing call-to-action used at the bottom of every page.
 * One clear next step: tell us about your project.
 */
export default function CtaBand({
  title = "Ready to Grow While You Sleep?",
  subtitle = "Tell us about your project. We will send a tailored proposal within 24-48 hours.",
  buttonLabel = "Tell Us About Your Project",
}: CtaBandProps) {
  return (
    <section
      aria-labelledby="cta-band-title"
      className="relative overflow-hidden bg-primary py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-growth/20 blur-3xl"
      />
      <div className="container-site relative text-center">
        <RevealOnScroll>
          <h2
            id="cta-band-title"
            className="mx-auto max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-100">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/start" className="btn-primary text-lg">
              {buttonLabel} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <p className="mt-6 text-sm font-medium text-gold">
            10+ qualified leads in 30 days, or we work for free until you get them.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
