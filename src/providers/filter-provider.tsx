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
