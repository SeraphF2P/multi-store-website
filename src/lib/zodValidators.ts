import { z } from "zod";

export default z;
export const image = z.any()
  .refine((files) => files?.[0] != null, `image is required`)
  .refine((files) => files?.[0]?.size <= 1024 * 1024 * 2, `Max image size is 2MB`)
  .refine(
    (files) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files?.[0]?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported"
  )

export const username = z.string({ required_error: "description" }).min(3, "username must be at least 3 charcters").max(20, "username can't exceed 20 charcters")
export const password = z.string().min(8, "password must be between 8~20 charcters").max(20).refine((value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(value);
}, "Invalid password")
export const email = z.string().email()

export const product =
{
  create: z.strictObject({
    name: z.string().min(1, "name must be at least 3 charcters").max(30, "name can't exceed 30 charcters"),
    price: z.number().gt(0, "price cannot be 0").lte(9999, "price cannot be greater than 9999"),
    categoryId: z.string().uuid(),
    colorId: z.string().min(1, "color is required"),
    storeId: z.string().uuid(),
    sizeId: z.string().min(1, "size is required"),
    groupId: z.number().int().optional(),
    isFeatured: z.boolean().default(false).optional(),
    image,
  }),
  edit: z.strictObject({
    name: z.string().min(1, "name must be at least 3 charcters").max(30, "name can't exceed 30 charcters"),
    price: z.number().gt(0, "price cannot be 0").lte(9999, "price cannot be greater than 9999"),
    colorId: z.string().min(1, "color is required"),
    sizeId: z.string().min(1, "size is required"),
    productId: z.string().uuid(),
    storeId: z.string().uuid(),
    isFeatured: z.boolean().default(false).optional(),
    image: z
      .custom<FileList>(
        (data) => data instanceof FileList && data.length === 0,
      )
      .or(image),
  })
}
export const category = {
  create: z.object({
    name: z.string().min(3, "name must be at least 3 charcters").max(20, "name can't exceed 20 characters"),
    storeId: z.string().uuid(),
    label: z.string().min(3, "label must be at least 3 charcters").max(30, "label can't exceed 30 characters"),
    image
  }),
  edit: z.object({
    name: z.string().min(3),
    categoryId: z.string().uuid(),
  })
}
export const billboard = {
  create: z.object({
    storeId: z.string().uuid(),
    categoryId: z.string().uuid(),
    label: z.string().min(3),
    image
  }),
  edit: z.object({
    label: z.string(),
    billboardId: z.string().uuid(),
    image: z
      .custom<FileList>(
        (data) => data instanceof FileList && data.length === 0,
      )
      .or(image),
  })
}
export const color = {
  create: z.object({
    name: z.string().min(3, "color must be at least 3 charcters").max(20, "color can't exceed 20 characters"),
    value: z.string().min(3, "color must be at least 3 charcters").max(20, "color can't exceed 20 characters"),
    categoryId: z.string().uuid(),
  }),
  edit: z.object({
    name: z.string().min(3, "color must be at least 3 charcters").max(20, "color can't exceed 20 characters"),
    value: z.string().min(3, "color must be at least 3 charcters").max(20, "color can't exceed 20 characters"),
    colorId: z.string().min(1)
  })
}
export const size = {
  create: z.object({
    name: z.string().min(1, "size must be at least 3 charcters").max(20, "size can't exceed 20 characters"),
    value: z.string().min(1, "size must be at least 3 charcters").max(20, "size can't exceed 20 characters"),
    categoryId: z.string().uuid(),
  }),
  edit: z.object({
    name: z.string().min(1, "size must be at least 3 charcters").max(20, "size can't exceed 20 characters"),
    value: z.string().min(1, "size must be at least 3 charcters").max(20, "size can't exceed 20 characters"),
    sizeId: z.string().min(1)
  })
}
export const auth = {
  signup: z.object({
    username,
    password,
    password_confirmation: z.string().min(1).max(20)
  }).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  })
}