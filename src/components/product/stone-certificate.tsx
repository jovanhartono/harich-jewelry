"use client";

import { memo } from "react";
import { ImageFragment } from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { EyeIcon } from "lucide-react";

import { generateSrcSet } from "@/lib/utils";

export const StoneCertificate = memo(function StoneCertificate({
  image,
}: {
  image: ImageFragment;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className="w-max"
        onPress={onOpen}
        variant="flat"
        endContent={<EyeIcon className="size-4" />}
      >
        See IGI Certificate
      </Button>
      <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody className="relative">
            <Image
              removeWrapper
              className="absolute inset-0 h-full w-full object-contain"
              srcSet={generateSrcSet(image.url)}
              src={image.url}
              sizes="100vw"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
