"use client";

import { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-primary group-[.toaster]:border-default-300 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-default-500",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-default-100 group-[.toast]:text-primary",
          closeButton: "bg-default-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
