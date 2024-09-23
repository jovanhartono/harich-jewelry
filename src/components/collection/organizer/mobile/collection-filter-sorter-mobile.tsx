"use client";

import { ChangeEvent, useCallback, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Spinner } from "@nextui-org/spinner";
import { ArrowUpDownIcon, FilterIcon } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CollectionFilterList } from "@/components/collection/organizer/collection-filter-list";
import {
  DEFAULT_SEARCH_SORT_OPTION,
  DEFAULT_SORT_OPTION,
  SEARCH_SORT_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constant";
import useQueryParams from "@/hooks/useQueryParams";

const MobileSorter = ({
  type = "collection",
}: {
  type?: "collection" | "search";
}) => {
  const defaultItem =
    type === "collection" ? DEFAULT_SORT_OPTION : DEFAULT_SEARCH_SORT_OPTION;
  const options = type === "collection" ? SORT_OPTIONS : SEARCH_SORT_OPTIONS;

  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const sortSlug = searchParams.get("sort");

  const { createQueryString, setUrl } = useQueryParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        setUrl(
          createQueryString(
            "sort",
            e.target.value === defaultItem.slug ? null : e.target.value,
          ),
        );

        setIsDrawerOpen(false);
      });
    },
    [setUrl, createQueryString, defaultItem.slug],
  );

  return (
    <Drawer onOpenChange={setIsDrawerOpen} open={isDrawerOpen}>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-center bg-white px-3">
          <span className="text-sm">Sort</span>
          <ArrowUpDownIcon className="ml-1.5 size-4" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-auto min-h-[35dvh]">
        {isPending ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-default-300/50">
            <Spinner
              classNames={{
                circle1: "border-b-black",
                circle2: "border-b-black",
              }}
            />
          </div>
        ) : null}

        <div className="container mb-6">
          <DrawerHeader>
            <DrawerTitle>Sort Options</DrawerTitle>
            <DrawerDescription className="sr-only">
              Collection Sorter
            </DrawerDescription>
          </DrawerHeader>
          <RadioGroup
            color="secondary"
            classNames={{
              wrapper: "gap-3",
            }}
            value={sortSlug || defaultItem.slug}
            onChange={handleOnChange}
          >
            {options.map((option) => (
              <Radio
                classNames={{
                  base: "flex-row-reverse justify-between max-w-full",
                }}
                value={option.slug}
                key={option.slug}
              >
                {option.title}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const MobileFilter = () => {
  const [isPending, startTransition] = useTransition();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <Drawer onOpenChange={setIsDrawerOpen} open={isDrawerOpen}>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-center bg-white px-3">
          <span className="text-sm">Filter</span>
          <FilterIcon className="ml-1.5 size-4" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-auto min-h-[35dvh]">
        {isPending ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Spinner size="lg" color="secondary" />
          </div>
        ) : null}
        <div className="container mb-6">
          <DrawerHeader>
            <DrawerTitle>Filter</DrawerTitle>
            <DrawerDescription className="sr-only">
              Collection Filter
            </DrawerDescription>
          </DrawerHeader>

          <CollectionFilterList transition={startTransition} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export function CollectionFilterSorterMobile() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex h-12 w-full items-stretch gap-3 divide-x divide-black border-t border-black bg-white *:flex-1">
      <MobileSorter />
      <MobileFilter />
    </div>
  );
}
