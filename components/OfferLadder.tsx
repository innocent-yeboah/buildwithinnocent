import { offers, type OfferId } from "@/lib/offers";

type OfferLadderProps = {
  recommendedId?: OfferId | null;
  sentence?: string;
  heading?: string;
};

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M5 12h12M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Three offer tiers. Side by side from the lg breakpoint, stacked below it,
 * with an arrow between each tier.
 */
export default function OfferLadder({ recommendedId, sentence, heading }: OfferLadderProps) {
  return (
    <section aria-labelledby="offer-ladder-title">
      <h2 id="offer-ladder-title" className="font-display text-3xl font-semibold text-primary">
        {heading ?? "Where a score can lead"}
      </h2>
      {sentence ? <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink">{sentence}</p> : null}
      <ol className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)] lg:items-stretch">
        {offers.tiers.map((tier, index) => {
          const recommended = tier.id === recommendedId;
          return (
            <li key={tier.id} className="contents">
              <article
                className={`relative flex h-full flex-col rounded-3xl border bg-white p-6 ${
                  recommended ? "border-gold shadow-md ring-2 ring-gold/50" : "border-primary-100"
                }`}
                aria-current={recommended ? "step" : undefined}
              >
                {recommended ? (
                  <p className="mb-4 inline-flex w-fit rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-900">
                    Recommended for you
                  </p>
                ) : null}
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-growth">
                  Tier {tier.step}
                </p>
                <h3 className="mt-2 font-display text-2xl text-primary">{tier.name}</h3>
                <p className="mt-3 text-lg font-semibold text-ink">{tier.price}</p>
                {tier.length ? <p className="mt-1 text-sm text-ink/70">Length: {tier.length}</p> : null}
                <ul className="mt-5 flex-1 space-y-2.5 text-sm leading-relaxed text-ink/80">
                  {tier.gets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-primary-100 pt-4 text-sm leading-relaxed text-ink/75">
                  <span className="font-semibold text-primary">{tier.leadsLabel}: </span>
                  {tier.leadsWhen}
                </p>
              </article>
              {index < offers.tiers.length - 1 ? (
                <div className="flex items-center justify-center py-3 text-gold lg:py-0" aria-hidden="true">
                  <span className="rotate-90 lg:rotate-0">
                    <Arrow />
                  </span>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink/60">{offers.footnote}</p>
    </section>
  );
}
