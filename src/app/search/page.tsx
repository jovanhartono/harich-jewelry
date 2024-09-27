import { Suspense } from "react";
import type { Metadata } from "next";

import ProductGridSkeleton from "@/components/product/product-grid-skeleton";
import SearchProductLayout from "@/components/search/search-product-layout";

export function metadata(): Metadata {
  return {
    title: "Search",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { q: searchValue } = searchParams as {
    [key: string]: string;
    sort: string;
  };

  return (
    <div className="flex flex-col gap-6 py-6 lg:gap-9 lg:py-12">
      <h1 className="container font-semibold tracking-tight lg:text-2xl">
        Showing Results for &quot;{searchValue}&quot;
      </h1>

      <Suspense
        fallback={
          <div className="container">
            <ProductGridSkeleton />
          </div>
        }
      >
        <SearchProductLayout />
      </Suspense>
    </div>
  );
}
