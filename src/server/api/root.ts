import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { storeRouter } from "./routers/store";
import { categoryRouter } from "./routers/category";
import { billboardRouter } from "./routers/billboard";
import { productRouter } from "./routers/product";
import { colorRouter } from "./routers/color";
import { sizeRouter } from "./routers/size";
import { authanticationRouter } from "./routers/authantication";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  authantication: authanticationRouter,
  user: userRouter,
  store: storeRouter,
  category: categoryRouter,
  billboard: billboardRouter,
  product: productRouter,
  color: colorRouter,
  size: sizeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
