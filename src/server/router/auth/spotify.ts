import got from "got";
import { Context } from "../context";
import { createProcedure } from "../procedure";
import * as queryString from "query-string"
import { env } from "../../../env"
import { z } from "zod";

export const spotify = createProcedure({
  output: z.object({ url: z.string() }),
  async resolve() {
    const scope = "user-read-private user-read-email";
    const redirectUri = `https://accounts.spotify.com/authorize?` + queryString.stringify({
      response_type: "code",
      client_id: env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri:env.SPOTIFY_REDIRECT_URI,
    });
    return { url: redirectUri };
  }
})