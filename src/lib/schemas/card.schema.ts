import { z } from "zod"

// Schema for cultural preferences data
export const cardDataSchema = z.object({
  movies: z.string().min(1, "Movies field is required"),
  series: z.string().min(1, "Series field is required"),
  music: z.string().min(1, "Music field is required"),
  books: z.string().min(1, "Books field is required"),
})

// Schema for create card command
export const createCardCommandSchema = z.object({
  card_data: cardDataSchema,
  generated_card_data: cardDataSchema.optional(),
})

// Schema for update card command
export const updateCardCommandSchema = z.object({
  card_data: cardDataSchema,
  generated_card_data: cardDataSchema.optional(),
})

// Type inference helpers
export type CardDataSchema = z.infer<typeof cardDataSchema>
export type CreateCardCommandSchema = z.infer<typeof createCardCommandSchema>
export type UpdateCardCommandSchema = z.infer<typeof updateCardCommandSchema>
