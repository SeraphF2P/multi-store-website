import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";
import fs from 'fs'
import path from 'path'
import { TRPCError } from "@trpc/server";
export const productRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    name: z.string().min(1),
    imageName: z.string().min(1),
    price: z.string().refine((value) => {
      // Check if the value is a decimal number
      return Number.isInteger(value) === false;
    }, {
      message: "Value must be a decimal number",
    }),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    storeId: z.string().min(1),
    sizeId: z.string().min(1),
  })).mutation(async ({ ctx, input: { name, categoryId, colorId, imageName, price,
    sizeId, storeId } }) => {
    console.log(sizeId, colorId, imageName)

    return await ctx.db.product.create({
      data: {
        name,
        categoryId,
        storeId,
        themes: {
          create: {
            price,
            colorId,
            sizeId,
            image: {
              create: {
                imageName,
              }
            }
          }
        },

      },
    })

  }),
  read: publicProcedure.input(z.object({
    storeId: z.string().min(1),
    categoryId: z.string().min(1)

  })).query(async ({ ctx, input: { categoryId, storeId } }) => {
    return await ctx.db.product.findMany({
      where: {
        storeId,
        categoryId,
      },
      include: {
        themes: {
          select: {
            image: {
              select: {
                id: true,
                imageName: true,
              }
            },
            color: {
              select: {
                id: true,
                name: true,
                value: true
              }
            },
            size: {
              select: {
                id: true,
                name: true,
                value: true
              }
            },
          }
        }
      }

    })
  }),
  edit: protectedProcedure.input(z.object({
    productId: z.string().min(1),
    themeId: z.string().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    storeId: z.string().min(1),
    sizeId: z.string().min(1),
    name: z.string().min(1),
    price: z.number().refine((value) => {
      // Check if the value is a decimal number
      return Number.isInteger(value) === false;
    }, {
      message: "Value must be a decimal number",
    }),
    isArchived: z.boolean(),
    isFeatured: z.boolean(),
  })).mutation(async ({ ctx, input: { themeId, colorId, name, price, sizeId, productId, isArchived, isFeatured } }) => {

    const product = await ctx.db.product.findUnique({
      where: {
        id: productId,
        themes: {
          every: {
            id: themeId
          }
        }
      }
    })
    await ctx.db.product.update({
      where: {
        id: productId,
        AND: {
          themes: {
            every: {
              id: themeId
            }
          }
        }
      },
      data: {
        name,
        themes: {
          update: {
            data: {
              price
            },
            where: {
              id: themeId
            }
          }
        },
        isArchived,
        isFeatured,
      },
    })
  }),
  delete: protectedProcedure.input(z.object({
    productId: z.string().min(1),
    themeId: z.string().min(1),

  })).mutation(async ({ ctx, input: { productId, themeId } }) => {

    const product = await ctx.db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        storeId: true,
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
    })
    if (!product) return new TRPCError({ code: "NOT_FOUND", message: "product not found", cause: 404 })

    const productImagesNames = product?.themes.flatMap(theme => theme.image?.imageName || [])
    productImagesNames.map(imageName => {
      const oldImagePath = path.join(`public/stores/${product.storeId}/`, imageName)
      if (fs.existsSync(oldImagePath)) {
        fs.rmSync(oldImagePath)
      }
    })
    await ctx.db.product.delete({
      where: {
        id: productId,
      },
    })

  })
});
