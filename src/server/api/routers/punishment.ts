import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";

export const punishmentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.punishment.findFirst({
      where: {
        userId: ctx.session.user.id
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      recipient: z.string().min(1).email("This is not a valid email.")
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.punishment.create({
        data: {
          userName: input.name,
          userId: ctx.session.user.id,
          recipient: input.recipient
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.number().min(0).int(),
      name: z.string().min(1),
      recipient: z.string().min(1).email("This is not a valid email.")
    }))
    .mutation( async ({ ctx, input }) => { 
      return ctx.db.punishment.update({
        where: { id: input.id },
        data: {
          userName: input.name,
          recipient: input.recipient
        },
      });
    }),
});