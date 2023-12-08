import { z } from "zod";


export const Validator = {
  image: z.any()
    .refine((file) => file?.size <= 1024 * 1024 * 2, `Max image size is 2MB.`)
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
}
export const username = z.string({ required_error: "description" }).min(3, "username must be at least 3 charcters").max(12)
export const password = z.string().min(8, "password must be between 8~20 charcters").max(20).refine((value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(value);
}, "Invalid password")
export const product =
{
  create: z.object({
    name: z.string().min(1),
    price: z.string().refine(
      (value) => {
        // Check if the value is a decimal number
        return Number.isInteger(value) === false;
      },
      {
        message: "Value must be a decimal number",
      },
    ),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    storeId: z.string().min(1),
    sizeId: z.string().min(1),
    image: Validator.image,
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