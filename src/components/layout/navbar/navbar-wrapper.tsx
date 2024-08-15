"use client";

import { memo, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar as NextUINavbar } from "@nextui-org/react";

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
  }, [pathname]);

  return (
    <NextUINavbar
      maxWidth="2xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      height="5rem"
      isBlurred={false}
      isBordered
      classNames={{
        base: "bg-background",
        wrapper: "px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16",
      }}
    >
      {children}
    </NextUINavbar>
  );
});
