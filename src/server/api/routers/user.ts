import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure

} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateToSeller: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.user.update({
      where: {
        id: ctx.userId
      },
      data: {
        role: "seller"
      },
    })
  }),

});
