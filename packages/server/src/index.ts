import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
const PORT = Number(process.env.PORT) || 3001;

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
);

export type AppRouter = typeof appRouter;
