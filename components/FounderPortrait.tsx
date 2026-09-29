import Image from "next/image";
import { site } from "@/lib/site";

type FounderPortraitProps = {
  /** Load immediately when the portrait is in the first screen. */
  priority?: boolean;
};

/**
 * Innocent's studio portrait. Rounded, with no extra frame, so the navy
 * backdrop sits against the page.
 */
export default function FounderPortrait({ priority = false }: FounderPortraitProps) {
  return (
    <figure className="overflow-hidden rounded-3xl">
      <Image
        src={site.founderPhoto}
        alt={site.founderPhotoAlt}
        width={1600}
        height={2000}
        priority={priority}
        sizes="(min-width: 1024px) 28rem, 100vw"
        className="aspect-[4/5] h-auto w-full object-cover"
      />
    </figure>
  );
}
