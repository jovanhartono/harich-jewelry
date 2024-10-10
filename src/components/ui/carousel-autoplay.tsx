"use client";

import { ReactNode } from "react";
import Autoplay from "embla-carousel-autoplay";

import { Carousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function CarouselAutoplay({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Carousel
      className={cn("mx-auto w-full", className)}
      opts={{
        loop: true,
        align: "start",
      }}
      plugins={[
        Autoplay({
          delay: 10000,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      {children}
    </Carousel>
  );
}
