import { memo } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { ImageFragment, ProductFragment } from "@/__generated__/graphql";
import { Card, CardBody, CardProps } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";

import { formatRupiah } from "@/lib/utils";

export default function ProductCard({
  product,
  cardProps,
}: {
  product: ProductFragment;
  cardProps?: CardProps;
}) {
  const compareAtPrice = parseFloat(
    product.compareAtPriceRange.minVariantPrice.amount,
  );
  const price = parseFloat(product.priceRange.minVariantPrice.amount);

  return (
    <NextLink
      key={product.id}
      href={`/product/${product.handle}`}
      className="block h-full p-1"
    >
      <Card
        as="figure"
        shadow="none"
        radius="none"
        key={product.id}
        className="group h-full flex-none"
        {...cardProps}
      >
        <ProductCardImage
          featuredImage={product.featuredImage}
          title={product.title}
        />
        <CardBody
          as="figcaption"
          className="flex flex-col items-start gap-3 max-md:px-0"
        >
          <p
            aria-label="title"
            className="line-clamp-3 text-default-700"
            title={product.title}
          >
            {product.title}
          </p>
          <ProductCardPrice compareAtPrice={compareAtPrice} price={price} />
        </CardBody>
      </Card>
    </NextLink>
  );
}

const ProductCardPrice = memo(function ProductCardPrice({
  compareAtPrice,
  price,
}: {
  compareAtPrice: number;
  price: number;
}) {
  const isSale = compareAtPrice > price;
  const diff = Math.abs(compareAtPrice - price);

  return (
    <div
      aria-label="price"
      className="flex w-full flex-wrap gap-x-1 truncate font-medium"
    >
      {isSale ? (
        <>
          <s className="w-full font-normal text-default-400">
            {formatRupiah(compareAtPrice)}
          </s>
          <span>{formatRupiah(price)}</span>
          <Chip
            radius="sm"
            size="sm"
            className="bg-red-100 font-bold text-red-700"
          >
            {Math.round((diff / price) * 100)}%
          </Chip>
        </>
      ) : (
        formatRupiah(price)
      )}
    </div>
  );
});

const ProductCardImage = memo(function ProductCardImage({
  title,
  featuredImage,
}: {
  title: string;
  featuredImage?: ImageFragment | null;
}) {
  return (
    <Image
      radius="none"
      fill
      classNames={{
        wrapper: "aspect-square !max-w-none",
        zoomedWrapper: "h-full w-full",
      }}
      as={NextImage}
      alt={featuredImage?.altText || title}
      isZoomed
      src={featuredImage?.url}
      className="w-full object-cover object-center group-hover:scale-100 lg:group-hover:scale-105"
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
    />
  );
});
