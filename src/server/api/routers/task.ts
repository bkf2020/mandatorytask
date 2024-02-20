import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      where: { userId: ctx.session.user.id },
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
});