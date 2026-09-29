import Image from "next/image";
import { site } from "@/lib/site";

type FounderPortraitProps = {
  /** Load immediately when the portrait is in the first screen. */
  priority?: boolean;
  /** CSS width the browser should use when choosing a source, including 2x screens. */
  sizes: string;
};

/**
 * Innocent's studio portrait. Rounded, with no extra frame, so the navy
 * backdrop sits against the page.
 */
export default function FounderPortrait({ priority = false, sizes }: FounderPortraitProps) {
  return (
    <figure className="overflow-hidden rounded-3xl">
      <Image
        src={site.founderPhoto}
        alt={site.founderPhotoAlt}
        width={1600}
        height={2000}
        quality={95}
        priority={priority}
        sizes={sizes}
        className="aspect-[4/5] h-auto w-full"
      />
    </figure>
  );
}
