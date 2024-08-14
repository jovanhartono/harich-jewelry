"use client";

import { Button } from "@nextui-org/button";
import { XIcon } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

import { removeItem } from "@/components/cart/actions";

export default function DeleteItem({ id }: { id: string }) {
  const [message, action] = useFormState(removeItem, null);
  const formAction = action.bind(null, id);

  return (
    <form action={formAction}>
      <DeleteButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      isLoading={pending}
      isIconOnly
      radius="full"
      variant="light"
      size="sm"
    >
      <XIcon className="size-4" />
    </Button>
  );
}
