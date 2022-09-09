import { PrismaClient, User } from "@prisma/client";
import { spotify } from "./spotify";
import { randomBytes, createCipheriv } from "node:crypto";
import { env } from "../env";

// 1 week
export const SESSION_TIME = 1000 * 60 * 60 * 24 * 7;

export const signUp = async (prisma: PrismaClient, response: spotify.GetAccessTokenResponse): Promise<User> => {
    const { id, display_name: username, email} = await spotify.getUser(response.access_token);
    const { user } = await prisma.account.create({
        data: {
            user: {
                create: {
                    email,
                    username
                }
            },
            spotifyId: id,
            accessToken: response.access_token,
            expiresAt: new Date(Date.now() + response.expires_in * 1000),
            refreshToken: response.refresh_token,
        },
        select: {
            user: true,
        }
    });
    return user;
};

export const signIn = async (prisma: PrismaClient, response: spotify.GetAccessTokenResponse): Promise<User> => {
    const { id } = await spotify.getUser(response.access_token);
    const { user } = await prisma.account.update({
        where: {
            spotifyId: id,
        },
        data: {
            accessToken: response.access_token,
            expiresAt: new Date(Date.now() + response.expires_in * 1000),
            refreshToken: response.refresh_token,
        },
        select: {
            user: true,
        }
    });
    return user;
}

export const userExists = async (prisma: PrismaClient, response: spotify.GetAccessTokenResponse) => {
    const { id } = await spotify.getUser(response.access_token);
    return (await prisma.account.findUnique({
        where: {
            spotifyId: id,
        }
    })) !== null;
}

export const createSession = async (prisma: PrismaClient, user: User): Promise<string> => {
    await prisma.session.deleteMany({
        where: {
            userId: user.id
        }
    });
    const session = await prisma.session.create({
        data: {
            user: {
                connect: {
                    id: user.id,
                }
            },
            sessionToken: "null",
            expiresAt: new Date(Date.now() + SESSION_TIME),
        }
    });
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", env.SESSION_SECRET, iv);
    const sessionToken = Buffer.concat([cipher.update(session.id + user.id + user.email + user.username), cipher.final(), Buffer.from('?'), iv]).toString("base64");
    await prisma.session.update({
        where: {
            id: session.id,
        },
        data: {
            sessionToken,
        }
    });
    return sessionToken;
}

export const getSession = async (prisma: PrismaClient, sessionToken: string): Promise<User> => {
    const session = await prisma.session.findUnique({
        where: {
            sessionToken,
        },
        select: {
            user: true,
        }
    });
    if (!session) {
        throw new Error("Invalid session");
    }
    return session.user;
}