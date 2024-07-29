import NextLink from "next/link";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import {
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import CarouselAutoplay from "@/components/ui/carousel-autoplay";
import { getHeroCarousel } from "@/lib/shopify";
import { generateSrcSet } from "@/lib/utils";

async function Hero() {
  const carousels = await getHeroCarousel();

  return (
    <CarouselAutoplay>
      <CarouselContent>
        {carousels.map((carousel, index) => {
          return (
            <CarouselItem key={index}>
              <Card
                as={NextLink}
                href={carousel.url}
                shadow="none"
                radius="none"
                className="aspect-[4/5] w-full md:aspect-[5/2]"
              >
                <picture className="h-full w-full">
                  <source
                    media="(max-width: 767px)"
                    srcSet={generateSrcSet(carousel.mobile_image?.url)}
                  />
                  <source
                    media="(min-width: 768px)"
                    srcSet={generateSrcSet(carousel.desktop_image?.url)}
                  />
                  <Image
                    removeWrapper
                    className="z-0 h-full w-full object-cover object-center"
                    src={carousel.desktop_image?.url}
                    alt={carousel.desktop_image?.altText || ""}
                    sizes="100vw"
                    radius="none"
                  />
                </picture>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselDots />
    </CarouselAutoplay>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-9 lg:gap-12">
      <Hero />
    </div>
  );
}
