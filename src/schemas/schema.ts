"use client";
import { z } from "zod";
export const uplodBookSchema = z.object({
  quantity: z.preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z.number().min(1, {
      message: "Quantity Must Be Greater than 0.",
    })
  ),

  price: z.preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z.number().min(1, {
      message: "Price Must Be Greater than 0.",
    })
  ),

  image: z
    .instanceof(typeof window !== "undefined" ? FileList : Object)
    .optional(),
  file: z
    .custom<FileList | null>(
      (fileList) =>
        typeof window !== "undefined" &&
        fileList instanceof FileList &&
        fileList.length > 0,
      {
        message: "File is required",
      }
    )
    .refine(
      (fileList) =>
        typeof window !== "undefined" &&
        fileList &&
        fileList[0]?.size <= 5 * 1024 * 1024,
      {
        message: "File size should not exceed 5MB",
      }
    )
    .refine(
      (fileList) => {
        const file = fileList[0];
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        return file && allowedTypes.includes(file.type);
      },
      {
        message: "Only JPEG, PNG, or PDF files are allowed",
      }
    ),
});
