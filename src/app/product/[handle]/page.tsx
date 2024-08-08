import { Suspense } from "react";
import type { Metadata } from "next";
import { ImageConnection } from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/skeleton";

import { title } from "@/components/primitives";
import ProductDescription from "@/components/product/product-description";
import ProductImageGallery from "@/components/product/product-image-gallery";
import { ProductVariantsOptions } from "@/components/product/product-variant-options";
import ProductVariantPrice from "@/components/product/product-variant-price";
import { RingShapeList } from "@/components/product/ring-shape-list";
import { StoneCertificate } from "@/components/product/stone-certificate";
import { StoneFourC } from "@/components/product/stone-four-c";
import { PRODUCT_TYPES } from "@/lib/constant";
import { getProductByHandle } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const { title, seo } = await getProductByHandle(params.handle);

  return {
    title: seo.title || title,
    description: seo.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle);

  return (
    <div className="flex flex-col gap-12 max-md:pb-6 md:py-12">
      <section className="md:container flex flex-col gap-12 *:flex-1 md:flex-row">
        <div>
          <ProductImageGallery images={product.images as ImageConnection} />
        </div>
        <div className="max-md:container flex flex-col gap-6 lg:gap-6">
          <div className="flex flex-col">
            <h1
              aria-label="Product Title"
              className={title({ className: "mb-3 leading-snug" })}
            >
              {product.title}
            </h1>
            <Suspense fallback={<Skeleton className="h-8 rounded-large" />}>
              <ProductVariantPrice
                options={product.options}
                variants={product.variants}
              />
            </Suspense>
          </div>

          {product.productType === PRODUCT_TYPES.STONE &&
          product.certificate ? (
            <StoneCertificate image={product.certificate} />
          ) : null}

          {product.ringShapeReference.length > 0 ? (
            <RingShapeList
              ringShapeReference={product.ringShapeReference}
              paramsHandle={params.handle}
            />
          ) : null}

          <ProductVariantsOptions
            options={product.options}
            variants={product.variants}
          />

          <div
            className={cn(
              "flex items-center gap-3 bg-white",
              "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 max-md:h-20 max-md:border-t max-md:border-t-default-300 max-md:px-3 max-md:py-3",
            )}
          >
            <Button color="primary" className="w-full max-w-md" radius="sm">
              Add to Cart
            </Button>
            {/*<ProductWhatsappButton />*/}
            {/*<AddToCart*/}
            {/*  options={product.options}*/}
            {/*  variants={product.variants as ProductVariant[]}*/}
            {/*/>*/}
          </div>

          <Divider />
          <dl className="flex flex-col gap-3">
            <dt
              id="Product Description"
              className="text-lg font-semibold text-foreground"
            >
              About This Product
            </dt>
            <dd>
              <ProductDescription html={product.descriptionHtml} />
            </dd>
          </dl>
        </div>
      </section>

      <section className="container">
        {product.productType === PRODUCT_TYPES.STONE && (
          <StoneFourC specifications={product.stoneSpecifications} />
        )}
      </section>
    </div>
  );
}
