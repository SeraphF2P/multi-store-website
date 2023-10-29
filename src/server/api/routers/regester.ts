import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";

export const regesterRouter = createTRPCRouter({
 signUp:publicProcedure.input(z.object({
  name:z.string().min(1)
 })).mutation(async ({ctx,input:{name}})=>{
  const user = await ctx.db.user.findUnique({where:{
    email:name
  }})
//   if(user){
// const currentDate = new Date();
// const expires = new Date(
//   currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
// );
              
//     await ctx.db.session.create({
//       data:{
//         expires,
//         sessionToken:crypto.randomUUID(),
//         userId:user.id
//       }
//     })
//   }
 })
});
