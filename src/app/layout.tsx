import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Providers } from "@/app/providers";

import { siteConfig } from "@/config/site";
import { getUser } from "@/lib/auth";
import {
  fontInter,
  fontMono,
  fontSans,
  incognito,
  overpass,
  poppins,
} from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Navbar } from "@/components/site-header/navbar";
import { TailwindIndicator } from "@/components/tailwind-indicator";

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: [
    //...
  ],
  authors: [{ name: siteConfig.author, url: siteConfig.links.portfolio }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.siteUrl),
  // twitter: siteConfig.twitter,
  // openGraph: siteConfig.openGraph,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

type RootLayoutProps = {
  modal: React.ReactNode;
  children: React.ReactNode;
};

export default async function RootLayout({ modal, children }: RootLayoutProps) {
  const user = await getUser();

  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head />

      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          fontInter.variable,
          poppins.variable,
          overpass.variable,
          incognito.variable,
          "font-overpass"
        )}
      >
        <DotPattern className="pointer-events-none !fixed opacity-50 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]" />

        <Providers className="flex min-h-screen flex-col">
          <Navbar user={user} />
          <div className="z-0 flex-1">{children}</div>
          <Footer />

          {modal}
        </Providers>

        <TailwindIndicator />
      </body>
    </html>
  );
}