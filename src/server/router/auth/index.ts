import { createRouter } from "../context";
import * as auth from "./auth"

export const authRouter = createRouter()
.query("spotify", auth.spotify);