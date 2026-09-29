import Image from "next/image";
import { site } from "@/lib/site";

type FounderPortraitProps = {
  /** Light frame on a dark hero, or the default paper frame. */
  tone?: "light" | "dark";
};

/**
 * A real photograph when site.founderPhoto is set. Otherwise a monogram
 * that does not pretend to be a picture of anyone.
 */
export default function FounderPortrait({ tone = "light" }: FounderPortraitProps) {
  const dark = tone === "dark";
  const frame = dark
    ? "border-white/15 bg-white/[0.04] text-white"
    : "border-primary-100 bg-primary-50 text-primary";

  return (
    <figure className={`overflow-hidden rounded-3xl border ${frame}`}>
      {site.founderPhoto ? (
        <Image
          src={site.founderPhoto}
          alt="Innocent, founder of Build With Innocent"
          width={880}
          height={1100}
          className="aspect-[4/5] w-full object-cover"
          priority
        />
      ) : (
        <div className="flex flex-col items-center justify-center px-8 py-16 text-center sm:py-20">
          <span
            aria-hidden="true"
            className={`font-display text-7xl font-semibold ${dark ? "text-gold" : "text-primary"}`}
          >
            I
          </span>
          <figcaption className="mt-6">
            <span className={`block font-display text-2xl ${dark ? "text-white" : "text-primary"}`}>
              {site.founder}
            </span>
            <span className={`mt-1 block text-sm ${dark ? "text-primary-100" : "text-ink/70"}`}>
              Founder. He builds the system with you.
            </span>
          </figcaption>
        </div>
      )}
    </figure>
  );
}
