"use client";

import { useState } from "react";
import { CartLineFragment } from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { MinusIcon, PlusIcon } from "lucide-react";

import { updateProductQuantity } from "@/components/cart/actions";

export default function ItemQuantity({ line }: { line: CartLineFragment }) {
  const [response, setResponse] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDecrement() {
    setLoading(true);
    const response = await updateProductQuantity({
      lineId: line.id,
      variantId: line.merchandise.id,
      quantity: line.quantity - 1,
    });
    setLoading(false);
    setResponse(response);
  }

  async function handleIncrement() {
    setLoading(true);
    const response = await updateProductQuantity({
      lineId: line.id,
      variantId: line.merchandise.id,
      quantity: line.quantity + 1,
    });
    setLoading(false);
    setResponse(response);
  }

  return (
    <div className="relative mt-auto flex items-center gap-4">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-large bg-default-100/50">
          <Spinner size="sm" />
        </div>
      ) : null}
      <Button
        radius="sm"
        isIconOnly
        type="submit"
        onClick={handleDecrement}
        size="sm"
        variant="flat"
      >
        <MinusIcon className="size-4" />
      </Button>
      <div aria-label="quantity">{line.quantity}</div>
      <Button
        isIconOnly
        type="submit"
        onClick={handleIncrement}
        isDisabled={line.quantity === line.merchandise.quantityAvailable}
        size="sm"
        variant="flat"
      >
        <PlusIcon className="size-4" />
      </Button>
      <p aria-live="polite" className="sr-only" role="status">
        {response}
      </p>
    </div>
  );
}
