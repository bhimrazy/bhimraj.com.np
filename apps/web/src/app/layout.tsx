import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Pwa } from "@/components/pwa";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { BRAND_COLORS } from "@/lib/brand";
import { startupImages } from "@/lib/ios-splash";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.author.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "Bhimraj Yadav",
    "Software Engineer",
    "OSS Contributor",
    "PyTorch Lightning",
    "LitServe",
    "AI Engineer",
    "Python Developer",
    "Kathmandu Nepal",
  ],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.username,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  appleWebApp: {
    title: "bhimraj",
    statusBarStyle: "default",
    startupImage: startupImages,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.author.handle,
    creator: siteConfig.author.handle,
  },
};

/* next/font variables — use unique names to avoid conflict with @theme entries */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  // The site defaults to dark whatever the OS says; <Pwa /> follows a toggle.
  themeColor: BRAND_COLORS.night,
  // Draw under notches and the home indicator; fixed bars pad with
  // env(safe-area-inset-*).
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Rendered here, not via `alternates.types`: every page sets its own
            `alternates` (canonical), which replaces the root one wholesale. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.name} — RSS Feed`}
          href="/feed.xml"
        />
      </head>
      <body className="flex min-h-dvh flex-col pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Pwa />
        </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      )}
    </html>
  );
}
