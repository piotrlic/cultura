import { z } from "zod";

/**
 * Zod schema for validating card data input in the generate endpoint
 */
export const cardDataSchema = z.object({
  card_data: z.object({
    movies: z.string().min(1, "Movies field is required"),
    series: z.string().min(1, "Series field is required"),
    music: z.string().min(1, "Music field is required"),
    books: z.string().min(1, "Books field is required"),
  }),
});

export type CardDataInput = z.infer<typeof cardDataSchema>;
