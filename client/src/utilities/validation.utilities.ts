import { z } from "zod";

type NumberUnion = z.ZodUnion<
  [z.ZodNaN, z.ZodNumber, z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, number, string>]
>;

export const numberSchemaBuilder = (
  name: string,
  options?: {
    required?: boolean;
    constraint?: "positive" | "negative" | "non-negative" | "non-positive";
    allowZero?: boolean;
    typeErrorMessage?: string;
    constraintErrorMessage?: string;
    requiredErrorMessage?: string;
  },
) => {
  let schema: NumberUnion | z.ZodEffects<NumberUnion> | z.ZodEffects<z.ZodEffects<NumberUnion>> =
    z.union([
      z.nan(),
      z.number().int(),
      z
        .string()
        .refine(
          (val) => /^\d*$/.test(val),
          options?.typeErrorMessage ?? `${name} must be a number.`,
        )
        .transform((val) => (val === "" ? NaN : parseInt(val))),
    ]);
  if (options?.required) {
    schema = schema.refine(
      (val) => !isNaN(val),
      options?.requiredErrorMessage ?? `${name} is required.`,
    );
  }
  if (options?.constraint) {
    switch (options.constraint) {
      case "positive":
        schema = schema.refine(
          (val) => isNaN(val) || val > 0,
          options?.constraintErrorMessage ?? `${name} must be positive.`,
        );
        break;
      case "negative":
        schema = schema.refine(
          (val) => isNaN(val) || val < 0,
          options?.constraintErrorMessage ?? `${name} must be negative.`,
        );
        break;
      case "non-negative":
        schema = schema.refine(
          (val) => isNaN(val) || val >= 0,
          options?.constraintErrorMessage ?? `${name} must be non-negative.`,
        );
        break;
      case "non-positive":
        schema = schema.refine(
          (val) => isNaN(val) || val <= 0,
          options?.constraintErrorMessage ?? `${name} must be non-positive.`,
        );
        break;
    }
  }
  return schema;
};
