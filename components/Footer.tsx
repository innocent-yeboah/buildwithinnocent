import Link from "next/link";
import { LogoCircle } from "@/components/BrandLogo";
import { moreLinks, navLinks, toolLinks, site } from "@/lib/site";

/**
 * Site footer: brand recap, navigation, contact, and the guarantee —
 * the last thing every visitor reads before leaving.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <LogoCircle className="h-20 w-20" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-100">
            Innocent builds digital systems with owners of established
            African businesses. One partnership. The price is published.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
            Explore
          </p>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-primary-100 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {moreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-primary-100 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Free tools">
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
            Free Tools
          </p>
          <ul className="space-y-2.5">
            {toolLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-primary-100 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/client/login"
                className="text-sm text-primary-100 transition-colors hover:text-gold"
              >
                Client Portal
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
            Talk to Us
          </p>
          <ul className="space-y-2.5 text-sm text-primary-100">
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">
                  {site.email}
                </a>
              </li>
            )}
            {site.phone && site.phoneDisplay && (
              <li>
                <a href={`tel:${site.phone}`} className="transition-colors hover:text-gold">
                  {site.phoneDisplay}
                </a>
              </li>
            )}
            {site.whatsappUrl && (
              <li>
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold transition-colors hover:text-gold-300"
                >
                  WhatsApp Us
                </a>
              </li>
            )}
          </ul>
          <ul className="mt-5 flex gap-4" aria-label="Social media">
            <li>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-100 transition-colors hover:text-gold"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-100 transition-colors hover:text-gold"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-gold/30 bg-primary-800 p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-gold">
            The Guarantee
          </p>
          <p className="mt-3 font-display text-lg font-semibold leading-snug">
            10+ leads in 30 days or we work for free.
          </p>
          <Link
            href="/strategy-call"
            className="mt-4 inline-block text-sm font-semibold text-gold hover:text-gold-300"
          >
            Book a strategy call &rarr;
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-200 sm:flex-row">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>Built with the same system we sell. Proudly African.</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gold">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
