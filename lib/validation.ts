import { z } from "zod";
import { categories } from "./types";
export const cardSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.enum(categories),
  front: z.string().trim().min(5).max(500),
  back: z.string().trim().min(5).max(600),
  explanation: z.string().trim().max(1000).default(""),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  display_order: z.coerce.number().int().min(0).max(10000),
  published: z.boolean(),
});
export const subscriptionSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().max(100).default(""),
  consent: z.literal(true),
  website: z.string().max(0).default(""),
});
