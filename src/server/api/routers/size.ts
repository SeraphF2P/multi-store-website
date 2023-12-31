import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as ZOD from '~/lib/zodValidators'
export const sizeRouter = createTRPCRouter({
  create: protectedProcedure.input(ZOD.size.create).mutation(async ({ ctx, input }) => {
    const size = await ctx.db.size.create({
      data: input
    })
    return !!size
  }),
  read: protectedProcedure.input(z.object({
    categoryId: z.string().min(1)
  })).query(async ({ ctx, input }) => {
    const sizes = await ctx.db.size.findMany({
      where: {
        categoryId: input.categoryId
      },
      select: {
        name: true,
        value: true,
      }
    })
    return sizes
  }),
  edit: protectedProcedure.input(ZOD.size.edit).mutation(async ({ ctx, input }) => {
    await ctx.db.size.update({
      where: {
        id: input.sizeId
      },
      data: {
        name: input.name,
        value: input.value
      }
    })

  }),
  delete: protectedProcedure.input(z.object({
    sizeId: z.string().min(1)
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.size.delete({
      where: {
        id: input.sizeId
      },
    })

  })
})