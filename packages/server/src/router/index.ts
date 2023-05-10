import { publicProcedure, t, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../db";
import { TRPCError } from "@trpc/server";
import bcryptjs from "bcryptjs";

export const appRouter = t.router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(3),
        name: z.string().min(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, name } = input;
      const doesuserexist = await prisma.user.findUnique({
        where: { email },
      });
      if (doesuserexist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bad Request",
        });
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
          },
        });
        return {
          id: user.id,
          email: user.email,
          success: true,
        };
      }
    }),

  checkIfUserExists: protectedProcedure.query(async ({ ctx }) => {
    return {
      message: "You are logged in",
    };
  }),
});
