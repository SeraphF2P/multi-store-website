import { TRPCError } from "@trpc/server";
import fs from 'fs';
import path from 'path';
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";
import { produce } from 'immer'
import { product } from "../../../lib/zodValidators";
export const productRouter = createTRPCRouter({
  create: protectedProcedure.input(
    z.strictObject({
      name: z.string().min(1, "name must be at least 3 charcters").max(30, "name can't exceed 30 charcters"),
      price: z.number().gt(0, "price cannot be 0").lte(9999, "price cannot be greater than 9999"),
      categoryId: z.string().min(1),
      colorId: z.string().min(1, "color is required"),
      storeId: z.string().min(1),
      sizeId: z.string().min(1, "size is required"),
      groupId: z.number().int().optional(),
      isFeatured: z.boolean().optional(),
      imageName: z.string().min(1),
    })
  ).mutation(async ({ ctx, input }) => {
    const product = await ctx.db.product.create({
      data: {
        name: input.name,
        price: input.price,
        isFeatured: input.isFeatured,
        ...(input.groupId ? {
          groupId: input.groupId
        } : []),
        store: {
          connect: {
            id: input.storeId
          }
        },
        category: {
          connect: {
            id: input.categoryId
          }
        },
        color: {
          connect: {
            id: input.colorId
          }
        },
        size: {
          connect: {
            id: input.sizeId
          }
        },
        image: {
          create: {
            imageName: input.imageName,
          }
        }
      },
    })

    console.log(product)
  }),
  read: publicProcedure.input(z.object({
    storeId: z.string().uuid(),
    categoryId: z.string().uuid()
  })).query(async ({ ctx, input: { categoryId, storeId } }) => {
    const groups = await ctx.db.product.groupBy({
      by: "groupId",
      take: 10,
      orderBy: {
        groupId: "desc",
      },
      _count: {
        groupId: true
      }
    })
    const groupIds = groups.map(product => product.groupId)

    if (groupIds && groupIds.length == 0) return null;
    const products = await ctx.db.product.findMany({
      where: {
        AND: [{
          categoryId,
          groupId: {
            in: groupIds
          }
        }]

      },
      orderBy: {
        groupId: "desc"
      },
      include: {
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
    })
    if (!products || !groups) return [];
    return groups.map(group => {
      return {
        id: group.groupId,
        products: products.splice(0, group._count.groupId)
      }
    })

  }),
  edit: protectedProcedure.input(z.object({
    name: z.string().min(1, "name must be at least 3 charcters").max(30, "name can't exceed 30 charcters"),
    price: z.number().gt(0, "price cannot be 0").lte(9999, "price cannot be greater than 9999"),
    colorId: z.string().min(1, "color is required"),
    sizeId: z.string().min(1, "size is required"),
    productId: z.string().uuid(),
    storeId: z.string().uuid(),
    imageName: z.string().min(1).optional(),
    isFeatured: z.boolean().optional(),
  })).mutation(async ({ ctx, input }) => {
    console.log(input)
    const product = await ctx.db.product.update({
      where: {
        id: input.productId,
      },
      data: {
        name: input.name,
        price: input.price,
        isFeatured: input.isFeatured,
        color: {
          connect: {
            id: input.colorId
          }
        },
        size: {
          connect: {
            id: input.sizeId
          }
        },
        ...(input.imageName ? {
          image: {
            create: {
              imageName: input.imageName,
            }
          }
        } : [])
      },
    })

    console.log(product)
  }),
  delete: protectedProcedure.input(z.object({
    productId: z.string().min(1),
  })).mutation(async ({ ctx, input: { productId } }) => {

    const product = await ctx.db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        storeId: true,

        image: {
          select: {
            imageName: true
          }

        }
      }
    })
    if (!product || !product.image) return new TRPCError({ code: "NOT_FOUND", message: "product not found", cause: 404 })
    const oldImagePath = path.join(`public/stores/${product.storeId}/`, product.image?.imageName)
    if (fs.existsSync(oldImagePath)) {
      fs.rmSync(oldImagePath)
    }

    await ctx.db.product.delete({
      where: {
        id: productId,
      },
    })

  })
});
