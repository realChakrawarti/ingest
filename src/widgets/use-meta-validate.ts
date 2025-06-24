import { type ChangeEvent, useLayoutEffect, useState } from "react";

import { TitleDescriptionSchema } from "~/shared/types-schema/schemas";
import type { TitleDescriptionType } from "~/shared/types-schema/types";

const initialState: TitleDescriptionType = {
  title: "",
  description: "",
};

export function useMetaValidate({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  useLayoutEffect(() => {
    if (!title || !description) {
      return;
    }
    setMeta({
      title,
      description,
    });

    return () => {
      setMeta(initialState);
      setMetaError(initialState);
    };
  }, [title, description]);

  const [meta, setMeta] = useState(initialState);

  const [metaError, setMetaError] = useState(initialState);

  function resetState() {
    setMeta(initialState);
    setMetaError(initialState);
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
      const { title = { _errors: [""] }, description = { _errors: [""] } } =
        parsedMeta.error.format();
      setMetaError({
        title: title._errors[0],
        description: description._errors[0],
      });
    } else {
      setMetaError({
        title: "",
        description: "",
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
