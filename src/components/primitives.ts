import { cva } from "class-variance-authority";

export const title = cva("inline font-semibold tracking-tight", {
  variants: {
    color: {},
    size: {
      sm: "text-2xl lg:text-3xl",
      md: "text-3xl lg:text-4xl",
      lg: "text-4xl lg:text-5xl",
    },
    fullWidth: {
      true: "block w-full",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [],
      class: "bg-gradient-to-b bg-clip-text text-transparent",
    },
  ],
});

export const subtitle = cva(
  "my-2 w-full max-w-full text-balance text-default-600 md:w-1/2 lg:text-lg",
  {
    variants: {
      fullWidth: {
        true: "!w-full",
      },
    },
    defaultVariants: {
      fullWidth: true,
    },
  },
);
