"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterFragment } from "@/__generated__/graphql";
import { Chip } from "@nextui-org/chip";
import { useMediaQuery } from "@uidotdev/usehooks";

const CollectionFilterDesktop = dynamic(() =>
  import("@/components/collection/collection-filter-desktop").then(
    (m) => m.CollectionFilterDesktop,
  ),
);

const CollectionFilterSorterMobile = dynamic(() =>
  import("@/components/collection/collection-filter-sorter-mobile").then(
    (m) => m.CollectionFilterSorterMobile,
  ),
);

const ProductsSorter = dynamic(() =>
  import("@/components/collection/collection-products-sorter").then(
    (m) => m.ProductsSorter,
  ),
);

const ActiveFilterChips = ({ filters }: { filters: FilterFragment[] }) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleOnClose(id: string, label: string) {
    const params = new URLSearchParams(searchParams);

    params.delete(id, label);

    replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  const activeFilters: { id: string; value: string }[] = useMemo(() => {
    return Array.from(searchParams.entries()).reduce(
      (acc, [k, v]) => {
        const f = filters.find(({ id }) => id === k);

        if (f) {
          const fv = f.values.find(({ label }) => label === v);

          fv && acc.push({ id: f.id, value: fv.label });
        }

        return acc;
      },
      [] as { id: string; value: string }[],
    );
  }, [filters, searchParams]);

  return activeFilters.length > 0 ? (
    <ul className="flex items-center gap-3 border-l pl-6">
      {activeFilters.map((f, idx) => (
        <li key={idx}>
          <Chip
            radius="none"
            variant="light"
            color="secondary"
            onClose={() => handleOnClose(f.id, f.value)}
          >
            {f.value}
          </Chip>
        </li>
      ))}
    </ul>
  ) : null;
};

export const CollectionFilter = ({
  filters,
}: {
  filters: FilterFragment[];
}) => {
  const isDesktop = useMediaQuery("only screen and (min-width : 768px)");

  return isDesktop ? (
    <div className="sticky top-[80px] z-20 bg-background">
      <div className="container flex h-16 items-center gap-6 [&>div]:ml-auto">
        <CollectionFilterDesktop filters={filters} />
        <ActiveFilterChips filters={filters} />
        <ProductsSorter />
      </div>
    </div>
  ) : (
    <CollectionFilterSorterMobile filters={filters} />
  );
};
