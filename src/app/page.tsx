import { Suspense } from "react";
import NextImage, { getImageProps } from "next/image";
import NextLink from "next/link";
import { Card } from "@nextui-org/card";
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
import { WordRotate } from "@/components/ui/word-rotate";
import { ArticleCard } from "@/components/blog/article-card";
import { subtitle, title as titleStyle } from "@/components/primitives";
import { usp } from "@/const/content";
import {
  getBlogs,
  getHeroCarousel,
  getHomepageFirstSection,
  getHomepageMainCollections,
  getShopByRingShape,
} from "@/lib/shopify";

async function Hero() {
  const carousels = await getHeroCarousel();

  return (
    <CarouselAutoplay>
      <CarouselContent className="ml-0">
        {carousels.map((carousel, index) => {
          const {
            props: { srcSet: desktop },
          } = getImageProps({
            src: carousel.desktop_image?.url,
            sizes: "100vw",
            width: 1400,
            height: 560,
            priority: index === 0,
            alt:
              carousel.desktop_image?.altText ||
              `Carousel Image Desktop ${index + 1}`,
          });
          const {
            props: { srcSet: mobile, ...rest },
          } = getImageProps({
            src: carousel.mobile_image?.url,
            sizes: "100vw",
            width: 500,
            height: 625,
            priority: index === 0,
            alt:
              carousel.desktop_image?.altText ||
              `Carousel Image Mobile ${index + 1}`,
          });

          return (
            <CarouselItem key={index} className="pl-0">
              <Card
                shadow="none"
                radius="none"
                className="relative aspect-[4/5] w-full md:aspect-[5/2]"
              >
                <picture className="h-full w-full">
                  <source media="(max-width: 767px)" srcSet={mobile} />
                  <source media="(min-width: 768px)" srcSet={desktop} />
                  <img
                    {...rest}
                    className="z-0 h-full w-full object-cover object-center"
                    alt="Harich Jewelry Hero Image"
                  />
                </picture>
                <div className="absolute inset-0 z-20 flex">
                  <div className="container my-auto flex flex-col gap-3 max-sm:items-center">
                    <h1
                      className={titleStyle({
                        size: "lg",
                        className: "text-balance max-sm:text-center",
                      })}
                    >
                      {carousel.title}
                    </h1>
                    <p className="text-balance text-lg max-md:text-sm max-sm:text-center">
                      {carousel.description}
                    </p>
                    <NextLink
                      prefetch
                      href={carousel.url}
                      className={buttonStyle({
                        color: "primary",
                        className: "mt-6 h-12 max-w-[280px] px-5 font-medium",
                        size: "lg",
                        radius: "sm",
                      })}
                    >
                      Browse Our Collection
                    </NextLink>
                  </div>
                </div>
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
            <div
              className={titleStyle({
                size: "lg",
                className: "text-balance text-center",
              })}
            >
              <WordRotate
                className="mr-2 inline-flex justify-center text-center"
                words={["Exquisite", "Refined", "Elegant"]}
              />
              <span>
                Diamonds, Fully Certified by GIA & IGI for Unmatched Quality
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
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
    <section className="padding-section w-full">
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
      <section className="container padding-section grid grid-cols-1">
        <p className="mb-3 font-mono font-medium uppercase tracking-widest">
          Latest Article
        </p>
        <div className="mb-6 flex items-center justify-between">
          <h1 className={titleStyle({ size: "lg" })}>Stay Updated</h1>
          {/*  only show carousel indicator when total article fetched is more than 3, indicating overlay */}
          {blog.articles.edges.length > 3 ? (
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
          ) : null}
        </div>
        <CarouselContent>
          {blog.articles.edges.slice(0, 10).map(({ node: article }) => (
            <CarouselItem key={article.id} className="basis-full md:basis-1/3">
              <NextLink
                prefetch
                href={`/blogs/${blog.handle}/${article.handle}`}
                className="block h-full p-1"
              >
                <ArticleCard article={article} />
              </NextLink>
            </CarouselItem>
          ))}
        </CarouselContent>
      </section>
    </Carousel>
  );
}

async function ShopByShape() {
  const shapes = await getShopByRingShape();

  return (
    <section className="container flex h-[375px] flex-col justify-center gap-6 text-balance">
      <div className="flex flex-col gap-2">
        <h1 className={titleStyle()}>Explore Our Engagement Rings</h1>
        <p className="text-balance font-light text-default-700 max-md:text-small">
          Discover our exquisite collection of engagement rings, available in a
          range of classic stone shapes. Each design reflects timeless elegance
          and exceptional craftsmanship.
        </p>
      </div>
      <div className="overflow flex w-full touch-pan-x snap-x snap-proximity gap-3 overflow-auto scrollbar-hide">
        {shapes.map((shape) => (
          <NextLink
            key={shape.id}
            className="flex-1 shrink-0 basis-1/4 snap-start snap-always md:basis-20"
            href={`/collections/engagement-rings?filter.p.m.stone.shape=${shape.label}`}
          >
            <figure className="flex cursor-pointer flex-col items-center gap-3">
              <NextImage
                width={100}
                height={100}
                className="aspect-square w-full shrink-0 object-cover"
                src={shape.image?.url}
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

async function MainCollection() {
  const { title, description, collections } =
    await getHomepageMainCollections();

  return (
    <section className="padding-section w-full bg-primary md:my-6">
      <CarouselAutoplay className="container grid gap-6 md:grid-cols-3">
        <div className="flex flex-col items-end md:col-span-1">
          <h1
            className={titleStyle({
              size: "lg",
              className:
                "col-span-1 mt-4 text-pretty tracking-tighter md:text-end",
            })}
          >
            {title}
          </h1>
          {description ? (
            <p className={subtitle({ className: "mt-3 md:text-end" })}>
              {description}
            </p>
          ) : null}
          {collections.length > 2 ? (
            <div className="relative mb-9 mt-auto flex items-center gap-6 max-lg:hidden">
              <CarouselPrevious
                variant="light"
                className="static size-10 translate-y-0 p-0"
                radius="full"
              />
              <CarouselNext
                variant="light"
                className="static size-10 translate-y-0 p-0"
                radius="full"
              />
            </div>
          ) : null}
        </div>
        <div className="md:order-first md:col-span-2">
          <CarouselContent className="col-span-2">
            {collections.map((collection, idx) => (
              <CarouselItem key={idx} className="basis-5/6 md:basis-1/2">
                <NextLink prefetch href={`/collections/${collection.handle}`}>
                  <figure className="flex w-full flex-col gap-3">
                    <NextImage
                      src={collection.image?.url}
                      alt={collection.image?.altText || collection.title}
                      width={400}
                      height={550}
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="aspect-[4/5.5] w-full object-cover object-center"
                    />
                    <figcaption className="text-lg font-semibold tracking-tight">
                      {collection.title}
                    </figcaption>
                  </figure>
                </NextLink>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </CarouselAutoplay>
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
          Reliability and Trust. <br />
          Backed by Thousands of Customers
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
              minHeight: "min(80vh, 800px)",
            }}
          />
        }
      >
        <FirstSection />
      </Suspense>
      <Suspense fallback={<section className="h-[375px]" />}>
        <ShopByShape />
      </Suspense>
      <Suspense fallback={null}>
        <MainCollection />
      </Suspense>
      <USPSection />
      <NumberSection />
      <Suspense fallback={null}>
        <BlogsSection />
      </Suspense>
    </div>
  );
}
