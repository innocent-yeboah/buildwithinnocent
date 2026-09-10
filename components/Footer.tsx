import Link from "next/link";
import { navLinks, toolLinks, site } from "@/lib/site";

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
          <p className="font-display text-xl font-bold">{site.name}</p>
          <p className="mt-1 text-sm font-medium uppercase tracking-wider text-gold">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-100">
            We build digital business systems that bring you customers while
            you sleep. One partnership. Everything handled.
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
            <li>
              <Link
                href="/start"
                className="text-sm font-semibold text-gold hover:text-gold-300"
              >
                Start Your System &rarr;
              </Link>
            </li>
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
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-gold"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phone}`}
                className="transition-colors hover:text-gold"
              >
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
              >
                WhatsApp Us
              </a>
            </li>
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
            href="/start"
            className="mt-4 inline-block text-sm font-semibold text-gold hover:text-gold-300"
          >
            Tell us about your project &rarr;
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-200 sm:flex-row">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>Built with the same system we sell. Proudly African.</p>
        </div>
      </div>
    </footer>
  );
}
