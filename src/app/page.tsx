import NextImage from "next/image";
import NextLink from "next/link";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { button as buttonStyle } from "@nextui-org/react";
import { ArrowUpRight } from "lucide-react";

import {
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import CarouselAutoplay from "@/components/ui/carousel-autoplay";
import { title as titleStyle } from "@/components/primitives";
import { usp } from "@/const/content";
import { getHeroCarousel, getHomepageFirstSection } from "@/lib/shopify";
import { cn, generateSrcSet } from "@/lib/utils";

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

async function FirstSection() {
  const { title, description, cta, video } = await getHomepageFirstSection();

  return (
    <section className="container grid gap-6 max-md:grid-flow-row md:grid-cols-2">
      <div className="flex flex-col items-start gap-3">
        <h1
          className={titleStyle({ className: "text-pretty tracking-tighter" })}
        >
          {title}
        </h1>
        <p className="text-pretty text-default-700">{description}</p>
        {cta ? (
          <Link
            className={buttonStyle({
              className: "bg-black text-white",
            })}
            href={cta.url}
          >
            {cta.text}
            <ArrowUpRight className="size-4" />
          </Link>
        ) : null}
      </div>
      <video
        autoPlay
        playsInline
        muted
        loop
        draggable={false}
        poster={video?.previewImage?.url}
      >
        {video?.sources.map((source, idx) => (
          <source key={idx} src={source.url} type={source.mimeType} />
        ))}
      </video>
    </section>
  );
}

function CertificationSection() {
  return (
    <section className="w-full bg-primary py-6">
      <div className="container flex items-center justify-center gap-6">
        {/*<h1 className="text-2xl font-medium tracking-tight">*/}
        {/*  Diamonds at Harich Jewelry are Fully Certified*/}
        {/*</h1>*/}
        <NextImage
          alt="igi-logo"
          width={200}
          height={74}
          src="https://cdn.shopify.com/s/files/1/0611/4158/1902/files/igi-logo.webp?v=1723205496"
        />
        <NextImage
          alt="gia-logo"
          width={200}
          height={70}
          src="https://cdn.shopify.com/s/files/1/0611/4158/1902/files/gia-logo.webp?v=1723205495"
        />
      </div>
    </section>
  );
}

function USPSection() {
  return (
    <section className="flex items-center">
      <div className="container flex items-center gap-12 rounded-large max-md:flex-col md:h-[400px]">
        <div className="flex gap-6 max-md:flex-col">
          <div className="basis-1/2">
            <h1 className={titleStyle({ className: "tracking-tighter" })}>
              Why Harich Jewelry ?
            </h1>
            <p className="mt-3 text-balance text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid
              autem, beatae culpa deserunt dolor est mollitia quae rem vero
              voluptas.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-6">
            {usp.map((item, idx) => (
              <li
                className={cn("space-y-3", {
                  "border-t border-dashed border-t-amber-700/50 pt-6": idx > 1,
                })}
                key={idx}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center rounded-medium bg-sandy/40 p-2.5">
                    <item.icon className="size-6 text-amber-700" />
                  </div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                </div>
                <p className="text-pretty text-default-700">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-9 pb-12 lg:gap-12">
      <Hero />
      <FirstSection />
      {/*<CertificationSection />*/}
      <USPSection />
    </div>
  );
}
