import { Suspense } from "react";
import { ImageConnection } from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/skeleton";

import { title } from "@/components/primitives";
import ProductDescription from "@/components/product/product-description";
import ProductImageGallery from "@/components/product/product-image-gallery";
import { ProductVariantsOptions } from "@/components/product/product-variant-options";
import ProductVariantPrice from "@/components/product/product-variant-price";
import { getProductByHandle } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle);

  // console.log(product.options);

  return (
    <div className="flex flex-col gap-12">
      <section className="md:container flex flex-col gap-12 *:flex-1 md:flex-row md:py-12">
        <div>
          <ProductImageGallery images={product.images as ImageConnection} />
        </div>
        <div className="max-md:container flex flex-col gap-6 lg:gap-9">
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
    </div>
  );
}
