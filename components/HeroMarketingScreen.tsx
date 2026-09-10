"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = {
  src: string;
  alt: string;
  caption: string;
};

const slides: Slide[] = [
  {
    src: "/images/marketing/01-whatsapp-orders.png",
    alt: "Market seller showing a WhatsApp order ad for fresh local produce",
    caption: "Orders on WhatsApp — while you serve customers",
  },
  {
    src: "/images/marketing/02-freshmart-app.png",
    alt: "Customer browsing a supermarket app with delivery and fresh deals",
    caption: "Your store in their pocket",
  },
  {
    src: "/images/marketing/03-google-reviews.png",
    alt: "Shop owner smiling at a laptop as five-star Google reviews appear",
    caption: "Reviews that sell for you",
  },
  {
    src: "/images/marketing/04-google-business.png",
    alt: "Business owner checking his Google Business Profile on a tablet",
    caption: "Found on Google. Booked online.",
  },
  {
    src: "/images/marketing/05-online-sales.png",
    alt: "Entrepreneur holding a laptop showing growing online sales",
    caption: "Sales climbing while you rest",
  },
];

const SLIDE_MS = 4200;

/**
 * Digital marketing screen — a phone-framed reel of African businesses
 * winning customers online. Crossfades + subtle Ken Burns motion.
 */
export default function HeroMarketingScreen() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[300px] lg:max-w-[320px]">
      {/* Soft glow behind the device */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[3rem] bg-gold/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-[2.5rem] bg-growth/15 blur-2xl"
      />

      {/* Phone shell */}
      <figure className="relative overflow-hidden rounded-[2.25rem] border-[6px] border-primary-900 bg-primary-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/20">
        {/* Status bar */}
        <div className="relative z-20 flex items-center justify-between bg-black/40 px-5 pb-1.5 pt-3 text-[10px] font-semibold text-white">
          <span>9:41</span>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black"
          />
          <span className="flex items-center gap-1">
            <span className="h-2 w-3 rounded-sm bg-white/90" />
            <span className="h-2.5 w-5 rounded-sm border border-white/90">
              <span className="ml-0.5 mt-0.5 block h-1.5 w-3 rounded-[1px] bg-growth" />
            </span>
          </span>
        </div>

        {/* Screen */}
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-primary-900">
          {slides.map((slide, i) => {
            const isActive = i === index;
            return (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!isActive}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1024px) 280px, 320px"
                  priority={i === 0}
                  className={`object-cover ${
                    isActive && !reduceMotion ? "animate-ken-burns" : ""
                  }`}
                />
              </div>
            );
          })}

          {/* Caption strip */}
          <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-primary-900/95 via-primary-900/70 to-transparent px-4 pb-5 pt-16">
            <p className="text-center text-xs font-semibold leading-snug text-white sm:text-sm">
              {slides[index].caption}
            </p>
            {/* Progress dots */}
            <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Marketing scenes">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show scene ${i + 1}: ${slide.caption}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-gold"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </figcaption>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center bg-black/30 py-2">
          <span aria-hidden="true" className="h-1 w-24 rounded-full bg-white/40" />
        </div>
      </figure>

      <p className="relative mt-4 text-center text-xs font-medium uppercase tracking-wider text-gold/90">
        Live digital systems · African businesses
      </p>
    </div>
  );
}
