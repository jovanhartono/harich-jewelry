import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";

import "./globals.css";

import { ReactNode } from "react";
import Providers from "@/providers";

import { Navbar } from "@/components/layout/navbar";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
