import { z } from "zod";

export const floorPlanSchema = z.object({
    location: z.string().min(1, "Location is required"),
    floor: z.string().min(1, "Floor is required"),
    file: z.instanceof(File, { message: "File is required" })


});

export type FloorPlanFormData = z.infer<typeof floorPlanSchema>;
