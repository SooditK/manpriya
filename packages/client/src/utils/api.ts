import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { type AppRouter } from "server";

export const getBaseUrl = () => {
  if (process.env.BACKEND_URL) {
    return `${process.env.BACKEND_URL}`; // SSR should use vercel url
  }
  return `http://localhost:${process.env.PORT ?? 3001}`; // dev SSR should use localhost
};

export const api = createTRPCReact<AppRouter>({});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
