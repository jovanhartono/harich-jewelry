"use client";

import { startTransition, useEffect, useMemo } from "react";
import { Product } from "@/__generated__/graphql";
import { getSearchQuery } from "@/gql/queries/search";
import { FilterProvider } from "@/providers/filter-provider";
import { useSuspenseQuery } from "@apollo/client";
import { useIntersectionObserver } from "@uidotdev/usehooks";

import { subtitle } from "@/components/primitives";
import ProductCard from "@/components/product/product-card";
import ProductGridSkeleton from "@/components/product/product-grid-skeleton";
import {
  DEFAULT_SEARCH_SORT_OPTION,
  SEARCH_SORT_OPTIONS,
} from "@/lib/constant";
import { removeEdgesAndNodes } from "@/lib/utils";
import useQueryParams from "@/hooks/useQueryParams";

export default function SearchProductLayout() {
  const { searchParams } = useQueryParams();
  const sort = searchParams.get("sort");
  const query = searchParams.get("q") || "";

  const { sortKey, reverse } = useMemo(
    () =>
      SEARCH_SORT_OPTIONS.find((item) => item.slug === sort) ||
      DEFAULT_SEARCH_SORT_OPTION,
    [sort],
  );

  const { data, fetchMore } = useSuspenseQuery(getSearchQuery, {
    variables: {
      query,
      sortKey,
      reverse,
    },
  });

  const [ref, entry] = useIntersectionObserver({
    root: null,
    threshold: 0,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (data?.search.pageInfo.hasNextPage && entry?.isIntersecting) {
      startTransition(() => {
        void fetchMore({
          variables: {
            after: data?.search.pageInfo.endCursor,
          },
        });
      });
    }
  }, [
    data?.search.pageInfo.endCursor,
    data?.search.pageInfo.hasNextPage,
    entry?.isIntersecting,
    fetchMore,
  ]);

  if (data?.search?.totalCount === 0) {
    return (
      <div className="container h-96">
        <p className={subtitle()}>
          No results found for <strong>&quot;{query}&quot;</strong>. Check the
          spelling or use a different word or phrase.
        </p>
      </div>
    );
  }

  return (
    <FilterProvider filters={data.search.productFilters}>
      <section className="container">
        {/*<CollectionOrganizer />*/}

        <div className="flex flex-col space-y-6 @container">
          <ul className="grid grid-cols-2 gap-4 @xl:grid-cols-3 @4xl:grid-cols-4 md:gap-3">
            {removeEdgesAndNodes(data.search)
              .filter((node): node is Product => node.__typename === "Product")
              .map((node) => (
                <li key={node.id}>
                  <ProductCard product={node as Product} />
                </li>
              ))}
          </ul>

          {data.search.pageInfo.hasNextPage ? (
            <div className="relative" ref={ref}>
              <ProductGridSkeleton />
            </div>
          ) : null}
        </div>
      </section>
    </FilterProvider>
  );
}
