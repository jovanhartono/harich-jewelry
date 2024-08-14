import { cookies } from "next/headers";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/react";
import { ShoppingBagIcon } from "lucide-react";

import DeleteItem from "@/components/cart/delete-item";
import ItemQuantity from "@/components/cart/item-quantity";
import { title } from "@/components/primitives";
import { COOKIES, DEFAULT_TITLE_OPTION } from "@/lib/constant";
import { getCart } from "@/lib/shopify";
import { formatRupiah } from "@/lib/utils";

export default async function CartPage() {
  const id = cookies().get(COOKIES.CART)?.value;

  if (!id) {
    return notFound();
  }

  const cart = await getCart(id);

  if (!cart || cart?.lines.length === 0) {
    return notFound();
  }

  return (
    <div className="container flex flex-col gap-6 py-12">
      <div className="flex items-center gap-3">
        <ShoppingBagIcon className="size-9" />
        <h1 className={title()}>Shopping Cart</h1>
      </div>
      <div className="flex flex-col gap-12 lg:flex-row">
        <ul className="flex flex-col gap-6 lg:basis-2/3">
          {cart.lines.map((line) => {
            if (line.__typename !== "CartLine") {
              return;
            }

            const product = line.merchandise.product;
            const options = line.merchandise.selectedOptions;

            return (
              <li key={line.id} className="rounded-large bg-default-50 p-4">
                <figure className="flex grow items-center gap-6">
                  <NextLink href={`/product/${product.handle}`}>
                    <Image
                      classNames={{
                        wrapper: "shrink-0",
                      }}
                      className="aspect-square w-24 object-cover object-center lg:w-32"
                      alt={product.featuredImage?.altText || product.title}
                      src={product.featuredImage?.url}
                    />
                  </NextLink>
                  <figcaption className="flex flex-1 flex-col py-2">
                    <div className="flex items-center justify-between">
                      <strong
                        aria-label="Product Vendor"
                        className="font-semibold"
                      >
                        {product.vendor}
                      </strong>
                      <DeleteItem id={line.id} />
                    </div>
                    <NextLink href={`/product/${product.handle}`}>
                      <h2
                        aria-label="Product Title"
                        className="line-clamp-2 font-medium lg:text-lg"
                      >
                        {product.title}
                      </h2>
                    </NextLink>
                    <div className="mb-6 mt-1.5 flex gap-3 text-default-600">
                      {options
                        .filter(
                          (option) =>
                            option.value.toLowerCase() !==
                            DEFAULT_TITLE_OPTION.toLowerCase(),
                        )
                        .map((option) => (
                          <Chip
                            radius="sm"
                            color="default"
                            variant="flat"
                            key={option.name}
                          >
                            {option.name}:&nbsp;
                            <strong className="font-medium">
                              {option.value}
                            </strong>
                          </Chip>
                        ))}
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                      <p aria-label="price" className="font-semibold">
                        {formatRupiah(parseFloat(line.cost.totalAmount.amount))}
                      </p>
                      <ItemQuantity line={line} />
                    </div>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>

        <div className="basis-1/3">
          <div className="sticky top-[84px] flex h-72 flex-col gap-6 rounded-large bg-default-50 p-6">
            <dl className="flex grow flex-col gap-3">
              <dt className="mb-6 text-2xl font-semibold">Order Summary</dt>
              <dd className="mt-auto flex justify-between">
                Subtotal:
                <span className="font-semibold" aria-label="Cart subtotal">
                  {formatRupiah(parseFloat(cart.cost.subtotalAmount.amount))}
                </span>
              </dd>

              <Divider />

              <dd className="flex justify-between">
                Total:
                <span
                  className="text-right font-semibold"
                  aria-label="Cart subtotal"
                >
                  {formatRupiah(parseFloat(cart.cost.totalAmount.amount))}
                </span>
              </dd>
            </dl>

            <Button
              as={Link}
              color="primary"
              className="mt-auto"
              href={cart.checkoutUrl}
              disableRipple
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
