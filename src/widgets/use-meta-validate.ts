import { type ChangeEvent, useLayoutEffect, useState } from "react";
import z from "zod";

import { TitleDescriptionSchema } from "~/shared/types-schema/schemas";
import type { TitleDescriptionType } from "~/shared/types-schema/types";

const initialState: TitleDescriptionType = {
  description: "",
  isPublic: true,
  title: "",
};

const initialErrorState: Omit<TitleDescriptionType, "isPublic"> & {
  isPublic: string;
} = {
  description: "",
  isPublic: "",
  title: "",
};

export function useMetaValidate({
  title,
  description,
  isPublic,
}: {
  title?: string;
  description?: string;
  isPublic: boolean;
}) {
  useLayoutEffect(() => {
    if (!title || !description) {
      return;
    }
    setMeta({
      description,
      isPublic,
      title,
    });

    return () => {
      setMeta(initialState);
      setMetaError(initialErrorState);
    };
  }, [title, description]);

  const [meta, setMeta] = useState(initialState);

  const [metaError, setMetaError] = useState(initialErrorState);

  function resetState() {
    setMeta(initialState);
    setMetaError(initialErrorState);
  }

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const field = e.target.name;
    setMeta((prev) => ({
      ...prev,
      [field]: value,
    }));

    const parseMeta = {
      ...meta,
      [field]: value,
    };

    const parsedMeta = TitleDescriptionSchema.safeParse(parseMeta);

    if (!parsedMeta.success) {
      const {
        title = { _errors: [""] },
        description = { _errors: [""] },
        isPublic = { _errors: [""] },
      } = z.formatError(parsedMeta.error);

      setMetaError({
        description: description._errors[0],
        isPublic: isPublic?._errors[0],
        title: title._errors[0],
      });
    } else {
      setMetaError({
        description: "",
        isPublic: "",
        title: "",
      });
    }
  }

  const submitDisabled =
    metaError.title ||
    metaError.description ||
    !meta.title ||
    !meta.description;

  return { handleOnChange, meta, metaError, resetState, submitDisabled };
}
