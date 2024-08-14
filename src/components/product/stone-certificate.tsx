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
        Show Certificate
      </Button>
      <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody className="relative">
            <Image
              classNames={{
                wrapper: "absolute inset-0 mx-auto",
              }}
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
