import { createRouter } from "../context";
import * as auth from "./auth"

export const authRouter = createRouter()
    .mutation("signin", auth.signin)
    .mutation("callback", auth.callback);