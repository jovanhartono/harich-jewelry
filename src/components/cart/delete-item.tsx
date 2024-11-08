"use client";

import { useActionState } from "react";
import { Button } from "@nextui-org/button";
import { XIcon } from "lucide-react";

import { removeItem } from "@/components/cart/actions";

export default function DeleteItem({ id }: { id: string }) {
  const [message, action, isPending] = useActionState(removeItem, null);
  const formAction = action.bind(null, id);

  return (
    <form action={formAction}>
      <Button
        type="submit"
        isLoading={isPending}
        isIconOnly
        radius="full"
        variant="light"
        size="sm"
      >
        <XIcon className="size-4" />
      </Button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
