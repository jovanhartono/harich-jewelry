"use client";

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilter } from "@/providers/filter-provider";
import { Chip } from "@nextui-org/chip";

import { CollectionFilterDesktop } from "@/components/collection/organizer/desktop/collection-filter-desktop";
import { CollectionSorterDesktop } from "@/components/collection/organizer/desktop/collection-sorter-desktop";
import { cn } from "@/lib/utils";

const ActiveFilterChips = memo(function ActiveFilterChips() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isTransitioning, transition] = useTransition();

  const { filters } = useFilter();

  function handleOnClose(id: string, label: string) {
    const params = new URLSearchParams(searchParams);

    params.delete(id, label);

    transition(() => {
      replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
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
    <ul className="flex items-center gap-3 border-l-1.5 border-l-default-500 pl-6">
      {activeFilters.map((f, idx) => (
        <li key={idx}>
          <Chip
            isDisabled={isTransitioning}
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
});

export const CollectionOrganizerDesktop = () => {
  const [sticky, setSticky] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const handleScroll = () => {
      if (ref.current) {
        const elementHeight = ref.current.getBoundingClientRect().top;

        setSticky(elementHeight === 80);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("sticky top-[80px] z-20 bg-background", {
        "border-b border-b-default-500": sticky,
      })}
    >
      <div className="container flex h-16 items-center gap-6 [&>div]:ml-auto">
        <CollectionFilterDesktop />
        <ActiveFilterChips />
        <CollectionSorterDesktop />
      </div>
    </div>
  );
};
