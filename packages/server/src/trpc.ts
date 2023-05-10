import superjson from "superjson";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { createContext } from "./context";

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create({
    transformer: superjson,
  });

export const publicProcedure = t.procedure;

const isUserAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to do this",
    });
  }
  return next({
    ctx,
  });
});

export const protectedProcedure = t.procedure.use(isUserAuthenticated);
