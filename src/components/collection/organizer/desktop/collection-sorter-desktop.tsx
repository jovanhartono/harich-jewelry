"use client";

import { ChangeEvent, memo, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/select";

import {
  DEFAULT_SEARCH_SORT_OPTION,
  DEFAULT_SORT_OPTION,
  SEARCH_SORT_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constant";
import useQueryParams from "@/hooks/useQueryParams";

export const CollectionSorterDesktop = memo(function CollectionSorterDesktop({
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

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      startTransition(() => {
        setUrl(
          createQueryString(
            "sort",
            e.target.value === defaultItem.slug ? null : e.target.value,
          ),
        );
      });
    },
    [setUrl, createQueryString, defaultItem.slug],
  );

  return (
    <Select
      isLoading={isPending}
      label="Sort"
      className="w-56"
      classNames={{
        base: "items-center",
        trigger: "bg-white shadow-none",
      }}
      labelPlacement="outside-left"
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
