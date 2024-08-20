import type { Metadata } from "next";
import { ImageConnection } from "@/__generated__/graphql";
import { ProductProvider } from "@/app/product/provider";

import { title } from "@/components/primitives";
import ProductDescription from "@/components/product/product-description";
import { ProductDynamicSection } from "@/components/product/product-dynamic-section";
import ProductImageGallery from "@/components/product/product-image-gallery";
import { ProductVariantsOptions } from "@/components/product/product-variant-options";
import ProductVariantPrice from "@/components/product/product-variant-price";
import { RingShapeList } from "@/components/product/ring-shape-list";
import { StoneFourC } from "@/components/product/stone-four-c";
import { PRODUCT_TYPES } from "@/lib/constant";
import { getProductByHandle } from "@/lib/shopify";
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
      <div className="flex flex-col gap-12 max-md:pb-6 md:py-12">
        <section className="md:container flex flex-col gap-12 *:flex-1 md:flex-row">
          <div>
            <ProductImageGallery images={product.images as ImageConnection} />
          </div>
          <div className="max-md:container flex flex-col gap-6 lg:gap-6">
            <div className="flex flex-col">
              <h1
                aria-label="Product Title"
                className={title({
                  className: "mb-3 text-pretty leading-snug",
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

        <section className="container">
          {product.productType === PRODUCT_TYPES.Stone && (
            <StoneFourC specifications={product.stoneSpecifications} />
          )}
        </section>
      </div>
    </ProductProvider>
  );
}
