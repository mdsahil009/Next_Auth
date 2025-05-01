import {z} from 'zod'

export const mesageSchema = z.object({
    content: z
    .string()
    .min(10, " Content must be at least 10 Characters")
    .max(500, "Content must be less then 500 Characters")
})