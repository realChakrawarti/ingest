"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";

import { TitleDescriptionSchema } from "~/shared/types-schema/schemas";
import type { TitleDescriptionType } from "~/shared/types-schema/types";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";

interface CatalogFormProps {
  catalogMetadataError: TitleDescriptionType;
  catalogMetadata: TitleDescriptionType;
  setCatalogMetadata: Dispatch<SetStateAction<TitleDescriptionType>>;
  setCatalogMetadataError: Dispatch<SetStateAction<TitleDescriptionType>>;
}

export default function CatalogForm({
  catalogMetadataError,
  catalogMetadata,
  setCatalogMetadata,
  setCatalogMetadataError,
}: CatalogFormProps) {
  const handleMetaUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setCatalogMetadata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    const parseCatalogMetadata = {
      ...catalogMetadata,
      [e.target.name]: e.target.value,
    };

    const result = TitleDescriptionSchema.safeParse(parseCatalogMetadata);

    if (!result.success) {
      const { title = { _errors: [""] }, description = { _errors: [""] } } =
        result.error.format();
      setCatalogMetadataError({
        title: title._errors[0],
        description: description._errors[0],
      });
    } else {
      setCatalogMetadataError({
        title: "",
        description: "",
      });
    }
  };

  return (
    <>
      <div className="space-y-4 mt-5">
        <div className="flex flex-col gap-1">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={catalogMetadata.title || ""}
              name="title"
              onChange={handleMetaUpdate}
            />
            {catalogMetadataError.title ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {catalogMetadataError.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={catalogMetadata.description || ""}
              name="description"
              onChange={handleMetaUpdate}
            />
            {catalogMetadataError.description ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {catalogMetadataError.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
