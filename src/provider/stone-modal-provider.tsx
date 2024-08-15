import { createContext, memo, ReactNode, useCallback, useContext } from "react";
import { GetCollectionProductsQuery } from "@/__generated__/graphql";
import { getCollectionProductsQuery } from "@/gql/queries/collection";
import { useLazyQuery } from "@apollo/client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/skeleton";
import {
  useDisclosure,
  type UseDisclosureReturn,
} from "@nextui-org/use-disclosure";
import { GemIcon } from "lucide-react";

import { Price } from "@/components/product/price";
import { COLLECTION_HANDLE } from "@/lib/constant";
import { useProductLocalStorage } from "@/hooks/useProductLocalStorage";

const StoneModalContext = createContext<
  (UseDisclosureReturn & { open: (value: string) => void }) | undefined
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
  data?: GetCollectionProductsQuery;
}) {
  const { onClose } = useStoneModal();
  const { setStone } = useProductLocalStorage();

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
    <Accordion selectionMode="multiple" className="flex flex-col gap-3">
      {stones.edges.map(({ node }) => (
        <AccordionItem
          key={node.id}
          className="rounded-large bg-default-100 p-2"
          title={
            <div className="flex gap-6">
              <span>{node.title}</span>
              <Price
                price={node.priceRange.maxVariantPrice.amount}
                compareAtPrice={node.priceRange.maxVariantPrice.amount}
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
                setStone({
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
  );
});

export const StoneModalProvider = ({ children }: { children: ReactNode }) => {
  const disclosure = useDisclosure();
  const { onOpen, isOpen, onOpenChange } = disclosure;

  const [getProduct, { data, loading }] = useLazyQuery(
    getCollectionProductsQuery,
  );

  const open = useCallback((stoneShapeId: string) => {
    getProduct({
      variables: {
        handle: COLLECTION_HANDLE.stone,
        filters: [
          {
            productMetafield: {
              namespace: "stone",
              key: "shape",
              value: stoneShapeId,
            },
          },
        ],
      },
    });
    onOpen();
  }, []);

  return (
    <StoneModalContext.Provider value={{ ...disclosure, open }}>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent className="h-full">
          <ModalHeader className="justify-center">
            <h1 className="text-center text-2xl">Select a Diamond</h1>
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
