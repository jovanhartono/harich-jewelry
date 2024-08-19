import { useProduct } from "@/app/product/provider";

import { StoneCertificate } from "@/components/product/stone-certificate";
import { StoneSpecifications } from "@/components/product/stone/stone-specifications";

export function StoneSection() {
  const { product } = useProduct();
  return (
    <div className="flex items-center gap-6 divide-x divide-black">
      <StoneSpecifications
        className="flex gap-9"
        specifications={product.stoneSpecifications}
      />
      {product.stoneCertificate ? (
        <StoneCertificate className="pl-6" image={product.stoneCertificate} />
      ) : null}
    </div>
  );
}
