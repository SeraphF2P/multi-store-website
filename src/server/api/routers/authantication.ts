import { hash } from 'bcryptjs';
import { z } from "zod";
import * as ZOD from '~/lib/zodValidators'
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authanticationRouter = createTRPCRouter({
  signup: publicProcedure.input(z.object({
    username: ZOD.username,
    password: ZOD.password,
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
    username: ZOD.username,
  }))
    .mutation(async ({ ctx, input: { username } }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          OR: [
            { username: { equals: username } },
            { email: { equals: username } },
          ],
        }
      })
      return user != null
    })
})