import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  /** Path starting with /, or "/" for the homepage. */
  path: string;
  /**
   * Homepage titles are not run through the layout template.
   * Inner pages keep the template (`Title | Build With Innocent`).
   */
  absolute?: boolean;
  robots?: Metadata["robots"];
};

/**
 * Page title, description, canonical, and social tags together.
 * Inner pages were inheriting the homepage Open Graph title, description, and URL.
 */
export function pageMeta({
  title,
  description,
  path,
  absolute = false,
  robots,
}: PageMetaInput): Metadata {
  const socialTitle = absolute ? title : `${title} | ${site.name}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
    ...(robots ? { robots } : {}),
  };
}
