import { Suspense } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Skeleton } from "@nextui-org/skeleton";
import { link as linkStyles } from "@nextui-org/theme";

import Cart, { CartButton } from "@/components/cart";
import NavbarMobileMenu from "@/components/layout/navbar/navbar-mobile-menu";
import NavbarNestedMenu from "@/components/layout/navbar/navbar-nested-menu";
import { NavbarWrapper } from "@/components/layout/navbar/navbar-wrapper";
import SearchModal from "@/components/layout/navbar/search-modal";
import { getMenu } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export const Navbar = async () => {
  const menus = await getMenu("main-menu");

  return (
    <NavbarWrapper>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit shrink-0 basis-full gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <Image
              className="w-32"
              priority
              src="/wordmark.png"
              alt="brand icon"
              width={1200}
              height={220}
            />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        justify="center"
        className="ml-2 hidden items-center justify-start gap-8 lg:flex"
      >
        {menus.map((item) =>
          item.items.length ? (
            <NavbarNestedMenu key={item.id} menu={item} />
          ) : (
            <NavbarItem key={item.id}>
              <NextLink
                className={cn(
                  linkStyles({
                    color: "foreground",
                    className: "tracking-wide",
                  }),
                )}
                href={item.url}
              >
                {item.title}
              </NextLink>
            </NavbarItem>
          ),
        )}
      </NavbarContent>

      <NavbarContent
        className="hidden basis-1/5 lg:flex lg:basis-full"
        justify="end"
      >
        <NavbarItem>
          <Suspense
            fallback={
              <Skeleton className="h-10 w-[240px] rounded-medium bg-default-100" />
            }
          >
            <SearchModal />
          </Suspense>
        </NavbarItem>

        <NavbarItem>
          <Suspense fallback={<CartButton />}>
            <Cart />
          </Suspense>
        </NavbarItem>
      </NavbarContent>

      <NavbarMobileMenu menus={menus} />
    </NavbarWrapper>
  );
};
