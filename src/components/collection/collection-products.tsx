"use client";

import { startTransition, Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  GetCollectionQuery,
  ProductCollectionSortKeys,
  ProductFilter,
} from "@/__generated__/graphql";
import { getCollectionProductsQuery } from "@/gql/queries/collection";
import { useFilter } from "@/providers/filter-provider";
import { useSuspenseQuery } from "@apollo/client";
import { useIntersectionObserver } from "@uidotdev/usehooks";

import ProductCard from "@/components/product/product-card";
import ProductGridSkeleton from "@/components/product/product-grid-skeleton";
import { DEFAULT_SORT_OPTION, SORT_OPTIONS } from "@/lib/constant";

const CollectionProductList = ({
  handle,
  sortKey,
  reverse,
  filters,
}: {
  handle: string;
  filters: ProductFilter[];
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
}) => {
  const {
    data: { collection },
    fetchMore,
  } = useSuspenseQuery(getCollectionProductsQuery, {
    variables: {
      handle,
      sortKey,
      reverse,
      filters,
    },
  });

  const [ref, entry] = useIntersectionObserver({
    root: null,
    threshold: 0,
    rootMargin: "0px",
  });

  const { setFilters } = useFilter();

  useEffect(() => {
    if (collection?.products.filters) {
      setFilters(collection.products.filters);
    }
  }, [collection?.products.filters, setFilters]);

  // when user scrolls into the bottom of the page, trigger fetchMore()
  useEffect(() => {
    if (collection?.products.pageInfo.hasNextPage && entry?.isIntersecting) {
      startTransition(() => {
        void fetchMore({
          variables: {
            after: collection?.products.pageInfo.endCursor,
          },
        });
      });
    }
  }, [
    collection?.products.pageInfo.endCursor,
    collection?.products.pageInfo.hasNextPage,
    entry?.isIntersecting,
    fetchMore,
  ]);

  if (!collection?.products.edges.length) {
    return <p>No Product Found</p>;
  }

  return (
    <div className="flex flex-col space-y-6 @container">
      <ul className="grid grid-cols-2 gap-4 @xl:grid-cols-3 @4xl:grid-cols-4 md:gap-3">
        {collection.products.edges.map(({ node }) => (
          <li key={node.id}>
            <ProductCard product={node} />
          </li>
        ))}
      </ul>

      {collection.products.pageInfo.hasNextPage ? (
        <div className="relative" ref={ref}>
          <ProductGridSkeleton />
        </div>
      ) : null}
    </div>
  );
};

export const CollectionProducts = ({
  collection,
}: {
  collection: GetCollectionQuery["collection"];
}) => {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");

  const { sortKey, reverse } = useMemo(
    () =>
      SORT_OPTIONS.find((item) => item.slug === sort) || DEFAULT_SORT_OPTION,
    [sort],
  );

  const activeFilters: ProductFilter[] = useMemo(() => {
    return Array.from(searchParams.entries()).reduce((acc, [k, v]) => {
      const f = collection?.products?.filters.find(({ id }) => id === k);

      if (f) {
        const fv = f.values.find(({ label }) => label === v);

        fv && acc.push(JSON.parse(fv.input) as ProductFilter);
      }

      return acc;
    }, [] as ProductFilter[]);
  }, [collection?.products?.filters, searchParams]);

  if (!collection) {
    return;
  }

  return (
    <section className="container flex flex-col">
      <Suspense fallback={<ProductGridSkeleton />}>
        <CollectionProductList
          filters={activeFilters}
          handle={collection.handle}
          sortKey={sortKey}
          reverse={reverse}
        />
      </Suspense>
    </section>
  );
};
