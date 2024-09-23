"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FilterFragment } from "@/__generated__/graphql";

type FilterContextType = {
  filters: Array<FilterFragment>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({
  children,
  filters,
}: {
  children: ReactNode;
  filters: Array<FilterFragment>;
}) => {
  const searchParams = useSearchParams();

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

  return (
    <FilterContext.Provider value={{ filters }}>
      {children}
    </FilterContext.Provider>
  );
};

export function useFilter() {
  const ctx = useContext(FilterContext);

  if (!ctx) {
    throw new Error("useProductFilter must be used within a FilterProvider");
  }

  return ctx;
}
