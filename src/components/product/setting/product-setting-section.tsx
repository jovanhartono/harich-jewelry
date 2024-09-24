"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { AttributeInput, CartLineInput } from "@/__generated__/graphql";
import { useProduct } from "@/app/product/provider";
import { useStoneModal } from "@/providers/stone-modal-provider";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { select as selectStyle } from "@nextui-org/theme";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { GemIcon, RulerIcon } from "lucide-react";

import AddToCart from "@/components/cart/add-to-cart";
import { Price } from "@/components/product/price";
import { CART_LINE_ATTRIBUTE_KEYS, RING_SIZE_OPTIONS } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { useProductLocalStorage } from "@/hooks/useProductLocalStorage";

const SizeGuideDialog = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Fragment>
      <button className="flex items-center gap-1.5 text-xs" onClick={onOpen}>
        <RulerIcon className="size-4" />
        Size Guide
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        radius="none"
        size="sm"
        classNames={{
          wrapper: "justify-end",
          base: "max-md:max-w-xs m-0 sm:m-0 h-screen max-h-none",
        }}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              transition: {
                duration: 0.15,
                ease: "easeInOut",
              },
            },
            exit: {
              x: 384,
              transition: {
                duration: 0.15,
                ease: "easeInOut",
              },
            },
          },
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h1>Ring Size Guide</h1>
          </ModalHeader>
          <ModalBody>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="h-16 [&>th]:sticky [&>th]:-top-2 [&>th]:text-pretty [&>th]:bg-background [&>th]:px-2">
                  <th className="w-2/5">Inter-Diameter (mm)</th>
                  <th>HK</th>
                  <th>US</th>
                </tr>
              </thead>
              <tbody>
                {RING_SIZE_OPTIONS.map((option, idx) => (
                  <tr
                    key={idx}
                    className="h-9 [&>td]:border-y [&>td]:border-default-500 [&>td]:text-center"
                  >
                    <td>{option.diameter}</td>
                    <td>{option.sizeHK}</td>
                    <td>{option.sizeUS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export function ProductSettingSection() {
  const router = useRouter();
  const [engraving, setEngraving] = useState<string>();
  const [size, setSize] = useState<string>();

  const { product, selectedVariant } = useProduct();
  const { stone, setStone } = useProductLocalStorage();
  const { open } = useStoneModal();

  const openStoneModal = useCallback(
    () => open(product?.shape?.value),
    [open, product?.shape?.value],
  );

  const handleSuccess = useCallback(() => {
    router.push("/cart");
    // setStone(null);
    // setSettings(null);
  }, [router]);

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

  const isShapeDifferent = useMemo(
    () => stone?.product.stoneShape?.value !== product?.shape?.value,
    [product?.shape?.value, stone?.product.stoneShape?.value],
  );

  if (!stone || isShapeDifferent) {
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
        <NextLink href={`/product/${stone.product.handle}`} prefetch>
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

      <div className="mb-6 flex gap-3 *:flex-1">
        <Input
          radius="sm"
          label="Engraving"
          labelPlacement="outside"
          autoComplete="off"
          placeholder="Add Engraving"
          onChange={(e) => setEngraving(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <label
              htmlFor="ring-size-select"
              className={cn(
                selectStyle().label({ size: "sm", className: "static" }),
              )}
            >
              Ring Size
            </label>

            <SizeGuideDialog />
          </div>
          <div className={cn(selectStyle().mainWrapper())}>
            <select
              defaultValue=""
              className={cn(
                selectStyle().trigger({
                  labelPlacement: "outside",
                  radius: "sm",
                }),
                selectStyle().value(),
              )}
              id="ring-size-select"
              onChange={(e) => setSize(e.target.value)}
            >
              <option disabled value="">
                Select Ring Size
              </option>
              {RING_SIZE_OPTIONS.map((opt, idx) => (
                <option key={idx} value={`HK ${opt.sizeHK} / US ${opt.sizeUS}`}>
                  HK {opt.sizeHK} / US {opt.sizeUS}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bottom-float-wrapper">
        <AddToCart lines={lines} onSuccess={handleSuccess}>
          Complete Setup
        </AddToCart>
      </div>
    </section>
  );
}
