import { z } from "zod";
import fs from 'fs'
import path from 'path';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure

} from "~/server/api/trpc";

export const billboardRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    storeId: z.string().min(3),
    categoryId: z.string().min(3),
    label: z.string().min(3),
    imageName: z.string().min(1)
  })).mutation(async ({ ctx, input: { storeId, categoryId, label, imageName } }) => {
    if (!imageName) return;
    await ctx.db.billboard.create({
      data: {
        storeId,
        categoryId,
        label,
        imageName,
      }
    })
  }),
  edit: protectedProcedure.input(z.object({
    billboardId: z.string().min(3),
    label: z.string().min(3),
    imageName: z.string().min(1),
  })).mutation(async ({ ctx, input: { billboardId, label, imageName } }) => {
    const billboard = await ctx.db.billboard.findUnique({
      where: {
        id: billboardId
      },
      select: {
        storeId: true,
        imageName: true
      }
    })
    if (billboard?.imageName) {
      const oldImagePath = path.join(`public/${billboard.storeId}/`, billboard?.imageName)
      if (fs.existsSync(oldImagePath)) {
        fs.rmSync(oldImagePath)
      }
    }
    await ctx.db.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        imageName,
        label,
      },
    })
  }),
  delete: protectedProcedure.input(z.object({
    billboardId: z.string().min(3),
  })).mutation(async ({ ctx, input: { billboardId } }) => {
    const billboard = await ctx.db.billboard.findUnique({
      where: {
        id: billboardId,
      },
      select: {
        imageName: true
      }
    })

    if (!billboard) throw new Error("Billboard not found", { cause: 404 })

    const oldImagePath = path.join("public/", billboard.imageName)
    if (fs.existsSync(oldImagePath)) {
      fs.rmSync(oldImagePath)
    }

    await ctx.db.billboard.delete({
      where: {
        id: billboardId
      }
    })
  }),

});
