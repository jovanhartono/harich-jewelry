"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { FilterFragment, FilterValueFragment } from "@/__generated__/graphql";

type FilterContextType = {
  filters: Array<FilterFragment>;
  setFilters: Dispatch<SetStateAction<FilterFragment[]>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({
  children,
  filters: filtersProp,
}: {
  children: ReactNode;
  filters: Array<FilterFragment>;
}) => {
  const [filters, setFilters] = useState<Array<FilterFragment>>(filtersProp);
  const searchParams = useSearchParams();

  const activeFilters = useMemo(() => {
    return Array.from(searchParams.entries()).reduce((acc, [k, v]) => {
      const f = filters.find(({ id }) => id === k);

      if (f) {
        const fv = f.values.find(({ label }) => label === v);

        fv && acc.push(fv);
      }

      return acc;
    }, [] as Array<FilterValueFragment>);
  }, [filters, searchParams]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
    }),
    [filters],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export function useFilter() {
  const ctx = useContext(FilterContext);

  if (!ctx) {
    throw new Error("useProductFilter must be used within a FilterProvider");
  }

  return ctx;
}
