import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Build With Innocent | Custom Software for Ghanaian Businesses",
  description: "Websites, WhatsApp automation, and custom software for Ghanaian businesses. Free prototype. No monthly USD fees. Based in Accra.",
  keywords: "web developer Ghana, Accra web design, WhatsApp automation, custom software Ghana, business website, full stack developer Ghana",
  authors: [{ name: "Innocent Golden" }],
  creator: "Innocent Golden",
  publisher: "Build With Innocent",
  robots: "index, follow",
  openGraph: {
    title: "Build With Innocent | Custom Software for Ghanaian Businesses",
    description: "I build websites, WhatsApp automation, and custom software for Ghanaian businesses. Free prototype first. Based in Accra.",
    url: "https://buildwithinnocent.com",
    siteName: "Build With Innocent",
    images: [
      {
        url: "https://buildwithinnocent.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Build With Innocent - Custom Software for Ghanaian Businesses",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build With Innocent | Custom Software for Ghanaian Businesses",
    description: "I build websites, WhatsApp automation, and custom software for Ghanaian businesses. Free prototype first.",
    images: ["https://buildwithinnocent.com/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}