import { createRouter } from "./context";
import superjson from "superjson";
import { authRouter } from './auth/index';
import { timingsLog } from "./middleware";

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(timingsLog)
  .merge("auth.", authRouter);

export type AppRouter = typeof appRouter;