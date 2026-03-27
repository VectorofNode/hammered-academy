import { z } from "zod/v4";

export const courseSchema = z.object({
    title: z.string().min(2, "Title must contains at least 2 words."),
    description: z.string().min(5, "Description must contains at least 5 words."),
    image: z.string()
})