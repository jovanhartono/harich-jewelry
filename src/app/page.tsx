import { Suspense } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { Card, CardBody } from "@nextui-org/card";
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
import { SectionMarker } from "@/components/ui/section-marker";
import { ArticleCard } from "@/components/blog/article-card";
import { title as titleStyle } from "@/components/primitives";
import { usp } from "@/const/content";
import {
  getBlogs,
  getHeroCarousel,
  getHomepageFirstSection,
} from "@/lib/shopify";
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
    <section className="container padding-section relative flex flex-col gap-6 max-md:grid-flow-row md:grid-cols-2">
      <div
        className="relative"
        style={{
          minHeight: "min(80vh, 900px)",
        }}
      >
        <div className="absolute inset-0 z-10 bg-black/30" />
        <div className="absolute bottom-0 left-0 top-0 z-20 flex w-1/2 flex-col items-start justify-center gap-3 p-6 text-white">
          <h1
            className={titleStyle({ className: "text-pretty tracking-tight" })}
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
    <section className="w-full py-6">
      <div className="container flex flex-col justify-between gap-9 md:h-[350px]">
        <SectionMarker>
          <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
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
      }}
    >
      <section className="container padding-section grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col">
          <h1 className={titleStyle({ size: "lg" })}>Featured Articles</h1>
          <div className="relative mt-3 flex items-center gap-6 lg:mt-6">
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
        <div className="lg:col-span-2">
          <CarouselContent>
            {blog.articles.edges.map(({ node: article }) => (
              <CarouselItem
                key={article.id}
                className="basis-full lg:basis-1/2"
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

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      {/*<CertificationSection />*/}
      <Suspense
        fallback={
          <Skeleton
            style={{
              minHeight: "min(80vh, 900px)",
            }}
          />
        }
      >
        <FirstSection />
      </Suspense>
      <USPSection />
      <Suspense>
        <BlogsSection />
      </Suspense>
    </div>
  );
}
