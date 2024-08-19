"use client";

import { Suspense, useMemo, useTransition } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  GetCollectionQuery,
  ProductCollectionSortKeys,
  ProductFilter,
} from "@/__generated__/graphql";
import { getCollectionProductsQuery } from "@/gql/queries/collection";
import { useSuspenseQuery } from "@apollo/client";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";

import ProductCard from "@/components/product/product-card";
import ProductGridSkeleton from "@/components/product/product-grid-skeleton";
import { DEFAULT_SORT_OPTION, SORT_OPTIONS } from "@/lib/constant";

const ProductsSorter = dynamic(
  () =>
    import("@/components/collection/collection-products-sorter").then(
      (m) => m.ProductsSorter,
    ),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="ml-auto h-10 w-full rounded-large max-md:hidden lg:h-12 lg:w-1/3" />
    ),
  },
);

const CollectionFilter = dynamic(
  () =>
    import("@/components/collection/collection-filter").then(
      (m) => m.CollectionFilter,
    ),
  {
    ssr: false,
    loading: () => <div className="col-span-1" />,
  },
);

const CollectionFilterSorterMobile = dynamic(
  () =>
    import("@/components/collection/collection-filter-sorter-mobile").then(
      (m) => m.CollectionFilterSorterMobile,
    ),
  {
    ssr: false,
  },
);

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
  const [isLoading, transition] = useTransition();

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
        <Button
          color="primary"
          className="mx-auto w-full max-w-sm"
          isLoading={isLoading}
          onClick={() => {
            transition(() => {
              void fetchMore({
                variables: {
                  after: collection?.products.pageInfo.endCursor,
                },
              });
            });
          }}
        >
          Show More
        </Button>
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

  const productFilters: ProductFilter[] = useMemo(() => {
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
    <div className="container grid gap-9 md:grid-cols-3">
      <CollectionFilterSorterMobile filters={collection.products.filters} />
      <CollectionFilter filters={collection.products.filters} />
      <section className="col-span-2 flex flex-col gap-6">
        <ProductsSorter />
        <Suspense fallback={<ProductGridSkeleton />}>
          <CollectionProductList
            filters={productFilters}
            handle={collection.handle}
            sortKey={sortKey}
            reverse={reverse}
          />
        </Suspense>
      </section>
    </div>
  );
};
