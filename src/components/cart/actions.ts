"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { CartLineInput, CartLineUpdateInput } from "@/__generated__/graphql";
import {
  addToCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "@/gql/mutations/cart";

import { COOKIES, TAGS } from "@/lib/constant";
import { createCart, getCart } from "@/lib/shopify";

import { getClient } from "../../../apollo-client";

export async function createCartAndSetCookie() {
  const { cart } = await createCart();
  (await cookies()).set(COOKIES.CART, cart.id!);
}

export async function addProductToCart(
  _: unknown,
  lines: CartLineInput | CartLineInput[],
) {
  if (!lines) {
    return {
      ok: false,
      message: "Missing product variant ID",
    };
  }

  let cartId = (await cookies()).get(COOKIES.CART)?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  // create new cart and  set cookie if there is no cart id or null cart (after checkout process).
  if (!cartId || !cart) {
    await createCartAndSetCookie();
  }

  if (cartId) {
    try {
      await getClient().mutate({
        mutation: addToCartMutation,
        variables: {
          cartId,
          lines,
        },
        fetchPolicy: "no-cache",
      });

      revalidateTag(TAGS.cart);

      return {
        ok: true,
        message: "Add to Cart Success!",
      };
    } catch (e) {
      return {
        ok: false,
        message: "Error adding item to cart",
      };
    }
  }
}

export async function removeItem(_: unknown, lineId: string) {
  const cartId = (await cookies()).get(COOKIES.CART)?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const { data } = await getClient().mutate({
    mutation: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
    fetchPolicy: "no-cache",
  });

  return data?.cartLinesRemove?.cart;
}

export async function updateCart(cartId: string, lines: CartLineUpdateInput[]) {
  const { data } = await getClient().mutate({
    mutation: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    fetchPolicy: "no-cache",
  });

  return data?.cartLinesUpdate?.cart;
}

export async function updateProductQuantity(payload: {
  lineId: string;
  quantity: number;
  variantId: string;
}) {
  const cartId = (await cookies()).get(COOKIES.CART)?.value;

  if (!cartId) {
    return "Missing Cart ID";
  }

  const { lineId, quantity, variantId } = payload;
  try {
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);

      return;
    }

    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
      },
    ]);

    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error updating product quantity";
  }
}

export async function updateCartLine({ line }: { line: CartLineUpdateInput }) {
  const cartId = (await cookies()).get(COOKIES.CART)?.value;

  if (!cartId) {
    return "Missing Cart ID";
  }

  try {
    await updateCart(cartId, [line]);

    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error updating cart line";
  }
}
