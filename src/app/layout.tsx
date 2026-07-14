import type { Metadata } from "next";
import { Inter, Geist_Mono, EB_Garamond } from "next/font/google";
import Script from "next/script";

import { Chatbot } from "@/components/chat/chatbot";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Preloader } from "@/components/motion/preloader";
import { WhatsappButton } from "@/components/shared/whatsapp-button";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { site } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Company Registration, Tax & Compliance`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "company registration",
    "GST registration",
    "trademark registration",
    "income tax filing",
    "business loans",
    "Vellore",
    "Tamil Nadu",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Company Registration, Tax & Compliance`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Company Registration, Tax & Compliance`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  description: site.description,
  telephone: site.phone,
  email: site.email,
  foundingDate: "2007",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, #23, 8th East Main Road, Gandhinagar, Katpadi",
    addressLocality: "Vellore",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  sameAs: [site.social.facebook, site.social.twitter],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${ebGaramond.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Preloader />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Chatbot />
          <WhatsappButton />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        {clarityId ? (
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
