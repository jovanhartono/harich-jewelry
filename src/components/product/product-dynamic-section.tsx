"use client";

import { memo, useCallback, useMemo } from "react";
import NextLink from "next/link";
import {
  AttributeInput,
  CartLineInput,
  ProductFragment,
} from "@/__generated__/graphql";
import { useProduct } from "@/app/product/provider";
import {
  StoneModalProvider,
  useStoneModal,
} from "@/provider/stone-modal-provider";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { GemIcon } from "lucide-react";

import AddToCart from "@/components/cart/add-to-cart";
import { Price } from "@/components/product/price";
import { ProductCTA } from "@/components/product/product-cta";
import { PRODUCT_TYPES } from "@/lib/constant";
import { useProductLocalStorage } from "@/hooks/useProductLocalStorage";

const SettingsSection = memo(function SettingsSection() {
  const { product, selectedVariant } = useProduct();
  const { stone, setStone } = useProductLocalStorage();
  const { open } = useStoneModal();

  const openStoneModal = useCallback(
    () => open(product.shape.value),
    [open, product.shape.value],
  );

  const lines: CartLineInput[] = useMemo(() => {
    if (stone && selectedVariant) {
      const settingAttributes: AttributeInput[] = [];

      // if (engraving) {
      //     settingAttributes.push({
      //         key: CART_LINE_ATTRIBUTE_KEYS.ENGRAVING,
      //         value: engraving,
      //     });
      // }
      //
      // if (size) {
      //     settingAttributes.push({
      //         key: CART_LINE_ATTRIBUTE_KEYS.SIZE,
      //         value: size,
      //     });
      // }

      return [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          attributes: settingAttributes,
        },
        {
          merchandiseId: stone.selectedVariant.id,
          quantity: 1,
        },
      ];
    }

    return [];
  }, [selectedVariant, stone]);

  if (!stone) {
    return (
      <div className="flex flex-wrap max-md:flex-col md:items-center md:gap-3">
        <span
          onClick={openStoneModal}
          className="inline-flex cursor-pointer items-center underline-offset-4 hover:underline"
        >
          Choose your diamond
          <GemIcon className="ml-2 size-4 text-default-600" />
        </span>
        <i className="font-light text-default-500">
          Select a diamond to complete setup
        </i>
      </div>
    );
  }

  return (
    <section className="flex flex-col">
      <div className="flex items-center font-semibold">
        <h2>Your Diamond Selection</h2>
        <GemIcon className="ml-2 size-4 text-default-600" />
      </div>
      <div className="mb-6 mt-1.5 flex items-stretch gap-3 rounded-large bg-default-50 p-3">
        <NextLink href={`/product/${stone.product.handle}`}>
          <Image
            className="aspect-square w-20 shrink-0 object-cover object-center lg:w-28"
            alt={stone.product.featuredImage?.altText || stone.product.title}
            src={stone.product.featuredImage?.url}
          />
        </NextLink>
        <div className="flex grow flex-col">
          <NextLink
            className="font-medium"
            href={`/product/${stone.product.handle}`}
          >
            {stone.product.title}
          </NextLink>
          <Price
            className="mt-2 font-sans font-normal"
            compareAtPrice={
              stone.product.compareAtPriceRange.maxVariantPrice.amount
            }
            price={stone.product.priceRange.maxVariantPrice.amount}
          />

          <div className="mt-auto flex justify-end gap-1">
            <Button size="sm" variant="light" onPress={openStoneModal}>
              Edit
            </Button>
            <Button
              color="danger"
              size="sm"
              variant="light"
              onPress={() => {
                setStone(null);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
      <AddToCart lines={lines} />
    </section>
  );
});

export const ProductDynamicSection = memo(function ProductDynamicSection() {
  const { product: productAny } = useProduct();
  const product = productAny as ProductFragment;

  if (product.productType === PRODUCT_TYPES.Setting) {
    return (
      <StoneModalProvider>
        <SettingsSection />
      </StoneModalProvider>
    );
  }

  return <ProductCTA />;
});
