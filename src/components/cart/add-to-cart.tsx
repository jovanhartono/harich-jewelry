"use client";

import { FormEvent, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartLineInput } from "@/__generated__/graphql";
import { Button, ButtonProps } from "@nextui-org/react";
import { CartIcon } from "@nextui-org/shared-icons";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

import { addProductToCart } from "@/components/cart/actions";

export default function AddToCart({
  lines,
  disabled = false,
  buttonProps,
  children,
}: {
  lines: CartLineInput | CartLineInput[];
  disabled?: boolean;
  buttonProps?: ButtonProps;
  children?: ReactNode;
}) {
  const router = useRouter();
  const [state, formAction] = useFormState(addProductToCart, null);
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
    } else {
      toast.error("Add to Cart Failed!", {
        description: state.message,
        closeButton: true,
      });
    }
  }, [router, state]);

  return (
    <form className="w-full max-w-md" action={actionWithVariant}>
      <SubmitButton isDisabled={disabled} {...buttonProps}>
        {children}
      </SubmitButton>
      <p aria-live="polite" role="status" className="sr-only">
        {state?.message}
      </p>
    </form>
  );
}

function SubmitButton(buttonProps: ButtonProps) {
  const {
    children,
    isDisabled: disabled,
    startContent,
    ...restProps
  } = buttonProps;
  const { pending } = useFormStatus();

  return (
    <Button
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
      startContent={
        pending ? null : (startContent ?? <CartIcon className="size-4" />)
      }
      {...restProps}
    >
      {children ?? "Add to Cart"}
    </Button>
  );
}
