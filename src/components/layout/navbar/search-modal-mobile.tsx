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
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { CloseIcon, SearchIcon } from "@nextui-org/shared-icons";
import { Spinner } from "@nextui-org/spinner";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowUpRightIcon } from "lucide-react";

import { Search } from "@/components/layout/navbar/search";
import { SearchPredictiveResult } from "@/components/layout/navbar/search-predictive-result";

export default function SearchModalMobile() {
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
        className="bg-transparent lg:hidden"
        onPress={onOpen}
        isIconOnly
        aria-label="Search"
        variant="light"
        size="sm"
      >
        <SearchIcon className="size-5" />
      </Button>
      <Modal
        size="full"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="top"
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
        <ModalContent className="max-h-dvh">
          {(onClose) => (
            <>
              <ModalHeader className="gap-3">
                <Button
                  size="lg"
                  radius="full"
                  isIconOnly
                  variant="flat"
                  onPress={onClose}
                >
                  <CloseIcon className="size-5" />
                </Button>
                <Search
                  formClassname="grow"
                  size="lg"
                  fullWidth
                  autoFocus
                  onSubmit={onClose}
                  onValueChange={setSearch}
                  value={search}
                />
              </ModalHeader>
              <ModalBody className="gap-6 py-6">
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
