import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number too long"),
    email: z.string().nonempty("Email is required").
        email("Invalid email address"),
    role: z.enum(["user", "admin"], {
        required_error: "Role is required",
    }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.literal(true, {
        errorMap: () => ({ message: "You must agree to the Terms and Conditions" }),
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;
