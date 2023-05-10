import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "./db";
import { parseCookieString } from "./utils/parseCookies";
import jwt from "jsonwebtoken";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const session = parseCookieString(
    req.headers.cookie as string,
    "next-auth.session-token"
  );
  console.log("session", session);
  const user = jwt.verify(
    session as string,
    process.env.NEXTAUTH_SECRET as string
  );
  console.log("user", user);
  return {
    session: user,
    req,
    res,
    prisma,
  };
}
