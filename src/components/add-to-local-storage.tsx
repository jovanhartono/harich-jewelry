"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ProductFragment,
  ProductVariantFragment,
} from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";

import { LOCAL_STORAGE_KEYS, PRODUCT_TYPES } from "@/lib/constant";
import useProductVariant from "@/hooks/useProductVariant";

export const AddToLocalStorage = memo(function LocalStorageAddSettings({
  product,
  type,
}: {
  product: Omit<ProductFragment, "variants"> & {
    variants: ProductVariantFragment[];
  };
  type: keyof typeof PRODUCT_TYPES;
}) {
  const { push } = useRouter();

  const { selectedVariant } = useProductVariant({
    options: product.options,
    variants: product.variants,
  });

  const handleOnPress = useCallback(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS[type],
      JSON.stringify({
        product,
        selectedVariant,
      }),
    );

    toast.success("Choose Settings Success!", {
      closeButton: true,
      action: {
        label: "Choose Stones",
        onClick: () => {
          push("/engagement-rings/stone");
        },
      },
    });
  }, [product]);

  return (
    <Button
      color="primary"
      onPress={handleOnPress}
      className="w-full max-w-md"
      radius="sm"
    >
      {type === PRODUCT_TYPES.Setting && "Choose This Settings"}
      {type === PRODUCT_TYPES.Stone && "Choose Diamonds"}
    </Button>
  );
});
