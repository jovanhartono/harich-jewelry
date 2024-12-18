"use client";

import { useProduct } from "@/app/product/provider";
import { Chip } from "@nextui-org/chip";

import { Price } from "@/components/product/price";

export default function ProductVariantPrice() {
  const { selectedVariant } = useProduct();

  return (
    <div className="flex items-center gap-x-3 text-xl">
      {selectedVariant?.availableForSale ? null : (
        <Chip radius="sm" className="bg-red-100 font-bold text-red-700">
          Sold Out
        </Chip>
      )}
      {selectedVariant && (
        <Price
          price={selectedVariant.price.amount}
          compareAtPrice={selectedVariant.compareAtPrice?.amount}
        />
      )}
    </div>
  );
}
