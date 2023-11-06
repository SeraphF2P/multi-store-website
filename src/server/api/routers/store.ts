import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure

} from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    name: z.string().min(3),
  })).mutation(async ({ ctx, input: { name } }) => {
    return await ctx.db.store.create({
      data: {
        name,
        userId: ctx.userId,
      },
    })

  }),
  read: publicProcedure.input(z.object({
    storeId: z.string().min(3)
  })).query(async ({ ctx, input: { storeId } }) => {
    return await ctx.db.store.findUnique({
      where: {
        id: storeId,
      },
    })
  }),
  getSellerStores: protectedProcedure.query(async ({ ctx }) => {
    const stores = await ctx.db.store.findMany({
      where: {
        userId: ctx.userId
      }

    })
    return stores
  })
});
