import type { Metadata, Viewport } from "next";

import "./globals.css";

import { ReactNode } from "react";
import { cookies } from "next/headers";
import Providers from "@/app/providers";
import { CartProvider } from "@/providers/cart-provider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { siteConfig } from "@/config/site";
import { COOKIES } from "@/lib/constant";
import { getCart } from "@/lib/shopify";
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
  const cartId = cookies().get(COOKIES.CART)?.value;
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart(cartId);

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
          <CartProvider cartPromise={cart}>
            <Toaster />
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
