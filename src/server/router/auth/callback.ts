import { createNextApiHandler } from "@trpc/server/adapters/next";
import { z } from "zod";
import { sessionSchema } from "../../../../prisma/zod";
import { createSession, SESSION_TIME, signIn, signUp, userExists } from "../../account";
import { spotify } from "../../spotify";
import { createProcedure } from "../procedure";

export const callback = createProcedure({
    input: z.object({
        authorzationToken: z.string(),
    }),

    async resolve({ ctx: { prisma, res }, input: { authorzationToken } }) {
        const response = await spotify.getAccessToken(authorzationToken);
        const user = await userExists(prisma, response) ? await signIn(prisma, response) : await signUp(prisma, response);

        res.setHeader("Set-Cookie", `sessionToken=${await createSession(prisma, user)}; Max-Age=${SESSION_TIME / 1000};`);
    }
})