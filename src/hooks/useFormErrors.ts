"use client";

import { useCallback, useState } from "react";
import {
  FormFieldErrors,
  mergeFieldErrors,
  normalizeFieldErrors,
  parseApiErrorResponse,
} from "@/lib/form-errors";
import { hasFieldErrors } from "@/lib/field-validation";

type RequiredField = {
  name: string;
  value: unknown;
  message?: string;
};

export function useFormErrors() {
  const [errors, setErrors] = useState<FormFieldErrors>({});

  const clearErrors = useCallback(() => setErrors({}), []);

  const clearField = useCallback((name: string) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setFieldErrors = useCallback((fields: FormFieldErrors) => {
    setErrors(normalizeFieldErrors(fields));
  }, []);

  const getError = useCallback(
    (name: string) => errors[name],
    [errors]
  );

  const validateRequired = useCallback((fields: RequiredField[]) => {
    const next: FormFieldErrors = {};
    for (const field of fields) {
      const empty =
        field.value === undefined ||
        field.value === null ||
        (typeof field.value === "string" && !field.value.trim());
      if (empty) {
        next[field.name] =
          field.message ?? "Este campo é obrigatório";
      }
    }
    return Object.keys(next).length > 0 ? next : null;
  }, []);

  const validateForm = useCallback((fields: FormFieldErrors) => {
    const normalized = normalizeFieldErrors(fields);
    if (hasFieldErrors(normalized)) {
      setErrors(normalized);
      return normalized;
    }
    return null;
  }, []);

  const applyApiError = useCallback(
    async (
      res: Response,
      fallback?: string,
      aliases?: Record<string, string>
    ) => {
      const { message, fields } = await parseApiErrorResponse(
        res,
        fallback
      );
      let merged = mergeFieldErrors(fields);
      if (aliases) {
        for (const [from, to] of Object.entries(aliases)) {
          if (merged[from]) {
            merged[to] = merged[from];
            delete merged[from];
          }
        }
      }
      if (Object.keys(merged).length === 0) {
        setErrors({ _form: message });
      } else {
        setErrors(merged);
      }
      return { message, fields: merged };
    },
    []
  );

  return {
    errors,
    clearErrors,
    clearField,
    setFieldErrors,
    getError,
    validateRequired,
    validateForm,
    applyApiError,
  };
}
