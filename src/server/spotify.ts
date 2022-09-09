import { TRPCError } from "@trpc/server";
import got, { HTTPError, RequestError } from "got";
import * as queryString from "query-string"
import { env } from "../env";

export namespace spotify {
    const apiUrl = "https://api.spotify.com/v1";

    const scope = "user-read-private user-read-email";

    export const oauthUrl = `https://accounts.spotify.com/authorize?` + queryString.stringify({
        response_type: "code",
        client_id: env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: env.SPOTIFY_REDIRECT_URI,
    });

    export interface GetAccessTokenResponse {
        access_token: string
        token_type: string
        scope: string
        expires_in: number
        refresh_token: string
    }

    export const getAccessToken = async (authorizationCode: string) => 
        await got.post(`https://accounts.spotify.com/api/token`, {
            searchParams: {
                grant_type: "authorization_code",
                code: authorizationCode,
                redirect_uri: env.SPOTIFY_REDIRECT_URI,
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).json<GetAccessTokenResponse>()

    interface GetUserResponse {
        id: string
        display_name: string
        email: string
    }

    export const getUser = async (accessToken: string): Promise<GetUserResponse> => get("me", accessToken);

    const get = async <TOutput>(path: string, accessToken: string) => 
        await got.get(`${apiUrl}/${path}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }).json<TOutput>();

    const post = async <TInput extends {}, TOutput>(path: string, input: TInput, accessToken: string) =>
        await got.post(`${apiUrl}/${path}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            json: input,
        }).json<TOutput>();
}