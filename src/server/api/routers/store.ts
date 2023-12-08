import { TRPCError } from "@trpc/server";
import fs from 'fs';
import path from 'path';
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
    const numOfStoreUserHave = await ctx.db.store.count()
    if (numOfStoreUserHave >= 3) throw new TRPCError({ code: "BAD_REQUEST", message: "number of store user have exceeded maximum number" })

    await ctx.db.store.create({
      data: {
        name,
        userId: ctx.userId,
      },
    }).catch(() => {

      throw new Error("store already exists")
    })

  }),
  edit: protectedProcedure.input(z.object({
    storeId: z.string().min(1),
    name: z.string().min(3),
  })).mutation(async ({ ctx, input: { name, storeId } }) => {
    return await ctx.db.store.update({
      where: {
        id: storeId
      },
      data: {
        name,
      },
    })

  }),
  delete: protectedProcedure.input(z.object({
    storeId: z.string().min(1),
  })).mutation(async ({ ctx, input: { storeId } }) => {
    const store = await ctx.db.store.findUnique({
      where: {
        id: storeId
      },
      select: {
        billboards: {
          select: {
            imageName: true
          }
        },
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
        }
      }
    })
    const everyImageName = [
      ...(store?.billboards.map(billboard => billboard.imageName) || []),
      ...(store?.products.flatMap(product => product.themes.flatMap(theme => theme.image?.imageName || [])) || [])
    ]
    everyImageName.map(image => {
      const imagePath = path.join(`public/stores/${storeId}`, image)
      if (fs.existsSync(imagePath)) {
        fs.rmSync(imagePath)
      }
    })
    return await ctx.db.store.delete({
      where: {
        id: storeId
      },
    })

  }),
  read: publicProcedure.input(z.object({
    storeId: z.string().min(3)
  })).query(async ({ ctx, input: { storeId } }) => {
    const storeData = await ctx.db.store.findUnique({
      where: {
        id: storeId,
      },
      include: {
        categories: {
          include: {
            billboard: true
          }
        },
        products: true,
        orders: true,
        _count: {
          select: {
            products: true,
            orders: true,
          }
        }
      }
    })

    if (!storeData) return null;
    const { _count, ...rest } = storeData;
    return {
      productsCount: _count.products,
      orderCount: _count.orders,
      ...rest
    }
  }),
  getSellerStores: protectedProcedure.query(async ({ ctx }) => {
    const stores = await ctx.db.store.findMany({
      where: {
        userId: ctx.userId
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true,
            orders: true,
            categories: true,
          }
        },
      }
    })

    return stores.map(store => {
      const { _count, ...rest } = store
      return {
        products: {
          count: _count.products,
        },
        orders: {
          count: _count.orders
        },
        categories: {
          count: _count.categories
        },
        ...rest
      }
    })
  })
});
