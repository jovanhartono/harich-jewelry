"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: Omit<ThemeProviderProps, "children">;
}

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_SHOPIFY_GRAPHQL_URI,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
    headers: {},
  });
}

export default function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <NextUIProvider
        navigate={router.push}
        className="flex h-full min-h-screen flex-col"
      >
        <ThemeProvider {...themeProps}>{children}</ThemeProvider>
      </NextUIProvider>
    </ApolloNextAppProvider>
  );
}
