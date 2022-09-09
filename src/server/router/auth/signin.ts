import got from "got";
import { Context } from "../context";
import { createProcedure } from "../procedure";
import * as queryString from "query-string"
import { env } from "../../../env"
import { z } from "zod";
import { spotify } from "../../spotify";

export const signin = createProcedure({
  output: z.object({ url: z.string() }),
  async resolve() {
    return { url: spotify.oauthUrl };
  }
})