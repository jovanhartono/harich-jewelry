"use client";

import NextImage from "next/image";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { GemIcon, MousePointerClick } from "lucide-react";

export const StonePricelistModal = () => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  return (
    <>
      <button
        onClick={onOpen}
        className="flex w-full items-center gap-x-3 rounded-small border px-3 py-3"
      >
        <MousePointerClick className="size-6" />
        <span className="text-left text-small">
          Tap here to see our hand-selected diamonds. <br /> Starting from
          0.5ct.
        </span>
      </button>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        placement="center"
        scrollBehavior="inside"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="gap-0 p-0">
                <NextImage
                  alt="0.5ct-1ct Stone Collections"
                  width={2000}
                  height={1414}
                  src="https://cdn.shopify.com/s/files/1/0611/4158/1902/files/stone-selection-2.png?v=1734545044"
                />
                <NextImage
                  alt="1.1ct-1.5ct Stone Collections"
                  width={2000}
                  height={1414}
                  src="https://cdn.shopify.com/s/files/1/0611/4158/1902/files/stone-selection-1.png?v=1734545044"
                />
                <NextImage
                  alt="1.6ct-2ct Stone Collections"
                  width={2000}
                  height={1414}
                  src="https://cdn.shopify.com/s/files/1/0611/4158/1902/files/stone-selection-3.png?v=1734545044"
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
