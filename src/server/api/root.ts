import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { taskRouter } from "~/server/api/routers/task";
import { punishmentRouter } from "~/server/api/routers/punishment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  task: taskRouter,
  punishment: punishmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
