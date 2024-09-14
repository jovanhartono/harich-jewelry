"use client";

import { ChangeEvent, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/select";
import { useMediaQuery } from "@uidotdev/usehooks";

import {
  DEFAULT_SEARCH_SORT_OPTION,
  DEFAULT_SORT_OPTION,
  SEARCH_SORT_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constant";
import useQueryParams from "@/hooks/useQueryParams";

export const ProductsSorter = ({
  type = "collection",
}: {
  type?: "collection" | "search";
}) => {
  const showSorter = useMediaQuery("only screen and (min-width : 768px)");

  const defaultItem =
    type === "collection" ? DEFAULT_SORT_OPTION : DEFAULT_SEARCH_SORT_OPTION;
  const options = type === "collection" ? SORT_OPTIONS : SEARCH_SORT_OPTIONS;

  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const sortSlug = searchParams.get("sort");

  const { createQueryString, setUrl } = useQueryParams();

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
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

  return showSorter ? (
    <div className="flex justify-end">
      <Select
        isLoading={isPending}
        label="Sort By"
        className="w-64"
        size="sm"
        disallowEmptySelection
        selectedKeys={new Set([sortSlug || defaultItem.slug])}
        onChange={handleOnChange}
      >
        {options.map((option) => (
          <SelectItem key={option.slug}>{option.title}</SelectItem>
        ))}
      </Select>
    </div>
  ) : null;
};
