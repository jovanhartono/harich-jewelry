"use client";

import { useProduct, useUpdateURL } from "@/app/product/provider";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { CheckIcon, CircleAlert } from "lucide-react";

import { LIMITED_STOCK_THRESHOLD } from "@/lib/constant";
import { cn } from "@/lib/utils";

export function ProductVariantsOptions() {
  const {
    updateOption,
    selectedVariant,
    isOptionAvailableForSale,
    options,
    hasNoOptionsOrJustOneOption,
  } = useProduct();
  const updateURL = useUpdateURL();

  if (hasNoOptionsOrJustOneOption) return;

  return (
    <form className="space-y-6">
      <div className="flex flex-col gap-6">
        {options.map((option) => (
          <dl className="flex flex-col gap-1.5" key={option.id}>
            <dt className="font-semibold">{option.name}</dt>

            <dd className="flex flex-wrap gap-3">
              {option.values.map((value) => {
                const isAvailableForSale = isOptionAvailableForSale(
                  option.name,
                  value,
                );

                const isActive =
                  selectedVariant?.selectedOptions.find(
                    (selectedOption) => selectedOption.name === option.name,
                  )?.value === value;

                return (
                  <Button
                    type="submit"
                    size="sm"
                    key={value}
                    variant={isActive ? "solid" : "flat"}
                    color={isActive ? "primary" : "default"}
                    aria-disabled={!isAvailableForSale}
                    isDisabled={!isAvailableForSale}
                    title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                    formAction={() => {
                      const newState = updateOption(
                        option.name.toLowerCase(),
                        value,
                      );
                      updateURL(newState);
                    }}
                    className={cn(
                      "font-mono",
                      !isAvailableForSale &&
                        "relative z-10 cursor-not-allowed overflow-hidden font-mono before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-default-600 before:transition-transform",
                    )}
                  >
                    {value}
                  </Button>
                );
              })}
            </dd>
          </dl>
        ))}
      </div>
    </form>
  );
}

function StockChip({ qty }: { qty: number }) {
  if (qty > LIMITED_STOCK_THRESHOLD || qty === LIMITED_STOCK_THRESHOLD) {
    return (
      <Chip
        radius="sm"
        color="success"
        variant="flat"
        startContent={<CheckIcon className="size-4" />}
        classNames={{
          content: "font-medium",
        }}
      >
        Available
      </Chip>
    );
  } else if (qty < LIMITED_STOCK_THRESHOLD) {
    return (
      <Chip
        radius="sm"
        color="warning"
        variant="flat"
        startContent={<CircleAlert className="size-4" />}
        classNames={{
          content: "font-medium",
        }}
      >
        Limited stock
      </Chip>
    );
  } else {
    return (
      <Chip
        radius="sm"
        color="danger"
        variant="flat"
        startContent={<CircleAlert className="size-4" />}
        classNames={{
          base: "bg-danger-50",
          content: "font-medium",
        }}
      >
        Out of Stock
      </Chip>
    );
  }
}
