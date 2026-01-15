import {z} from "zod";

export const productSchema = z.object({
    title: z.string().min(3,"Title is required"),
    description: z.string().min(5,"Description is required"),
    price: z.number().min(1,"Price must be positive"),
    category: z.string().min(1,"Category is required"),
    thumbnail: z.string().url("Thumbnail must be a valid URL"),
});

export type ProductInput = z.infer<typeof productSchema>;