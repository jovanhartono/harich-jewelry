"use client";

import dynamic from "next/dynamic";
import { useProduct } from "@/app/product/provider";
import { StoneModalProvider } from "@/providers/stone-modal-provider";

import { ProductCTA } from "@/components/product/product-cta";
import { PRODUCT_TYPES } from "@/lib/constant";

const ProductSettingSection = dynamic(
  () =>
    import("@/components/product/setting/product-setting-section").then(
      (m) => m.ProductSettingSection,
    ),
  {
    ssr: false,
  },
);

const StoneSection = dynamic(() =>
  import("@/components/product/stone/product-stone-section").then(
    (m) => m.StoneSection,
  ),
);

export function ProductDynamicSection() {
  const { product } = useProduct();

  if (product.productType === PRODUCT_TYPES.Setting) {
    return (
      <StoneModalProvider>
        <ProductSettingSection />
      </StoneModalProvider>
    );
  }

  if (product.productType === PRODUCT_TYPES.Stone) {
    return <StoneSection />;
  }

  return <ProductCTA />;
}
