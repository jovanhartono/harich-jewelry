"use client";

import { memo, Suspense, useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FilterFragment,
  GetCollectionQuery,
  ProductCollectionSortKeys,
  ProductFilter,
} from "@/__generated__/graphql";
import { getCollectionProductsQuery } from "@/gql/queries/collection";
import { useSuspenseQuery } from "@apollo/client";
import { Button } from "@nextui-org/button";

import { ProductsSorter } from "@/components/collection/collection-products-sorter";
import ProductCard from "@/components/product/product-card";
import ProductGridSkeleton from "@/components/product/product-grid-skeleton";
import { DEFAULT_SORT_OPTION, FILTER_ID, SORT_OPTIONS } from "@/lib/constant";
import { cn } from "@/lib/utils";

const CollectionProductList = memo(function CollectionFilter({
  handle,
  sortKey,
  reverse,
  filters,
}: {
  handle: string;
  filters: ProductFilter[];
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
}) {
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
});

const CollectionFilter = memo(function CollectionFilter({
  filters,
}: {
  filters: FilterFragment[];
}) {
  const [isLoading, transition] = useTransition();

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const isChecked = useCallback(
    (key: string, value: string) => {
      return Array.from(searchParams.entries()).some(
        ([k, v]) => k === key && v === value,
      );
    },
    [searchParams],
  );

  const handleCheckChange = useCallback(
    (id: string, label: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams);

      checked ? params.append(id, label) : params.delete(id, label);

      transition(() => {
        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [searchParams],
  );

  return (
    <section className="col-span-1">
      <ul className="sticky top-[120px] flex flex-col gap-6">
        {filters.map((f) => (
          <li
            key={f.id}
            className={cn("flex flex-col gap-2", {
              "w-full": f.id === FILTER_ID.shape,
            })}
          >
            <p className="font-medium">{f.label}</p>

            <ul className="flex flex-wrap gap-1.5">
              {f.values.map((fv) => (
                <li
                  key={fv.id}
                  className={cn("shrink-0 basis-24 cursor-pointer")}
                >
                  <label
                    aria-disabled={fv.count < 1}
                    id={fv.id}
                    className="group flex h-full cursor-pointer flex-col p-2"
                  >
                    <input
                      className="sr-only"
                      disabled={fv.count < 1}
                      type="checkbox"
                      defaultChecked={isChecked(f.id, fv.label)}
                      onChange={({ target }) => {
                        handleCheckChange(f.id, fv.label, target.checked);
                      }}
                    />
                    {fv.image?.image ? (
                      <figure className="flex flex-col gap-2">
                        <div className="rounded-medium p-2 duration-100 transition-background group-hover:bg-primary group-has-[:checked]:bg-primary">
                          <img
                            className="mx-auto h-10 brightness-0"
                            src={fv.image.image.url}
                            alt={fv.image.image.altText || fv.label}
                          />
                        </div>
                        <figcaption className="text-balance text-center text-sm text-default-700 group-has-[:checked]:font-medium group-has-[:checked]:text-black">
                          {fv.label}
                        </figcaption>
                      </figure>
                    ) : (
                      <p>{fv.label}</p>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
});

export const CollectionProducts = memo(function CollectionProducts({
  collection,
}: {
  collection: GetCollectionQuery["collection"];
}) {
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
  }, [collection]);

  if (!collection) {
    return;
  }

  return (
    <div className="container grid grid-cols-3 gap-9">
      <CollectionFilter filters={collection.products.filters} />
      <section className="col-span-2 flex flex-col gap-6">
        <div className="flex justify-end">
          <ProductsSorter />
        </div>
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
});
