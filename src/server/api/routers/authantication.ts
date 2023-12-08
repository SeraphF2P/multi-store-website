import { hash } from 'bcryptjs';
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authanticationRouter = createTRPCRouter({
  signup: publicProcedure.input(z.object({
    username: z.string().min(3).max(12),
    password: z.string().min(8).max(20).refine((value) => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(value);
    }, "Invalid password"),
    password_confirmation: z.string().min(1).max(20)
  }).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  })).mutation(async ({ ctx, input: { username, password } }) => {

    const hashedPassword = await hash(password, 10)

    const user = await ctx.db.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })
    return Boolean(user)

  }),
  usernameNotAvailable: publicProcedure.input(z.object({
    username: z.string().min(3).max(20),
  }))
    .mutation(async ({ ctx, input: { username } }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          username,
        }
      })
      return user != null
    })
})