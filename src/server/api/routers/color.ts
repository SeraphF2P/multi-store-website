import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const colorRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    name: z.string().min(1),
    value: z.string().min(1),
    categoryId: z.string().min(1),
  })).mutation(async ({ ctx, input }) => {
    const color = await ctx.db.color.create({
      data: input
    })
    return !!color
  }),
  read: protectedProcedure.input(z.object({
    categoryId: z.string().min(1)
  })).query(async ({ ctx, input }) => {
    const colors = await ctx.db.color.findMany({
      where: {
        categoryId: input.categoryId
      },
      select: {
        name: true,
        value: true,
      }
    })
    return colors
  }),
  edit: protectedProcedure.input(z.object({
    name: z.string().min(1),
    value: z.string().min(1),
    colorId: z.string().min(1)
  })).mutation(async ({ ctx, input }) => {
    const updatedColor = await ctx.db.color.update({
      where: {
        id: input.colorId
      },
      data: {
        name: input.name,
        value: input.value
      }
    })

  }),
  delete: protectedProcedure.input(z.object({
    colorId: z.string().min(1)
  })).mutation(async ({ ctx, input }) => {
    const updatedColor = await ctx.db.color.delete({
      where: {
        id: input.colorId
      },
    })

  })
})