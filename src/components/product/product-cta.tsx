"use client";

import { memo } from "react";
import { useProduct } from "@/app/product/provider";

import { AddToLocalStorage } from "@/components/add-to-local-storage";
import AddToCart from "@/components/cart/add-to-cart";
import { PRODUCT_TYPES } from "@/lib/constant";
import { cn } from "@/lib/utils";

export const ProductCTA = memo(function ProductCTA() {
  const { product, selectedVariant } = useProduct();

  return (
    <div className="bottom-float-wrapper">
      {/*{(product.productType === PRODUCT_TYPES.Setting ||*/}
      {/*  product.productType === PRODUCT_TYPES.Stone) && (*/}
      {/*  // akses local storage*/}
      {/*  <AddToLocalStorage*/}
      {/*    type={product.productType as keyof typeof PRODUCT_TYPES}*/}
      {/*    product={product}*/}
      {/*  />*/}
      {/*)}*/}
      {/*<ProductWhatsappButton />*/}
      {/*<AddToCart*/}
      {/*  lines={{*/}
      {/*    merchandiseId: selectedVariant?.id || "",*/}
      {/*    quantity: 1,*/}
      {/*  }}*/}
      {/*/>*/}
    </div>
  );
});
