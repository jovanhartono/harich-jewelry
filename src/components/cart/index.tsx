import { cookies } from "next/headers";
import NextLink from "next/link";
import { Badge } from "@nextui-org/badge";
import { Button } from "@nextui-org/button";
import { CartIcon } from "@nextui-org/shared-icons";

import { COOKIES } from "@/lib/constant";
import { getCart } from "@/lib/shopify";

export default async function Cart() {
  const cartId = (await cookies()).get(COOKIES.CART)?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return (
    <Badge
      shape="circle"
      placement="top-right"
      color="secondary"
      content={cart?.totalQuantity ? "" : undefined}
    >
      <CartButton />
    </Badge>
  );
}

export function CartButton() {
  return (
    <Button
      as={NextLink}
      href="/cart"
      isIconOnly
      aria-label="cart"
      variant="light"
    >
      <CartIcon className="size-5" />
    </Button>
  );
}
