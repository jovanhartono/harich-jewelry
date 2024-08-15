import { memo, useMemo } from "react";
import { Chip } from "@nextui-org/chip";
import { SquarePercent } from "lucide-react";

import { formatRupiah } from "@/lib/utils";

export const Price = memo(function Price({
  price,
  compareAtPrice,
}: {
  price: any;
  compareAtPrice: any;
}) {
  const nett = parseFloat(price);
  const gross = parseFloat(compareAtPrice);

  const discount = useMemo(() => {
    const priceGap = Math.abs(nett - gross);

    return `${Math.round((priceGap / gross) * 100)}%`;
  }, [gross, nett]);

  return (
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
          <s className="font-normal text-default-400">{formatRupiah(gross)}</s>
        </>
      ) : (
        formatRupiah(nett)
      )}
    </div>
  );
});
