"use client";

import {
  createContext,
  memo,
  ReactNode,
  Suspense,
  useCallback,
  useContext,
} from "react";
import {
  GetProductByHandleQuery,
  ImageConnection,
} from "@/__generated__/graphql";
import { getProductByHandleQuery } from "@/gql/queries/product";
import { useLazyQuery } from "@apollo/client";
import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";
import { Divider, Spinner } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/skeleton";
import { useDisclosure } from "@nextui-org/use-disclosure";

import { AddToLocalStorage } from "@/components/add-to-local-storage";
import { title } from "@/components/primitives";
import ProductDescription from "@/components/product/product-description";
import ProductImageGallery from "@/components/product/product-image-gallery";
import { ProductVariantsOptions } from "@/components/product/product-variant-options";
import ProductVariantPrice from "@/components/product/product-variant-price";
import { StoneCertificate } from "@/components/product/stone-certificate";
import { StoneFourC } from "@/components/product/stone-four-c";
import { PRODUCT_TYPES } from "@/lib/constant";
import { cn, handleProductQuery } from "@/lib/utils";

interface ProductModalContextType {
  open: (handle: string) => void;
}

const ProductModalContext = createContext<ProductModalContextType | undefined>(
  undefined,
);

const ProductDetail = memo(function ProductDetail({
  loading,
  data: dataProps,
}: {
  loading: boolean;
  data?: GetProductByHandleQuery;
}) {
  if (loading) {
    return (
      <div className="flex h-screen justify-center">
        <Spinner className="text-black" />
      </div>
    );
  }

  if (!dataProps) return null;

  const product = handleProductQuery(dataProps);

  if (!product) {
    return null;
  }

  return (
    <div className="flex flex-col gap-12 @container max-md:pb-6 md:py-12">
      <section className="grid @2xl:grid-cols-2">
        <div>
          <ProductImageGallery images={product.images as ImageConnection} />
        </div>
        <div className="max-md:container flex flex-col gap-6 lg:gap-6">
          <div className="flex flex-col">
            <h1
              aria-label="Product Title"
              className={title({ className: "mb-3 leading-snug" })}
            >
              {product.title}
            </h1>
            <Suspense fallback={<Skeleton className="h-8 rounded-large" />}>
              <ProductVariantPrice
                options={product.options}
                variants={product.variants}
              />
            </Suspense>
          </div>

          {product.productType === PRODUCT_TYPES.Stone &&
            product.stoneCertificate && (
              <StoneCertificate image={product.stoneCertificate} />
            )}

          <ProductVariantsOptions
            options={product.options}
            variants={product.variants}
          />

          <div
            className={cn(
              "flex items-center gap-3 bg-white",
              "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 max-md:h-20 max-md:border-t max-md:border-t-default-300 max-md:px-3 max-md:py-3",
            )}
          >
            {(product.productType === PRODUCT_TYPES.Setting ||
              product.productType === PRODUCT_TYPES.Stone) && (
              <AddToLocalStorage
                type={product.productType as keyof typeof PRODUCT_TYPES}
                product={product}
              />
            )}
            {/* <ProductWhatsappButton /> */}
            {/* <AddToCart */}
            {/*   options={product.options} */}
            {/*   variants={product.variants as ProductVariant[]} */}
            {/* /> */}
          </div>

          <Divider />
          <dl className="flex flex-col gap-3">
            <dt
              id="Product Description"
              className="text-lg font-semibold text-foreground"
            >
              About This Product
            </dt>
            <dd>
              <ProductDescription html={product.descriptionHtml} />
            </dd>
          </dl>
        </div>
      </section>

      <section className="container">
        {product.productType === PRODUCT_TYPES.Stone && (
          <StoneFourC specifications={product.stoneSpecifications} />
        )}
      </section>
    </div>
  );
});

export const ProductModalProvider = ({ children }: { children: ReactNode }) => {
  const disclosure = useDisclosure();
  const { isOpen, onOpenChange, onOpen } = disclosure;

  const [getProduct, { loading, data }] = useLazyQuery(getProductByHandleQuery);

  const open = useCallback((handle: string) => {
    getProduct({ variables: { handle } });
    onOpen();
  }, []);

  return (
    <ProductModalContext.Provider value={{ open }}>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          // base: "max-h-[90dvh]",
        }}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalBody>
            <ProductDetail loading={loading} data={data} />
          </ModalBody>
        </ModalContent>
      </Modal>
      {children}
    </ProductModalContext.Provider>
  );
};
export function useProductModal() {
  const context = useContext(ProductModalContext);

  if (context === undefined) {
    throw new Error(
      "useProductModal must be used within a ProductModalProvider",
    );
  }

  return context;
}
