import type { Metadata, Viewport } from "next";

import "./globals.css";

import type { ReactNode } from "react";
import Providers from "@/app/providers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "@/components/ui/toaster";
import FloatingWhatsapp from "@/components/floating-whatsapp";
import Footer from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const viewport: Viewport = {
  themeColor: { media: "(prefers-color-scheme: light)", color: "white" },
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} – ${siteConfig.description}`,
    template: `%s – ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        "font-sans antialiased",
      )}
    >
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Harich Jewelry" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="dns-prefetch"
          href="https://f3586e-88.myshopify.com/api/2024-04/graphql.json"
        />
      </head>
      <body className="bg-background">
        <Providers>
          <Toaster />
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </Providers>

        <FloatingWhatsapp />
      </body>
    </html>
  );
}
