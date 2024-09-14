import { useProduct } from "@/app/product/provider";

import { StoneCertificate } from "@/components/product/stone-certificate";
import { StoneSpecifications } from "@/components/product/stone/stone-specifications";

export function StoneSection() {
  const { product } = useProduct();
  return (
    <div className="flex gap-6 max-md:flex-col md:items-center md:divide-x md:divide-black">
      <StoneSpecifications
        className="flex gap-9"
        specifications={product.stoneSpecifications}
      />
      {product.stoneCertificate ? (
        <StoneCertificate
          className="md:pl-6"
          image={product.stoneCertificate}
        />
      ) : null}
    </div>
  );
}
