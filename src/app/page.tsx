import { Suspense } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Skeleton } from "@nextui-org/skeleton";
import { button as buttonStyle } from "@nextui-org/theme";
import { ArrowUpRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselAutoplay from "@/components/ui/carousel-autoplay";
import DotPattern from "@/components/ui/dot-pattern";
import NumberTicker from "@/components/ui/number-ticker";
import { SectionMarker } from "@/components/ui/section-marker";
import { ArticleCard } from "@/components/blog/article-card";
import { title as titleStyle } from "@/components/primitives";
import { usp } from "@/const/content";
import {
  getBlogs,
  getHeroCarousel,
  getHomepageFirstSection,
  getShopByRingShape,
} from "@/lib/shopify";
import { generateSrcSet } from "@/lib/utils";

async function Hero() {
  const carousels = await getHeroCarousel();

  return (
    <CarouselAutoplay>
      <CarouselContent>
        {carousels.map((carousel, index) => {
          return (
            <CarouselItem key={index} className="pl-0">
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
                  <img
                    decoding="async"
                    loading="lazy"
                    className="z-0 h-full w-full object-cover object-center"
                    src={carousel.desktop_image?.url}
                    alt={carousel.desktop_image?.altText || ""}
                    sizes="100vw"
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
    <section>
      <div
        className="relative"
        style={{
          minHeight: "min(80vh, 800px)",
        }}
      >
        <div className="absolute inset-0 z-20 text-white">
          <div className="container h-full">
            <div className="flex h-full w-full flex-col items-start justify-center gap-3 sm:w-1/2">
              <h1
                className={titleStyle({ className: "text-pretty", size: "lg" })}
              >
                {title}
              </h1>
              <p className="text-pretty">{description}</p>
              {cta ? (
                <Link
                  className={buttonStyle({
                    radius: "sm",
                    className: "mt-6",
                    color: "primary",
                    variant: "bordered",
                  })}
                  href={cta.url}
                >
                  {cta.text}
                  <ArrowUpRight className="size-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        {/* video overlay */}
        <div className="absolute inset-0 z-10 bg-black/30" />
        <video
          autoPlay
          playsInline
          muted
          loop
          preload="none"
          draggable={false}
          poster={video?.previewImage?.url}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {video?.sources.map((source, idx) => (
            <source key={idx} src={source.url} type={source.mimeType} />
          ))}
        </video>
      </div>
    </section>
  );
}

function CertificationSection() {
  return (
    <section className="padding-section w-full bg-primary lg:p-6">
      <div className="container">
        <SectionMarker>
          <div className="flex flex-col gap-12 py-12">
            <h1
              className={titleStyle({ size: "lg", className: "text-balance" })}
            >
              Exquisite Diamonds, Fully Certified by GIA & IGI for Unmatched
              Quality
            </h1>
            <div className="flex flex-wrap items-center gap-6">
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
          </div>
        </SectionMarker>
      </div>
    </section>
  );
}

function USPSection() {
  return (
    <section className="w-full">
      <div className="container flex flex-col justify-between gap-9 md:min-h-[350px]">
        <SectionMarker>
          <ul className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:grid-cols-4">
            {usp.map((item, idx) => (
              <li key={idx} className="flex flex-col gap-3">
                <item.icon className="block size-5 text-amber-800 md:size-6" />
                <h2
                  className={titleStyle({
                    size: "sm",
                    className: "font-normal",
                  })}
                >
                  {item.title}
                </h2>
                <p className="text-default-700 max-md:text-sm">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </SectionMarker>
      </div>
    </section>
  );
}

async function BlogsSection() {
  const [blog] = await getBlogs(1);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <section className="container padding-section grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col">
          <h1 className={titleStyle({ size: "lg" })}>Featured Articles</h1>
          <div className="relative mt-3 flex items-center gap-6 max-lg:hidden lg:mt-6">
            <CarouselPrevious
              variant="flat"
              className="static size-10 translate-y-0 border-black p-0"
              radius="full"
            />
            <CarouselNext
              variant="flat"
              className="static size-10 translate-y-0 border-black p-0"
              radius="full"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <CarouselContent>
            {blog.articles.edges.map(({ node: article }) => (
              <CarouselItem
                key={article.id}
                className="basis-full md:basis-1/2"
              >
                <NextLink
                  prefetch
                  href={`/blogs/${article.handle}/${article.handle}`}
                  className="block h-full p-1"
                >
                  <ArticleCard article={article} />
                </NextLink>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </section>
    </Carousel>
  );
}

async function ShopByShape() {
  const shapes = await getShopByRingShape();

  return (
    <section className="padding-section container flex flex-col gap-6 text-balance">
      <div className="flex flex-col gap-2">
        <h1 className={titleStyle()}>Explore Our Engagement Rings</h1>
        <p className="text-balance font-light text-default-700 max-md:text-small">
          Discover our exquisite collection of engagement rings, available in a
          range of classic stone shapes. Each design reflects timeless elegance
          and exceptional craftsmanship.
        </p>
      </div>
      <div className="overflow flex w-full touch-pan-x snap-x snap-mandatory gap-3 overflow-auto">
        {shapes.map((shape) => (
          <NextLink
            key={shape.id}
            prefetch
            className="flex-1 shrink-0 basis-1/4 snap-start snap-always md:basis-20"
            href={`/collections/engagement-rings?filter.p.m.stone.shape=${shape.label}`}
          >
            <figure className="flex cursor-pointer flex-col items-center gap-3">
              <img
                className="aspect-square shrink-0 object-contain"
                decoding="async"
                loading="lazy"
                src={`${shape.image?.url}&width=100`}
                alt={shape.label}
              />
              <figcaption className="text-center text-small">
                {shape.label}
              </figcaption>
            </figure>
          </NextLink>
        ))}
      </div>
    </section>
  );
}

function NumberSection() {
  const data = [
    {
      title: "Happy Customers",
      count: 25000,
      measurement: "+",
    },
    {
      title: "Melted Gold",
      count: 250,
      measurement: "kg",
    },
    {
      title: "Spending Hours",
      count: 3600,
      measurement: "Hours",
    },
  ];

  return (
    <section className="relative mt-12">
      <DotPattern />
      <div className="container padding-section relative flex flex-col justify-center gap-6 md:min-h-[400px] md:gap-9">
        <h1
          className={titleStyle({
            size: "lg",
            className: "text-balance md:w-2/3",
          })}
        >
          Reliability and Trust Backed by Thousands of Customers
        </h1>
        <div className="flex w-2/3 max-md:flex-col max-md:gap-3 md:items-center md:justify-between">
          {data.map((item, idx) => (
            <div key={idx}>
              <NumberTicker
                value={item.count}
                className={titleStyle({
                  size: "lg",
                  className: "tracking-wide",
                })}
              />
              <p className="mt-3 font-mono font-medium uppercase tracking-wider text-default-700">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <Suspense
        fallback={<Skeleton className="aspect-[4/5] w-full md:aspect-[5/2]" />}
      >
        <Hero />
      </Suspense>
      <CertificationSection />
      <Suspense
        fallback={
          <Skeleton
            style={{
              minHeight: "min(70vh, 600px)",
            }}
          />
        }
      >
        <FirstSection />
      </Suspense>
      <Suspense>
        <ShopByShape />
      </Suspense>
      <USPSection />
      <NumberSection />
      <Suspense>
        <BlogsSection />
      </Suspense>
    </div>
  );
}
