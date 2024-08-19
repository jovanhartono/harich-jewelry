"use client";

import { memo, useCallback, useState } from "react";
import { AttributeInput, CartLineFragment } from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/react";
import { FilePenLineIcon, SaveIcon } from "lucide-react";

import { updateCartLine } from "@/components/cart/actions";

export const LineAttributes = memo(function LineAttributes({
  line,
}: {
  line: CartLineFragment;
}) {
  const cartLineAttributes: AttributeInput[] = line.attributes.map(
    (attribute) => ({
      key: attribute.key,
      value: attribute.value || "",
    }),
  );

  const handleSave = useCallback(
    async (attribute: AttributeInput) => {
      await updateCartLine({
        line: {
          id: line.id,
          merchandiseId: line.merchandise.id,
          attributes: cartLineAttributes.map((attr) =>
            attr.key === attribute.key
              ? { ...attribute, value: attribute.value }
              : attr,
          ),
        },
      });
    },
    [cartLineAttributes, line.id, line.merchandise.id],
  );

  return (
    <ul className="mb-6 flex gap-3 text-default-600 max-md:flex-col">
      {cartLineAttributes.map((attr) => (
        <li key={attr.key}>
          <LineAttribute attribute={attr} onSave={handleSave} />
        </li>
      ))}
    </ul>
  );
});

const LineAttribute = memo(function LineAttribute({
  onSave,
  attribute,
}: {
  onSave: (attribute: AttributeInput) => Promise<void>;
  attribute: AttributeInput;
}) {
  const [attributeValue, setAttributeValue] = useState<string>(
    attribute.value || "",
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleOnPress = useCallback(async () => {
    if (isEditing && attributeValue !== attribute.value) {
      setLoading(true);
      await onSave({
        ...attribute,
        value: attributeValue,
      });
      setLoading(false);
    }

    setIsEditing(!isEditing);
  }, [isEditing, attributeValue, attribute, onSave]);

  return (
    <Input
      label={attribute.key}
      classNames={{
        label: "capitalize text-sm",
      }}
      labelPlacement="outside"
      defaultValue={attribute.value || ""}
      readOnly={!isEditing || loading}
      size="sm"
      variant={isEditing ? "bordered" : "flat"}
      onValueChange={setAttributeValue}
      endContent={
        <Button
          onPress={handleOnPress}
          isIconOnly
          size="sm"
          className="bg-transparent p-0"
        >
          {loading ? (
            <Spinner size="sm" color="warning" />
          ) : isEditing ? (
            <SaveIcon className="size-4" />
          ) : (
            <FilePenLineIcon className="size-4" />
          )}
        </Button>
      }
    />
  );
});
