import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      where: {
        userId: ctx.session.user.id,
        finished: false
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ desc: z.string().min(1), dueDate: z.date() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          desc: input.desc,
          userId: ctx.session.user.id,
          dueDate: input.dueDate
        },
      });
    }),
  setFinished: protectedProcedure
    .input(z.object({ id: z.number().min(0).int() }))  
    .mutation( async ({ ctx, input }) => { 
      return ctx.db.task.update({
        where: { id: input.id },
        data: { finished: true }
      });
    }),
});