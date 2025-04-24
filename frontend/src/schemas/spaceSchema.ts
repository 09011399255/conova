import { z } from "zod";

export const roomSchema = z.object({
    type: z.string().nonempty("Space type is required"),
    workspace: z.string().nonempty("Workspace is required"),
    capacity: z.string().nonempty("Capacity is required"),
    number: z.string().nonempty("Room Number is required"),
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

export type SpaceRoomData = z.infer<typeof roomSchema>;


export const seatSchema = z.object({
    workspace: z.string().nonempty("Workspace is required"),
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

export type SpaceSeatData = z.infer<typeof seatSchema>;

