import type { Metadata, Viewport } from "next";

import "./globals.css";

import { ReactNode } from "react";
import Providers from "@/app/providers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

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

export default function RootLayout({
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
      <body className={cn("bg-background")}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
