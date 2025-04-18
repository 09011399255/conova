import { z } from "zod";

export const spaceSchema = z.object({
    name: z.string().nonempty("Space name is required"),
    location: z.string().nonempty("Location is required"),
    spaceType: z.string().nonempty("Space type is required"),
    capacity: z.string().nonempty("Capacity is required"),
    floor: z.string().nonempty("Floor is required"),
    file: z
        .any()
        .refine((file) => file instanceof File, {
            message: "Image is required",
        })
        .refine((file) => file && file.size <= 500000, {
            message: "File size must be less than 500KB",
        }),

});

export type SpaceFormData = z.infer<typeof spaceSchema>;
