"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterFragment } from "@/__generated__/graphql";
import { useMediaQuery } from "@uidotdev/usehooks";

import { FILTER_ID } from "@/lib/constant";
import { cn } from "@/lib/utils";

const DesktopCollectionFilter = ({
  filters,
}: {
  filters: FilterFragment[];
}) => {
  const [isLoading, transition] = useTransition();

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

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

      transition(() => {
        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [pathname, replace, searchParams],
  );

  return (
    <section className="col-span-1">
      <ul className="sticky top-[120px] flex flex-col gap-6">
        {filters.map((f) => (
          <li
            key={f.id}
            className={cn("flex flex-col gap-2", {
              "w-full": f.id === FILTER_ID.shape,
            })}
          >
            <p className="font-medium">{f.label}</p>

            <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
              {f.values.map((fv) => (
                <li
                  key={fv.id}
                  className={cn("shrink-0 basis-[72px] cursor-pointer")}
                >
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
                        <div className="rounded-medium p-2 duration-100 transition-background group-hover:bg-primary group-has-[:checked]:bg-primary">
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
    </section>
  );
};

export const CollectionFilter = ({
  filters,
}: {
  filters: FilterFragment[];
}) => {
  const showFilter = useMediaQuery("only screen and (min-width : 768px)");

  return showFilter ? <DesktopCollectionFilter filters={filters} /> : null;
};
