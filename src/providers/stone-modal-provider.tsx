"use client";

import { createContext, memo, ReactNode, useCallback, useContext } from "react";
import { GetStoneCollectionQuery } from "@/__generated__/graphql";
import { getStoneCollectionQuery } from "@/gql/queries/collection";
import { useLazyQuery } from "@apollo/client";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Skeleton } from "@nextui-org/skeleton";
import { Spinner } from "@nextui-org/spinner";
import {
  useDisclosure,
  type UseDisclosureReturn,
} from "@nextui-org/use-disclosure";
import { GemIcon } from "lucide-react";

import { Price } from "@/components/product/price";
import { ProductCardImage } from "@/components/product/product-card";
import { StoneSpecifications } from "@/components/product/stone/stone-specifications";
import { removeEdgesAndNodes } from "@/lib/utils";
import { useProductLocalStorage } from "@/hooks/useProductLocalStorage";

const StoneModalContext = createContext<
  (UseDisclosureReturn & { open: (value?: string) => void }) | undefined
>(undefined);

const StoneModalContentSkeleton = memo(function StoneModalContentSkeleton() {
  return (
    <ul className="flex flex-col gap-3">
      {Array(10)
        .fill(0)
        .map((_, idx) => (
          <li key={idx}>
            <Skeleton className="h-[60px] w-full rounded-large" />
          </li>
        ))}
    </ul>
  );
});

const StoneModalContent = memo(function ModalContent({
  data,
}: {
  data?: GetStoneCollectionQuery;
}) {
  const { onClose } = useStoneModal();
  const { setStone: setStoneLocalStorage } = useProductLocalStorage();

  const stones = data?.collection?.products;
  if (!stones || !stones?.edges.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <GemIcon className="size-20 text-default-700" />
        <h1 className="text-balance text-center text-lg">
          Unfortunately, the diamond shape is currently unavailable. Please
          consider selecting an alternative shape.
        </h1>
      </div>
    );
  }

  return (
    <div className="@container">
      <ul className="grid grid-cols-2 gap-3 @lg:grid-cols-3 @lg:gap-4 @2xl:grid-cols-4">
        {removeEdgesAndNodes(stones).map((stone) => (
          <li
            key={stone.id}
            onClick={() => {
              setStoneLocalStorage({
                product: stone,
                selectedVariant: stone.variants.edges[0].node,
              });
              onClose();
            }}
          >
            <figure className="flex cursor-pointer flex-col gap-3 border border-default-300 p-3 transition-shadow hover:shadow-md">
              <ProductCardImage
                alt={stone.title}
                featuredImage={stone.featuredImage}
              />
              <figcaption>
                <Price
                  className="text-sm font-normal"
                  price={stone.priceRange.maxVariantPrice.amount}
                  compareAtPrice={
                    stone.compareAtPriceRange.maxVariantPrice.amount
                  }
                />
                <StoneSpecifications
                  className="mt-3"
                  specifications={stone.stoneSpecifications}
                />
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
});

export const StoneModalProvider = ({ children }: { children: ReactNode }) => {
  const disclosure = useDisclosure();
  const { onOpen, isOpen, onOpenChange } = disclosure;

  const [getProduct, { data, loading }] = useLazyQuery(getStoneCollectionQuery);

  const open = useCallback(
    (stoneShapeId?: string) => {
      const filters = stoneShapeId
        ? {
            productMetafield: {
              namespace: "stone",
              key: "shape",
              value: stoneShapeId,
            },
          }
        : {};

      getProduct({
        variables: {
          filters: [filters],
        },
      });
      onOpen();
    },
    [getProduct, onOpen],
  );

  return (
    <StoneModalContext.Provider value={{ ...disclosure, open }}>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          body: "pb-6",
        }}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent className="h-full">
          <ModalHeader className="flex flex-col items-center">
            <h1 className="text-center text-2xl">Select a Diamond</h1>
            <p className="mt-2 text-center font-light text-default-700 max-md:text-sm">
              Our hand-selected, pre-vetted, in-house inventory, immediately
              available for sale.
            </p>
          </ModalHeader>
          <ModalBody>
            {loading ? (
              <Spinner color="warning" />
            ) : (
              <StoneModalContent data={data} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      {children}
    </StoneModalContext.Provider>
  );
};

export function useStoneModal() {
  const context = useContext(StoneModalContext);

  if (!context) {
    throw new Error("useStoneModal must be used within a StoneModalProvider");
  }

  return context;
}
