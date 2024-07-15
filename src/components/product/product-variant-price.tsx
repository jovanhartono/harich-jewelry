"use client";

import { useMemo } from "react";
import { ProductOption, ProductVariantFragment } from "@/__generated__/graphql";
import { Chip } from "@nextui-org/chip";
import { SquarePercent } from "lucide-react";

import { formatRupiah } from "@/lib/utils";
import useProductVariant from "@/hooks/useProductVariant";

export default function ProductVariantPrice({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariantFragment[];
}) {
  const { selectedVariant } = useProductVariant({ options, variants });

  // checks whether the compareAtPrice is higher than price or not
  //  if so, display discounted price view
  const nett = parseFloat(selectedVariant?.price?.amount);
  const gross = parseFloat(selectedVariant?.compareAtPrice?.amount);

  const discount = useMemo(() => {
    const priceGap = Math.abs(nett - gross);

    return `${Math.round((priceGap / gross) * 100)}%`;
  }, [gross, nett]);

  return (
    <div className="flex items-center text-xl md:text-2xl">
      <div
        aria-label="Product Price"
        className="flex flex-wrap items-center gap-3 font-mono font-semibold"
      >
        {gross > nett ? (
          <>
            <Chip
              startContent={<SquarePercent className="size-4" />}
              radius="sm"
              className="bg-red-100 font-bold text-red-700"
            >
              {discount}
            </Chip>
            <span>{formatRupiah(nett)}</span>
            <s className="font-normal text-default-400">
              {formatRupiah(gross)}
            </s>
          </>
        ) : (
          formatRupiah(nett)
        )}
      </div>

      {selectedVariant?.availableForSale ? null : (
        <span className="text-danger">&nbsp;–&nbsp;Out of Stock</span>
      )}
    </div>
  );
}
