import { Fragment, useTransition } from "react";
// import dynamic from "next/dynamic";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { FilterIcon } from "lucide-react";

import { CollectionFilterList } from "@/components/collection/organizer/collection-filter-list";

// const CollectionFilterList = dynamic(() =>
//   import("@/components/collection/organizer/collection-filter-list").then(
//     (m) => m.CollectionFilterList,
//   ),
// );

export const CollectionFilterDesktop = () => {
  const [isPending, transition] = useTransition();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Fragment>
      <Button
        onClick={onOpen}
        className="min-w-fit data-[hover=true]:bg-default-50"
        variant="light"
        endContent={<FilterIcon className="size-4" />}
      >
        Filter
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        radius="none"
        size="sm"
        classNames={{
          wrapper: "justify-start",
          base: "sm:m-0 h-screen max-h-none",
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
              x: -384,
              transition: {
                duration: 0.15,
                ease: "easeInOut",
              },
            },
          },
        }}
      >
        <ModalContent className="relative">
          <ModalHeader>
            <h1>Filter</h1>
          </ModalHeader>
          {isPending ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : null}
          <ModalBody>
            <CollectionFilterList transition={transition} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};
