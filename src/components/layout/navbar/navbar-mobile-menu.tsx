import { Suspense } from "react";
import NextLink from "next/link";
import {
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";

import Cart, { CartButton } from "@/components/cart";
import NavbarMobileNestedMenu from "@/components/layout/navbar/navbar-mobile-nested-menu";
import SearchModalMobile from "@/components/layout/navbar/search-modal-mobile";
import type { GetMenuReturnType } from "@/lib/shopify";

export default function NavbarMobileMenu({
  menus,
}: {
  menus: GetMenuReturnType;
}) {
  return (
    <>
      <NavbarContent className="basis-1 pl-4 lg:hidden" justify="end">
        <NavbarItem>
          <SearchModalMobile />
        </NavbarItem>
        <NavbarItem>
          <Suspense fallback={<CartButton />}>
            <Cart />
          </Suspense>
        </NavbarItem>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="gap-0 divide-y divide-default-300 bg-background px-0">
        {menus.map((menu) => (
          <NavbarMenuItem className="px-6 py-4" key={menu.id}>
            {menu.items.length ? (
              <NavbarMobileNestedMenu menu={menu} />
            ) : (
              <NextLink href={menu.url}>{menu.title}</NextLink>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </>
  );
}
