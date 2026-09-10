import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import Pixels from "@/components/Pixels";
import ParticleField from "@/components/ParticleField";
import MaintenanceBanner from "@/components/MaintenanceBanner";
import { site } from "@/lib/site";
import { isSiteUnderMaintenance } from "@/lib/maintenance";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: `${site.headline} Websites, booking, payments, CRM, and automation for African enterprises. ${site.promise}`,
  keywords: [
    "digital business systems",
    "web development Ghana",
    "African enterprises",
    "lead generation",
    "booking systems",
    "CRM",
    "business automation",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.headline,
    images: [
      {
        url: "/images/hero-team.png",
        width: 1600,
        height: 900,
        alt: "African professionals collaborating on digital systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.headline,
    images: ["/images/hero-team.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A5F",
  width: "device-width",
  initialScale: 1,
};

/** Organization structured data for search engines. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  slogan: site.tagline,
  email: site.email,
  telephone: site.phone,
  founder: { "@type": "Person", name: site.founder },
  areaServed: "Africa",
  sameAs: [site.social.linkedin, site.social.instagram, site.social.twitter],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const underMaintenance = isSiteUnderMaintenance();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="relative flex min-h-screen flex-col font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {underMaintenance ? (
          <MaintenanceBanner />
        ) : (
          <>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-900"
            >
              Skip to main content
            </a>
            <ParticleField />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ChatWidget />
          </>
        )}
        <Analytics />
        <Pixels />
      </body>
    </html>
  );
}
