"use client";

import { memo, ReactNode, useCallback, useMemo } from "react";
import {
  AttributeInput,
  CartLineInput,
  ProductFragment,
} from "@/__generated__/graphql";
import { useProduct } from "@/app/product/provider";
import { getCollectionProductsQuery } from "@/gql/queries/collection";
import { getProductByHandleQuery } from "@/gql/queries/product";
import { useLazyQuery } from "@apollo/client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { create } from "zustand";

import AddToCart from "@/components/cart/add-to-cart";
import { title } from "@/components/primitives";
import { Price } from "@/components/product/price";
import {
  CART_LINE_ATTRIBUTE_KEYS,
  COLLECTION_HANDLE,
  LOCAL_STORAGE_KEYS,
  PRODUCT_TYPES,
} from "@/lib/constant";
import { useProductLocalStorage } from "@/hooks/useProductLocalStorage";

const StoneModalProvider = ({ children }: { children: ReactNode }) => {};

const SettingsSection = function SettingsSection() {
  const { product, selectedVariant } = useProduct();

  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

  const {
    stone,
    loading,
    setStoneToLocalStorage,
    deleteStoneFromLocalStorage,
  } = useProductLocalStorage();

  const [getProduct, { data }] = useLazyQuery(getCollectionProductsQuery);

  const open = useCallback(() => {
    getProduct({
      variables: {
        handle: COLLECTION_HANDLE.stone,
        filters: [
          {
            productMetafield: {
              namespace: "stone",
              key: "shape",
              value: product.shape.value,
            },
          },
        ],
      },
    });
    onOpen();
  }, [product.shape.value]);

  const lines: CartLineInput[] | undefined = useMemo(() => {
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
  }, [selectedVariant, stone]);

  if (loading) {
    return <div>lagi loading...</div>;
  }

  const stones = data?.collection?.products;

  if (!stone) {
    return (
      <div className="">
        <Button onPress={() => open()}>
          Belum ada stone nya, silahkan pilih stone
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          classNames={{
            backdrop:
              "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
            // base: "max-h-[90dvh]",
          }}
          size="4xl"
          scrollBehavior="inside"
        >
          <ModalContent className="h-full">
            <ModalHeader className="justify-center">
              <h1 className={title({ size: "sm", className: "text-center" })}>
                Select Your Center Stone
              </h1>
            </ModalHeader>
            <ModalBody>
              {stones ? (
                <Accordion
                  selectionMode="multiple"
                  className="flex flex-col gap-3"
                >
                  {stones.edges.map(({ node }) => (
                    <AccordionItem
                      key={node.id}
                      className="rounded-large bg-default-100 p-2"
                      title={
                        <div className="flex gap-6">
                          <span>{node.title}</span>
                          <Price
                            price={node.priceRange.maxVariantPrice.amount}
                            compareAtPrice={
                              node.priceRange.maxVariantPrice.amount
                            }
                          />
                        </div>
                      }
                    >
                      <Button
                        onPress={() => {
                          const selectedVariant = node.variants.edges.find(
                            (edge) => edge.node.availableForSale,
                          )?.node;

                          if (selectedVariant) {
                            setStoneToLocalStorage({
                              product: node,
                              selectedVariant,
                            });
                          }

                          onClose();
                        }}
                      >
                        Add to Ring
                      </Button>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : null}
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    );
  }

  if (!lines) {
    return null;
  }
  // tambahin settings dan stone ke cart secara berbarengan.
  return <AddToCart lines={lines} />;
  // return <AddToCart lines={lines} />;
};

export const ProductDynamicSection = memo(function ProductDynamicSection() {
  const { product: productAny } = useProduct();
  const product = productAny as ProductFragment;

  if (product.productType === PRODUCT_TYPES.Setting) {
    return <SettingsSection />;
  }

  return;
});
