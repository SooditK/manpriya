import superjson from "superjson";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { createContext } from "./context";
import { z } from "zod";

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create({
    transformer: superjson,
  });

export const publicProcedure = t.procedure;

export const userSchema = z.object({
  sub: z.string(),
  name: z.string(),
  picture: z.string(),
  email: z.string().email(),
  iat: z.number(),
  exp: z.number(),
});

export type User = z.infer<typeof userSchema>;

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
