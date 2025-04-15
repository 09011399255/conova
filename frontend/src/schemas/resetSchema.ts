import { z } from "zod";

export const resetSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .email("Please enter a valid email address"),
});

export type ResetSchema = z.infer<typeof resetSchema>;
