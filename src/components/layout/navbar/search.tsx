"use client";

import { ComponentProps, FormEvent, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";

import { cn, createUrl } from "@/lib/utils";

export const Search = ({
  endContent,
  formClassname,
  ...props
}: ComponentProps<typeof Input> & {
  onSubmit?: () => void;
  formClassname?: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;

    // only process search when the value is not an empty string
    if (!search.value.trim()) {
      return;
    }

    const newParams = new URLSearchParams();

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    startTransition(() => {
      router.push(createUrl("/search", newParams));
    });

    props.onSubmit?.();
  }
  return (
    <search className={cn(formClassname)}>
      <form action="." onSubmit={onSubmit}>
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <Input
          id="search"
          autoComplete="off"
          aria-autocomplete="none"
          name="search"
          aria-label="Search Collections"
          classNames={{
            input: "truncate",
            inputWrapper:
              "focus-within:!ring-0 focus-within:!ring-offset-0 hover:!bg-default-100",
          }}
          labelPlacement="outside"
          placeholder="Search Collections..."
          startContent={
            <SearchIcon className="pointer-events-none mx-1 flex-shrink-0 text-base text-default-700" />
          }
          isClearable
          defaultValue={searchParams?.get("q") || ""}
          endContent={isPending ? <Spinner /> : endContent}
          type="search"
          {...props}
        />
      </form>
    </search>
  );
};
