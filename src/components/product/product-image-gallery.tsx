"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageConnection } from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function ProductImageGallery({
  images: imagesProps,
}: {
  images: ImageConnection;
}) {
  const images = imagesProps.edges.map((edge) => edge.node);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [carouselRef, api] = useEmblaCarousel();
  const [thumbRef, thumbApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "keepSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(
    (api: CarouselApi) => {
      if (!api || !thumbApi) {
        return;
      }

      setSelectedIndex(api.selectedScrollSnap());
      thumbApi.scrollTo(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    },
    [thumbApi],
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <div className="flex flex-col gap-3 md:px-3">
      <div className="relative" role="region" aria-roledescription="carousel">
        <div ref={carouselRef} className="overflow-hidden">
          <div className={cn("-ml-4 flex")}>
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => scrollTo(index)}
                role="group"
                aria-roledescription="slide"
                className="min-w-0 shrink-0 grow-0 basis-full pl-4"
              >
                <Image
                  decoding="async"
                  loading="lazy"
                  radius="none"
                  classNames={{
                    wrapper: "aspect-square !max-w-none",
                  }}
                  className="h-full w-full object-cover object-center"
                  src={image.url}
                  alt={image.altText || ""}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  // srcSet={generateSrcSet(image.url)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 right-4 flex -translate-y-1/2 items-center gap-3">
          <Button
            isIconOnly
            variant="flat"
            className={"size-8 rounded-full"}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
          >
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            isIconOnly
            variant="flat"
            className={"size-8 rounded-full"}
            disabled={!canScrollNext}
            onClick={scrollNext}
          >
            <ArrowRightIcon className="size-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
        </div>
      </div>

      <div className="relative" role="region" aria-roledescription="carousel">
        <div ref={thumbRef} className="overflow-hidden max-md:px-3">
          <div className={cn("-ml-3 flex")}>
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => scrollTo(index)}
                role="group"
                aria-roledescription="slide"
                className={cn(
                  "min-w-0 shrink-0 grow-0 basis-1/3 pl-3 md:basis-1/4 lg:basis-1/5",
                )}
              >
                <Image
                  loading="lazy"
                  decoding="async"
                  radius="none"
                  classNames={{
                    wrapper: cn(
                      "relative aspect-square h-full w-full !max-w-none",
                      selectedIndex === index && "border border-primary",
                    ),
                  }}
                  className="h-full w-full object-cover object-center"
                  src={image.url}
                  alt={image.altText || ""}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  // sizes="(max-width: 768px) 33vw, (max-width: 1024px) 15vw, 10vw"
                  // srcSet={generateSrcSet(image.url)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
