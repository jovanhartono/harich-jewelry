"use client";

import { ReactNode } from "react";
import Autoplay from "embla-carousel-autoplay";

import { Carousel } from "@/components/ui/carousel";

export default function CarouselAutoplay({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Carousel
      className="w-full sm:container"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      {children}
    </Carousel>
  );
}
