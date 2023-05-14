import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  jwt: {
    encode(params: {
      token?: JWT;
      secret: string | Buffer;
      maxAge?: number;
    }): Promise<string> | string {
      if (!params.token) {
        throw new Error("No token");
      }
      const jwtClaims = {
        sub: params.token.sub,
        name: params.token.name,
        picture: params.token.picture,
        email: params.token.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      };
      return jwt.sign(jwtClaims, params.secret, { algorithm: "HS512" });
    },
    decode(params: {
      token?: string;
      secret: string | Buffer;
    }): Promise<JWT> | JWT {
      const { token, secret } = params;
      const decoded = jwt.verify(token as string, secret);
      return decoded as JWT;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, _req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          throw new Error("Incorrect credentials 1");
        } else {
          const valid = await bcrypt.compare(
            password,
            user?.password as string
          );
          if (!valid) {
            throw new Error("Incorrect credentials 2");
          } else {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
