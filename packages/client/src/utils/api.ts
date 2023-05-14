import { env } from "@/env.mjs";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { type AppRouter } from "server";

export const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_BACKEND_URL) {
    return `${env.NEXT_PUBLIC_BACKEND_URL}`; // SSR should use vercel url
  }
  return `http://localhost:${process.env.PORT ?? 3001}`; // dev SSR should use localhost
};

export const api = createTRPCReact<AppRouter>({});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
