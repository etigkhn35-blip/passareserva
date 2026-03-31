import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import CookiePopup from "@/components/CookiePopup";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.passareserva.com"),
  title: {
    default: "Passa Reserva | Transfer & Resell Your Travel Bookings",
    template: "%s | Passa Reserva",
  },
  description:
    "Passa Reserva is a global marketplace where you can safely transfer, resell, or buy travel bookings, holiday packages, and experiences.",
  alternates: {
    canonical: "https://www.passareserva.com",
  },
  openGraph: {
    title: "Passa Reserva | Transfer & Resell Your Travel Bookings",
    description:
      "A global platform to transfer, resell, and discover travel bookings, vacation packages, and experiences safely.",
    url: "https://www.passareserva.com",
    siteName: "Passa Reserva",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>

        {/* RECAPTCHA */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />

        {/* GOOGLE TAG */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-62TVD50CNE"
          strategy="afterInteractive"
        />
        <Script id="google-tags" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-62TVD50CNE');
            gtag('config', 'AW-18032245965');
          `}
        </Script>

      </head>

      <body className="bg-gray-50">
        <LanguageProvider>
          {children}
          <CookiePopup />
        </LanguageProvider>
      </body>
    </html>
  );
}