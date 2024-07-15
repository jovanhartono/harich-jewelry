"use client";

import {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import NextLink from "next/link";
import { getSearchRecommendationQuery } from "@/gql/queries/search";
import { useBackgroundQuery } from "@apollo/client";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowUpRightIcon } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

import { Search } from "@/components/layout/navbar/search";
import { SearchPredictiveResult } from "@/components/layout/navbar/search-predictive-result";

export default function SearchModal() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search.trim(), 200);
  const defferedValue = useDeferredValue(debouncedSearch);
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [queryRef] = useBackgroundQuery(getSearchRecommendationQuery, {
    queryKey: "search-recommendation",
    variables: {
      query: defferedValue,
    },
  });

  useHotkeys("mod+k", () => {
    onOpen();
  });

  const onCloseMemoized = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  return (
    <>
      <Button
        disableRipple
        isIconOnly
        onPress={onOpen}
        aria-label="Search Collections"
        variant="light"
      >
        <SearchIcon className="size-5" />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        size="3xl"
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
              <ModalHeader className="items-center border-b border-default-300 py-3">
                <Search
                  formClassname="w-full"
                  size="lg"
                  variant="bordered"
                  classNames={{
                    inputWrapper:
                      "focus-within:!ring-0 focus-within:!ring-offset-0 border-none shadow-none px-0",
                  }}
                  fullWidth
                  autoFocus
                  type="text"
                  onSubmit={onClose}
                  onValueChange={setSearch}
                  value={search}
                />
                <Kbd>ESC</Kbd>
              </ModalHeader>
              <ModalBody className="py-3">
                {search.trim().length ? (
                  <NextLink
                    href={`/search?q=${search}`}
                    onClick={onClose}
                    className="flex flex-wrap gap-2 text-lg"
                  >
                    Show all results for
                    <span className="font-medium underline">{search}</span>
                    <ArrowUpRightIcon className="ml-auto size-4" />
                  </NextLink>
                ) : null}

                <Suspense fallback={<Spinner />}>
                  <SearchPredictiveResult
                    queryRef={queryRef}
                    onClose={onCloseMemoized}
                  />
                </Suspense>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
