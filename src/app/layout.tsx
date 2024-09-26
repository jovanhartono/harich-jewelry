import type { Metadata, Viewport } from "next";

import "./globals.css";

import { ReactNode, Suspense } from "react";
import Providers from "@/app/providers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "@/components/ui/toaster";
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
      <body className="bg-background">
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <Toaster />
          <Suspense
            fallback={
              <div className="sticky top-0 z-40 h-20 w-full border-b border-b-default-500 bg-background" />
            }
          >
            <Navbar />
          </Suspense>
          <main className="grow">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
