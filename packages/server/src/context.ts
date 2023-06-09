import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "./db";
import { parseCookieString } from "./utils/parseCookies";
import jwt from "jsonwebtoken";
import { userSchema, type User } from "./trpc";
import { TRPCError } from "@trpc/server";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
  const session = parseCookieString(req.headers.cookie as string, cookieName);
  const user = jwt.verify(
    session as string,
    process.env.NEXTAUTH_SECRET as string
  );
  if (!userSchema.safeParse(user).success) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to do this",
    });
  }
  return {
    session: user as User,
    req,
    res,
    prisma,
  };
}
