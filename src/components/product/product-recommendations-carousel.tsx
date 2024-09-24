"use client";

import NextImage from "next/image";
import NextLink from "next/link";
import { CompactProductFragment } from "@/__generated__/graphql";
import { Image } from "@nextui-org/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { formatRupiah } from "@/lib/utils";

export default function ProductsRecommendationsCarousel({
  products,
}: {
  products: Array<CompactProductFragment>;
}) {
  return (
    <Carousel
      opts={{
        align: "start",
        skipSnaps: true,
      }}
      plugins={[
        Autoplay({
          stopOnMouseEnter: true,
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent className="-ml-3">
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-2/3 pl-3 md:basis-1/3 xl:basis-1/4"
          >
            <NextLink
              key={product.id}
              href={`/product/${product.handle}`}
              className="block h-full border border-default-500 p-1"
            >
              <figure
                key={product.id}
                className="group flex h-full flex-none flex-col gap-3 bg-white p-3 @container"
              >
                <Image
                  fill
                  radius="none"
                  classNames={{
                    wrapper: "aspect-square !max-w-none",
                    zoomedWrapper: "h-full w-full",
                  }}
                  as={NextImage}
                  alt={product.featuredImage?.altText || product.title}
                  isZoomed
                  src={product.featuredImage?.url}
                  className="w-full object-cover object-center group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <figcaption className="flex grow flex-col justify-between gap-2">
                  <h2
                    aria-label="title"
                    className="line-clamp-2 text-lg font-medium tracking-tight"
                    title={product.title}
                  >
                    {product.title}
                  </h2>
                  <p aria-label="price">
                    {formatRupiah(product.priceRange.minVariantPrice.amount)}
                  </p>
                </figcaption>
              </figure>
            </NextLink>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
