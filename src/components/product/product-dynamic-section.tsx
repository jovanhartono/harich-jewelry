"use client";

import { useCallback, useMemo, useState } from "react";
import NextLink from "next/link";
import { AttributeInput, CartLineInput } from "@/__generated__/graphql";
import { useProduct } from "@/app/product/provider";
import {
  StoneModalProvider,
  useStoneModal,
} from "@/providers/stone-modal-provider";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { GemIcon } from "lucide-react";

import AddToCart from "@/components/cart/add-to-cart";
import { Price } from "@/components/product/price";
import { ProductCTA } from "@/components/product/product-cta";
import { StoneCertificate } from "@/components/product/stone-certificate";
import { StoneSpecifications } from "@/components/product/stone/stone-specifications";
import { CART_LINE_ATTRIBUTE_KEYS, PRODUCT_TYPES } from "@/lib/constant";
import { useProductLocalStorage } from "@/hooks/useProductLocalStorage";

function SettingsSection() {
  const [engraving, setEngraving] = useState<string>();
  const [size, setSize] = useState<string>();
  const { product, selectedVariant } = useProduct();
  const { stone, setStone } = useProductLocalStorage();
  const { open } = useStoneModal();

  const openStoneModal = useCallback(
    () => open(product?.shape?.value),
    [open, product?.shape?.value],
  );

  const lines: CartLineInput[] = useMemo(() => {
    if (stone && selectedVariant) {
      const settingAttributes: AttributeInput[] = [];

      if (engraving) {
        settingAttributes.push({
          key: CART_LINE_ATTRIBUTE_KEYS.ENGRAVING,
          value: engraving,
        });
      }

      if (size) {
        settingAttributes.push({
          key: CART_LINE_ATTRIBUTE_KEYS.SIZE,
          value: size,
        });
      }

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
  }, [engraving, selectedVariant, size, stone]);

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
      <div className="mb-6 mt-1.5 flex items-stretch gap-3 rounded-large bg-default-100 p-3">
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
            className="mt-2 text-sm font-normal"
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

      <div className="mb-6 flex gap-3">
        <label htmlFor="engraving" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Engraving</span>
          <input
            onChange={(e) => setEngraving(e.target.value)}
            type="text"
            id="engraving"
            className="border border-default-700 p-3 outline-none focus:ring-black"
          />
        </label>
        <label htmlFor="size" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Size</span>
          <input
            onChange={(e) => setSize(e.target.value)}
            type="text"
            id="size"
            className="border border-default-700 p-3 outline-none focus:ring-black"
          />
        </label>
      </div>

      <AddToCart lines={lines}>Complete Setup</AddToCart>
    </section>
  );
}

function StoneSection() {
  const { product } = useProduct();
  return (
    <div className="flex items-center gap-6 divide-x divide-black">
      <StoneSpecifications
        className="flex gap-9"
        specifications={product.stoneSpecifications}
      />
      {product.stoneCertificate ? (
        <StoneCertificate className="pl-6" image={product.stoneCertificate} />
      ) : null}
    </div>
  );
}

export function ProductDynamicSection() {
  const { product } = useProduct();

  if (product.productType === PRODUCT_TYPES.Setting) {
    return (
      <StoneModalProvider>
        <SettingsSection />
      </StoneModalProvider>
    );
  }

  if (product.productType === PRODUCT_TYPES.Stone) {
    return <StoneSection />;
  }

  return <ProductCTA />;
}
