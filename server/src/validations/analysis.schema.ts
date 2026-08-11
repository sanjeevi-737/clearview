import { z } from "zod";

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const analyzeSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2048, "URL is too long")
    .refine(isHttpUrl, "URL must be a valid http(s) address"),
});

export const objectIdSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
export type ObjectIdInput = z.infer<typeof objectIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
