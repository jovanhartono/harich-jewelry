"use client";

import { FormEvent, ReactNode, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartLineInput } from "@/__generated__/graphql";
import { Button, ButtonProps } from "@nextui-org/button";
import { toast } from "sonner";

import { addProductToCart } from "@/components/cart/actions";

export default function AddToCart({
  lines,
  disabled = false,
  buttonProps,
  children,
  onSuccess,
}: {
  lines: CartLineInput | CartLineInput[];
  disabled?: boolean;
  buttonProps?: ButtonProps;
  children?: ReactNode;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(addProductToCart, null);
  const actionWithVariant = formAction.bind(null, lines);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.ok) {
      toast.success(state.message, {
        action: {
          label: "View Cart",
          onClick: () => {
            router.push("/cart");
          },
        },
        closeButton: true,
      });

      onSuccess?.();
    } else {
      toast.error("Add to Cart Failed!", {
        description: state.message,
        closeButton: true,
      });
    }
  }, [onSuccess, router, state]);

  return (
    <form className="w-full lg:max-w-md" action={actionWithVariant}>
      <Button
        radius="none"
        type="submit"
        onClick={(e: FormEvent<HTMLButtonElement>) => {
          if (pending || disabled) e.preventDefault();
        }}
        aria-label="Add to cart"
        isDisabled={disabled}
        aria-disabled={pending || disabled}
        color="primary"
        size="lg"
        isLoading={pending}
        className="w-full"
        startContent={pending ? null : buttonProps?.startContent}
        {...buttonProps}
      >
        {children ?? "Add to Cart"}
      </Button>
      <p aria-live="polite" role="status" className="sr-only">
        {state?.message}
      </p>
    </form>
  );
}
