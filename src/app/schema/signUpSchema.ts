import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(10, "Username must be less then 10 Characters")
    .regex(/^[a-zA-Z0-9_]+$/ , "Username must not contain special character")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message : "Invald email address"}),
    password: z.string().min(4, {message : "password must be at least 4 character"})
    
})