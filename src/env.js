// @ts-check
const { z } = require("zod");

const envSchema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  SPOTIFY_REDIRECT_URI: z.string(),
});

const env = envSchema.safeParse(process.env);

if(!env.success) {
  console.error("Environment variables are not valid:\n" + env.error.format());
  process.exit(-1);
}

module.exports.env = env.data;