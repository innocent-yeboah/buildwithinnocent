"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, site } from "@/lib/site";

/**
 * Sticky site header. Solid on scroll, with an accessible mobile menu.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-primary-50/80 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-white/95 shadow-md backdrop-blur"
          : "bg-white/95 backdrop-blur"
      }`}
    >
      <div className="container-site flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="flex flex-col leading-tight"
          aria-label={`${site.name} — home`}
        >
          <span className="font-display text-lg font-bold text-primary sm:text-xl">
            Build With Innocent
          </span>
          <span className="hidden text-[11px] font-medium uppercase tracking-wider text-growth sm:block">
            Digital Business Systems
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary"
                    : "text-ink hover:bg-primary-50 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/start" className="btn-primary ml-3 !px-5 !py-2.5 !text-sm">
            Start Your System
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-primary hover:bg-primary-50 lg:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-primary-100 bg-white px-4 pb-6 pt-2 shadow-lg lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`block rounded-lg px-4 py-3 text-base font-medium ${
                    pathname === link.href
                      ? "bg-primary-50 text-primary"
                      : "text-ink hover:bg-primary-50 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-3">
              <Link href="/start" className="btn-primary w-full">
                Start Your System <span aria-hidden="true">&rarr;</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
