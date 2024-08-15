"use client";

import { useProduct } from "@/app/product/provider";

import { Price } from "@/components/product/price";

export default function ProductVariantPrice() {
  const { selectedVariant } = useProduct();

  return (
    <div className="flex items-center text-xl md:text-2xl">
      <Price
        price={selectedVariant?.price.amount}
        compareAtPrice={selectedVariant?.compareAtPrice?.amount}
      />

      {selectedVariant?.availableForSale ? null : (
        <span className="text-danger">&nbsp;–&nbsp;Out of Stock</span>
      )}
    </div>
  );
}
