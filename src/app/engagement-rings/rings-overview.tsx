"use client";

import { memo, useMemo } from "react";
import NextLink from "next/link";
import { CartLineInput } from "@/__generated__/graphql";
import { useRingBuilder } from "@/app/engagement-rings/ring-builder-provider";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";

import AddToCart from "@/components/cart/add-to-cart";
import { ProductCardPrice } from "@/components/product/product-card";
import { DEFAULT_TITLE_OPTION } from "@/lib/constant";

export const RingsOverviewLine = memo(function RingsOverviewLine() {
  const { settings, stone } = useRingBuilder();

  return (
    <div className="col-span-2">
      <ul className="flex flex-col gap-6 lg:basis-2/3">
        {[settings, stone].map((line, idx) => {
          if (!line) {
            return (
              <Skeleton
                key={idx}
                className="h-40 w-full rounded-large bg-cream"
              />
            );
          }

          const product = line.product;
          const options = line.selectedVariant.selectedOptions;

          return (
            <li key={idx} className="min-h-40 rounded-large bg-cream p-4">
              <figure className="flex grow items-center gap-6">
                <NextLink
                  href={`/product/${product.handle}`}
                  className="shrink-0"
                >
                  <Image
                    className="aspect-square w-24 object-cover object-center lg:w-32"
                    alt={product.featuredImage?.altText || product.title}
                    src={product.featuredImage?.url}
                  />
                </NextLink>
                <figcaption className="flex flex-1 flex-col overflow-hidden max-md:py-2">
                  {/*<div className="flex items-center justify-between">*/}
                  {/*  <strong*/}
                  {/*    aria-label="Product Vendor"*/}
                  {/*    className="font-semibold"*/}
                  {/*  >*/}
                  {/*    {product.vendor}*/}
                  {/*  </strong>*/}
                  {/*  <DeleteItem id={line.id} />*/}
                  {/*</div>*/}
                  <NextLink href={`/product/${product.handle}`}>
                    <h2
                      aria-label="Product Title"
                      className="line-clamp-2 text-pretty font-medium lg:text-lg"
                    >
                      {product.title}
                    </h2>
                  </NextLink>
                  <div className="mb-6 mt-1.5 flex gap-3 text-default-600">
                    {options
                      .filter(
                        (option) =>
                          option.value.toLowerCase() !==
                          DEFAULT_TITLE_OPTION.toLowerCase(),
                      )
                      .map((option) => (
                        <Chip
                          radius="sm"
                          color="default"
                          variant="flat"
                          key={option.name}
                          classNames={{
                            base: "min-h-[28px] h-auto",
                            content: "whitespace-break-spaces",
                          }}
                        >
                          {option.name}:&nbsp;
                          <strong className="font-medium">
                            {option.value}
                          </strong>
                        </Chip>
                      ))}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <ProductCardPrice
                      price={line.selectedVariant.price.amount}
                      compareAtPrice={
                        line.selectedVariant.compareAtPrice?.amount
                      }
                    />
                    {/*<ItemQuantity line={line} />*/}
                  </div>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export const RingsOverviewSummary = memo(function RingsOverviewSummary() {
  const { settings, stone } = useRingBuilder();

  const lines: CartLineInput[] | undefined = useMemo(() => {
    if (settings && stone) {
      return [
        {
          merchandiseId: settings.selectedVariant.id,
          quantity: 1,
        },
        {
          merchandiseId: stone.selectedVariant.id,
          quantity: 1,
        },
      ];
    }
  }, [settings, stone]);

  return (
    <div className="col-span-1">
      <div className="flex h-72 flex-col gap-6 rounded-large bg-default-100 p-6">
        {lines ? (
          <AddToCart lines={lines} />
        ) : (
          <Skeleton className="h-10 rounded-large bg-danger-500" />
        )}
      </div>
    </div>
  );
});
