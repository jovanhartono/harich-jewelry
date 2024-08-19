"use client";

import { ChangeEvent, useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterFragment } from "@/__generated__/graphql";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Spinner } from "@nextui-org/spinner";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ArrowUpDownIcon, FilterIcon } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DEFAULT_SEARCH_SORT_OPTION,
  DEFAULT_SORT_OPTION,
  FILTER_ID,
  SEARCH_SORT_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constant";
import { cn } from "@/lib/utils";
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

const MobileFilter = ({ filters }: { filters: FilterFragment[] }) => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const isChecked = useCallback(
    (key: string, value: string) => {
      return Array.from(searchParams.entries()).some(
        ([k, v]) => k === key && v === value,
      );
    },
    [searchParams],
  );

  const handleCheckChange = useCallback(
    (id: string, label: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams);

      checked ? params.append(id, label) : params.delete(id, label);

      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [pathname, replace, searchParams],
  );

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
            <DrawerTitle>Filter</DrawerTitle>
            <DrawerDescription className="sr-only">
              Collection Filter
            </DrawerDescription>
          </DrawerHeader>
          <ul className="flex flex-col gap-6">
            {filters.map((f) => (
              <li
                key={f.id}
                className={cn("flex flex-col gap-2", {
                  "w-full": f.id === FILTER_ID.shape,
                })}
              >
                <p className="font-medium">{f.label}</p>

                <ul className="grid grid-cols-4 gap-x-3 gap-y-1.5">
                  {f.values.map((fv) => (
                    <li key={fv.id} className={cn("shrink-0 cursor-pointer")}>
                      <label
                        aria-disabled={fv.count < 1}
                        id={fv.id}
                        className="group flex h-full cursor-pointer flex-col"
                      >
                        <input
                          className="sr-only"
                          disabled={fv.count < 1}
                          type="checkbox"
                          defaultChecked={isChecked(f.id, fv.label)}
                          onChange={({ target }) => {
                            handleCheckChange(f.id, fv.label, target.checked);
                          }}
                        />
                        {fv.image?.image ? (
                          <figure className="flex flex-col gap-2">
                            <div className="rounded-medium p-2 duration-100 transition-background group-has-[:checked]:bg-primary">
                              <img
                                className="mx-auto h-10 brightness-0"
                                src={fv.image.image.url}
                                alt={fv.image.image.altText || fv.label}
                              />
                            </div>
                            <figcaption className="text-balance text-center text-sm text-default-700 group-has-[:checked]:font-medium group-has-[:checked]:text-black">
                              {fv.label}
                            </figcaption>
                          </figure>
                        ) : (
                          <p className="group-has-[:checked]:font-semibold">
                            {fv.label}
                          </p>
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export function CollectionFilterSorterMobile({
  filters,
}: {
  filters: FilterFragment[];
}) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return isSmallDevice ? (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex h-12 w-full items-stretch gap-3 divide-x divide-black border-t border-black bg-white *:flex-1">
      <MobileSorter />
      <MobileFilter filters={filters} />
    </div>
  ) : null;
}
