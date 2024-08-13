"use client";

import { ChangeEvent, memo, useCallback, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Spinner } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { Skeleton } from "@nextui-org/skeleton";
import { useIsClient, useMediaQuery } from "@uidotdev/usehooks";
import { ArrowUpDownIcon } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DEFAULT_SEARCH_SORT_OPTION,
  DEFAULT_SORT_OPTION,
  SEARCH_SORT_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constant";
import useQueryParams from "@/hooks/useQueryParams";

export const ProductsSorter = memo(function ProductsSorter({
  type = "collection",
}: {
  type?: "collection" | "search";
}) {
  const isClient = useIsClient();

  if (!isClient)
    return <Skeleton className="h-10 w-full rounded-large lg:h-12 lg:w-1/3" />;

  return <ResponsiveSorter type={type} />;
});

const ResponsiveSorter = memo(function ResponsiveSorter({
  type = "collection",
}: {
  type?: "collection" | "search";
}) {
  const defaultItem =
    type === "collection" ? DEFAULT_SORT_OPTION : DEFAULT_SEARCH_SORT_OPTION;
  const options = type === "collection" ? SORT_OPTIONS : SEARCH_SORT_OPTIONS;

  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const sortSlug = searchParams.get("sort");

  const { createQueryString, setUrl } = useQueryParams();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

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

  if (isSmallDevice) {
    return (
      <Drawer onOpenChange={setIsDrawerOpen} open={isDrawerOpen}>
        <DrawerTrigger asChild>
          <Button fullWidth variant="bordered">
            Sort <ArrowUpDownIcon className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-auto min-h-[35dvh]">
          {isPending ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-default-300/50">
              <Spinner />
            </div>
          ) : null}

          <div className="container mb-6">
            <DrawerHeader>
              <DrawerTitle>Sort Options</DrawerTitle>
            </DrawerHeader>
            <RadioGroup
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
  }

  return (
    <Select
      isLoading={isPending}
      label="Sort By"
      className="w-1/3"
      size="sm"
      disallowEmptySelection
      selectedKeys={new Set([sortSlug || defaultItem.slug])}
      onChange={handleOnChange}
    >
      {options.map((option) => (
        <SelectItem key={option.slug}>{option.title}</SelectItem>
      ))}
    </Select>
  );
});
