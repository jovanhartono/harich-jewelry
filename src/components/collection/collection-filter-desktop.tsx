import { Fragment, useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilter } from "@/providers/filter-provider";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { FilterIcon } from "lucide-react";

import { FILTER_ID } from "@/lib/constant";
import { cn } from "@/lib/utils";

export const CollectionFilterDesktop = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [isLoading, transition] = useTransition();

  const { filters } = useFilter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const isChecked = useCallback(
    (key: string, value: string) => {
      return Array.from(searchParams.entries()).some(
        ([k, v]) => k === key && v === value,
      );
    },
    [searchParams],
  );

  const handleCheckChange = useCallback(
    (id: string, label: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams);

      checked ? params.append(id, label) : params.delete(id, label);

      transition(() => {
        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [pathname, replace, searchParams],
  );

  return (
    <Fragment>
      <Button
        onClick={onOpen}
        className="min-w-fit data-[hover=true]:bg-default-50"
        variant="light"
        endContent={<FilterIcon className="size-4" />}
      >
        Filter
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        radius="none"
        size="sm"
        classNames={{
          wrapper: "justify-start",
          base: "sm:m-0 h-screen max-h-none",
        }}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              transition: {
                duration: 0.15,
                ease: "easeInOut",
              },
            },
            exit: {
              x: -384,
              transition: {
                duration: 0.15,
                ease: "easeInOut",
              },
            },
          },
        }}
      >
        <ModalContent className="relative">
          <ModalHeader>
            <h1>Filter</h1>
          </ModalHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : null}
          <ModalBody>
            <ul className="flex flex-col gap-6">
              {filters.map((f) => (
                <li
                  key={f.id}
                  className={cn("flex flex-col gap-2", {
                    "w-full": f.id === FILTER_ID.shape,
                  })}
                >
                  <p className="font-medium">{f.label}</p>

                  <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {f.values.map((fv) => (
                      <li
                        key={fv.id}
                        className={cn("shrink-0 basis-[72px] cursor-pointer")}
                      >
                        <label
                          aria-disabled={fv.count < 1}
                          id={fv.id}
                          className="group flex h-full cursor-pointer flex-col"
                        >
                          <input
                            className="sr-only"
                            disabled={fv.count < 1}
                            type="checkbox"
                            defaultChecked={isChecked(f.id, fv.label)}
                            onChange={({ target }) => {
                              handleCheckChange(f.id, fv.label, target.checked);
                            }}
                          />
                          {fv.image?.image ? (
                            <figure className="flex flex-col gap-2">
                              <div className="rounded-medium p-2 duration-100 transition-background group-hover:bg-primary group-has-[:checked]:bg-primary">
                                <img
                                  className="mx-auto h-10 brightness-0"
                                  src={fv.image.image.url}
                                  alt={fv.image.image.altText || fv.label}
                                />
                              </div>
                              <figcaption className="text-balance text-center text-sm text-default-700 group-has-[:checked]:font-medium group-has-[:checked]:text-black">
                                {fv.label}
                              </figcaption>
                            </figure>
                          ) : (
                            <p className="group-has-[:checked]:font-semibold">
                              {fv.label}
                            </p>
                          )}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};
