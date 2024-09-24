import { Suspense } from "react";
import type { Metadata } from "next";
import { ImageConnection } from "@/__generated__/graphql";
import { ProductProvider } from "@/app/product/provider";
import { Skeleton } from "@nextui-org/skeleton";

import { SectionMarker } from "@/components/ui/section-marker";
import { subtitle, title } from "@/components/primitives";
import ProductDescription from "@/components/product/product-description";
import { ProductDynamicSection } from "@/components/product/product-dynamic-section";
import ProductImageGallery from "@/components/product/product-image-gallery";
import ProductsRecommendationsCarousel from "@/components/product/product-recommendations-carousel";
import { ProductVariantsOptions } from "@/components/product/product-variant-options";
import ProductVariantPrice from "@/components/product/product-variant-price";
import { RingShapeList } from "@/components/product/ring-shape-list";
import { StoneFourC } from "@/components/product/stone-four-c";
import { PRODUCT_TYPES } from "@/lib/constant";
import { getProductByHandle, getProductRecommendations } from "@/lib/shopify";
import { handleProductQuery } from "@/lib/utils";

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
  const productByHandle = await getProductByHandle(params.handle);
  const product = handleProductQuery(productByHandle)!;

  return (
    <ProductProvider product={productByHandle}>
      <div className="flex flex-col gap-12">
        <section className="md:container flex flex-col gap-9 md:pt-9 lg:flex-row">
          <div className="lg:basis-2/3">
            <ProductImageGallery images={product.images as ImageConnection} />
          </div>
          <div className="max-md:container sticky top-[116px] flex h-1/3 flex-col gap-6 lg:basis-1/3 lg:gap-6">
            <div className="flex flex-col">
              <h1
                aria-label="Product Title"
                className={title({
                  className: "mb-3 leading-snug",
                })}
              >
                {product.title}
              </h1>
              <ProductVariantPrice />
            </div>

            {product.shapeReference.length > 0 ? (
              <RingShapeList
                ringShapeReference={product.shapeReference}
                paramsHandle={params.handle}
              />
            ) : null}

            <ProductVariantsOptions />

            <ProductDynamicSection />

            <dl className="flex flex-col gap-1">
              <dt
                id="Product Description"
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                About This Product
              </dt>
              <dd>
                <ProductDescription html={product.descriptionHtml} />
              </dd>
            </dl>
          </div>
        </section>

        {product.productType === PRODUCT_TYPES.Stone && (
          <section className="container">
            <StoneFourC specifications={product.stoneSpecifications} />
          </section>
        )}

        <section className="container flex flex-col gap-9 pb-9">
          <SectionMarker>
            <h1 className={title({ size: "sm" })}>We Recommend</h1>
            <Suspense fallback={<ProductRecommendationSkeleton />}>
              <ProductsRecommendation id={product.id} />
            </Suspense>
          </SectionMarker>
        </section>
      </div>
    </ProductProvider>
  );
}

async function ProductsRecommendation({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length)
    return (
      <div className="flex items-center justify-center rounded-large bg-default-100 py-6 md:py-12">
        <p className={subtitle({ class: "text-balance text-center" })}>
          Uh-oh! No matching products found for your preferences. Explore our
          diverse categories or check out featured items. Stay tuned for new
          additions, and happy browsing!
        </p>
      </div>
    );

  return <ProductsRecommendationsCarousel products={relatedProducts} />;
}

export function ProductRecommendationSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            className="flex flex-none basis-2/3 flex-col justify-between gap-3 bg-white p-4 md:basis-1/3 md:p-6 xl:basis-1/4"
            key={index}
          >
            <Skeleton className="h-20 w-full flex-col rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-7 w-full rounded-lg" />
          </div>
        ))}
    </div>
  );
}
