import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | null | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const setUrl = useCallback(
    (queryParams: string) => {
      router.replace(`${pathname}?${queryParams}`, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  return {
    searchParams,
    createQueryString,
    setUrl,
  };
}
