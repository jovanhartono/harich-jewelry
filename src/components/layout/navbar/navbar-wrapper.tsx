"use client";

import { memo, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar as NextUINavbar } from "@nextui-org/navbar";

export const NavbarWrapper = memo(function NavbarWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <NextUINavbar
      maxWidth="2xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      height="5rem"
      isBordered
      isBlurred={false}
      classNames={{
        base: "bg-background border-b-default-500",
        wrapper: "px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16",
      }}
    >
      {children}
    </NextUINavbar>
  );
});
