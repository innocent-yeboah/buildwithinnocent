import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import RevealOnScroll from "@/components/RevealOnScroll";

type Testimonial = {
  id: string;
  name: string;
  business: string;
  quote: string;
  result: string;
  initials: string;
};

/**
 * Curated testimonials shown until live entries exist in Supabase.
 * The `testimonials` table (columns: id, name, business, quote, result,
 * initials, published) overrides these once rows are published.
 */
const fallbackTestimonials: Testimonial[] = [
  {
    id: "benizer-green",
    name: "Mr. Ebenezer",
    business: "Benizer Green Shop",
    quote:
      "I went from 0 inquiries to 5 per week in the first month. The system works.",
    result: "0 to 5 inquiries per week",
    initials: "EB",
  },
  {
    id: "stanley-perfume",
    name: "Mr. Stanley",
    business: "Perfume Business",
    quote:
      "I stopped answering DMs all day. Now I just wake up to orders.",
    result: "From DMs all day to waking up to orders",
    initials: "ST",
  },
  {
    id: "business-owner",
    name: "A Business Owner",
    business: "African Enterprise",
    quote:
      "I was asleep. My business was not. That is the feeling.",
    result: "Customers while you sleep",
    initials: "BO",
  },
];

async function loadTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallbackTestimonials;

  try {
    const { data, error } = await withBackoff(async () => {
      const result = await supabase
        .from("testimonials")
        .select("id, name, business, quote, result, initials")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (result.error) throw result.error;
      return result;
    });

    if (error || !data || data.length === 0) return fallbackTestimonials;
    return data as Testimonial[];
  } catch {
    return fallbackTestimonials;
  }
}

/**
 * Dynamic testimonial wall — social proof that shows, not tells.
 */
export default async function Testimonials() {
  const testimonials = await loadTestimonials();

  return (
    <section aria-labelledby="testimonials-title" className="bg-primary-50 py-20 sm:py-28">
      <div className="container-site">
        <RevealOnScroll className="text-center">
          <p className="section-eyebrow">Proof</p>
          <h2 id="testimonials-title" className="section-title">
            Real business owners. Real results.
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <RevealOnScroll key={testimonial.id} delay={index * 120}>
              <figure className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                <div
                  aria-hidden="true"
                  className="font-display text-5xl leading-none text-gold"
                >
                  &ldquo;
                </div>
                <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-ink">
                  {testimonial.quote}
                </blockquote>
                <p className="mt-5 inline-flex w-fit rounded-full bg-growth-50 px-3.5 py-1.5 text-xs font-bold text-growth-700">
                  {testimonial.result}
                </p>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-primary-50 pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-gold"
                  >
                    {testimonial.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-primary">
                      {testimonial.name}
                    </span>
                    <span className="block text-xs text-ink/70">
                      {testimonial.business}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
