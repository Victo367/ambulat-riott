import type { FormFieldErrors } from "@/lib/form-errors";

export type UserDocument = {
  toObject(): Record<string, unknown>;
};

export interface UserCreator {
  validate(body: Record<string, unknown>): FormFieldErrors;
  buildPayload(body: Record<string, unknown>): Record<string, unknown>;
  create(payload: Record<string, unknown>): Promise<UserDocument>;
}
