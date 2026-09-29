import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import { publishedTestimonials, showVisitorPlaceholders, type TestimonialRecord } from "@/lib/proof";
import { TestimonialList } from "@/components/ClientStories";

type Row = {
  id: string;
  name: string;
  business: string;
  quote: string;
  result: string | null;
};

/**
 * Testimonials render only from published database rows or from the
 * curated list in lib/proof.ts. There is no sample fallback.
 */
async function loadTestimonials(): Promise<TestimonialRecord[]> {
  const local = publishedTestimonials;
  const supabase = getSupabaseAdmin();
  if (!supabase) return local;

  try {
    const { data, error } = await withBackoff(async () => {
      const result = await supabase
        .from("testimonials")
        .select("id, name, business, quote, result")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (result.error) throw result.error;
      return result;
    });

    if (error || !data || data.length === 0) return local;

    const fromDb: TestimonialRecord[] = (data as Row[])
      .filter((row) => row.name.trim() && row.quote.trim() && row.business.trim())
      .map((row) => ({
        id: row.id,
        clientName: row.name.trim(),
        role: "",
        business: row.business.trim(),
        quote: row.quote.trim(),
        metric: row.result?.trim()
          ? { value: row.result.trim(), label: "As published by the client" }
          : undefined,
      }));

    return fromDb.length > 0 ? fromDb : local;
  } catch {
    return local;
  }
}

export default async function Testimonials() {
  const testimonials = await loadTestimonials();
  if (testimonials.length === 0 && !showVisitorPlaceholders.emptyClientSection) {
    return null;
  }

  return (
    <section aria-labelledby="testimonials-title" className="bg-white py-20 sm:py-24">
      <div className="container-site">
        <p className="section-eyebrow">Clients</p>
        <h2 id="testimonials-title" className="section-title max-w-2xl">
          Named, and only when they agree to be named.
        </h2>
        <TestimonialList items={testimonials} />
      </div>
    </section>
  );
}
