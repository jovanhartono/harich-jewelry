import { memo } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import type {
  CompactProductFragment,
  ImageFragment,
} from "@/__generated__/graphql";
import { Card, CardBody, CardProps } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";

import { formatRupiah, generateSrcSet } from "@/lib/utils";

export const ProductCardContent = memo(function ProductCardContent({
  product,
  cardProps,
}: {
  product: CompactProductFragment;
  cardProps?: CardProps;
}) {
  const compareAtPrice = parseFloat(
    product.compareAtPriceRange.minVariantPrice.amount,
  );
  const price = parseFloat(product.priceRange.minVariantPrice.amount);

  return (
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
        alt={product.title}
      />
      <CardBody
        as="figcaption"
        className="flex flex-col items-start gap-3 max-md:px-0"
      >
        <p
          aria-label="product-title"
          className="line-clamp-3 text-default-700"
          title={product.title}
        >
          {product.title}
        </p>
        <ProductCardPrice compareAtPrice={compareAtPrice} price={price} />
      </CardBody>
    </Card>
  );
});

export default function ProductCard({
  product,
  cardProps,
  withLink = true,
}: {
  product: CompactProductFragment;
  cardProps?: CardProps;
  withLink?: boolean;
}) {
  const CardContent = (
    <ProductCardContent product={product} cardProps={cardProps} />
  );

  return withLink ? (
    <NextLink
      prefetch
      key={product.id}
      href={`/product/${product.handle}`}
      className="block h-full p-1"
    >
      {CardContent}
    </NextLink>
  ) : (
    CardContent
  );
}

export const ProductCardPrice = memo(function ProductCardPrice({
  compareAtPrice,
  price,
}: {
  compareAtPrice: number;
  price: number;
}) {
  const isSale = compareAtPrice > price;
  const diff = Math.abs(compareAtPrice - price);

  // TODO: bikin starting price jika ada compare at price nya
  return (
    <div
      aria-label="price"
      className="mt-auto flex w-full flex-wrap gap-x-1 truncate font-mono font-medium"
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

export const ProductCardImage = memo(function ProductCardImage({
  alt,
  featuredImage,
}: {
  alt: string;
  featuredImage?: ImageFragment | null;
}) {
  return (
    <NextImage
      alt={featuredImage?.altText || alt}
      src={featuredImage?.url}
      width={300}
      height={300}
      className="aspect-square w-full object-cover object-center transition-transform hover:scale-100 lg:group-hover:scale-105"
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
    />
  );
});
