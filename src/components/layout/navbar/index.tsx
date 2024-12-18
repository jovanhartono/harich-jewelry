import { Suspense } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Skeleton } from "@nextui-org/skeleton";
import { button as buttonStyle, link as linkStyles } from "@nextui-org/theme";

import NavbarMobileMenu from "@/components/layout/navbar/navbar-mobile-menu";
import { NavbarWrapper } from "@/components/layout/navbar/navbar-wrapper";
import SearchModal from "@/components/layout/navbar/search-modal";
import { siteConfig } from "@/config/site";
import { getMenu } from "@/lib/shopify";
import { cn } from "@/lib/utils";

import NavbarNestedMenu from "./navbar-nested-menu";

export async function Navbar() {
  const menus = await getMenu("main-menu");

  return (
    <NavbarWrapper>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit shrink-0 basis-full gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <NextImage
              priority
              width={125}
              height={23}
              src={siteConfig.logo}
              alt="header wordmark"
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

        {/* <NavbarItem>
          <Suspense fallback={<CartButton />}>
            <Cart />
          </Suspense>
        </NavbarItem> */}

        <NavbarItem>
          <a
            target="_blank"
            href={siteConfig.links.whatsapp}
            rel="noopener noreferrer"
            className={buttonStyle({
              variant: "solid",
              radius: "sm",
              color: "primary",
            })}
          >
            Book Appointment
          </a>
        </NavbarItem>
      </NavbarContent>

      <NavbarMobileMenu menus={menus} />
    </NavbarWrapper>
  );
}
