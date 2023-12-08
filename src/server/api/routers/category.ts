import fs from 'fs';
import path from 'path';
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure
} from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    name: z.string().min(3),
    storeId: z.string().min(3),
    label: z.string().min(3),
    imageName: z.string().min(1)
  })).mutation(async ({ ctx, input: { name, storeId, label, imageName } }) => {
    if (!imageName) return;
    await ctx.db.store.update({
      where: {
        id: storeId,
      },
      data: {
        categories: {
          create: {
            name,
            billboard: {
              create: {
                label,
                imageName,
                storeId
              }
            }
          }
        }
      },
    })
  }),
  edit: protectedProcedure.input(z.object({
    name: z.string().min(3),
    categoryId: z.string().min(3),
  })).mutation(async ({ ctx, input: { name, categoryId } }) => {
    await ctx.db.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
      }
    })
  }),
  delete: protectedProcedure.input(z.object({
    categoryId: z.string().min(3),
  })).mutation(async ({ ctx, input: { categoryId } }) => {
    const category = await ctx.db.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        storeId: true,
        billboard: true,
        products: {
          select: {
            themes: {
              select: {
                image: {
                  select: {
                    imageName: true
                  }
                }
              }
            }
          }
        },
      }
    })
    if (!category) return;
    const everyImageName = [
      ...(category?.billboard.map(billboard => billboard.imageName) || []),
      ...(category?.products.flatMap(product => (product.themes.flatMap(theme => theme.image?.imageName || []))))
    ]

    everyImageName.map(imageName => {
      const oldImagePath = path.join(`public/stores/${category.storeId}/`, imageName)
      if (fs.existsSync(oldImagePath)) {
        fs.rmSync(oldImagePath)
      }
    })

    await ctx.db.category.delete({
      where: {
        id: categoryId
      }
    })
  }),
  read: protectedProcedure.input(z.object({
    categoryId: z.string().min(1)
  })).query(async ({ ctx, input }) => {
    const categorys = await ctx.db.category.findUnique({
      where: {
        id: input.categoryId
      },
      include: {
        colors: true,
        sizes: true,

      }
    })
    return categorys
  })
});
