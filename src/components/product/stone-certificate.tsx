"use client";

import { memo } from "react";
import { ImageFragment } from "@/__generated__/graphql";
import { Image } from "@nextui-org/image";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { FileTextIcon } from "lucide-react";

import { cn, generateSrcSet } from "@/lib/utils";

export const StoneCertificate = memo(function StoneCertificate({
  image,
  className,
}: {
  image: ImageFragment;
  className?: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <span
        onClick={onOpen}
        className={cn(
          "inline-flex cursor-pointer items-center text-sm font-medium tracking-tight underline-offset-4 hover:underline",
          className,
        )}
      >
        Show Certificate
        <FileTextIcon className="ml-2 size-4" />
      </span>
      <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody className="relative">
            <Image
              classNames={{
                wrapper: "absolute inset-0 mx-auto",
              }}
              alt="Stone Certificate"
              srcSet={generateSrcSet(image.url)}
              className="h-full w-full object-contain object-center"
              src={image.url}
              sizes="100vw"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
