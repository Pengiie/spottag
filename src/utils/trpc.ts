import { createReactQueryHooks, CreateTRPCClientOptions } from "@trpc/react";
import { QueryClientConfig } from "react-query";
import type { AppRouter } from "../server/router";
import superjson from 'superjson'
import { WithTRPCConfig } from "@trpc/next";

const getBaseUrl = () => {
	if (typeof window !== 'undefined' || process.browser) return ''
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
	if (process.env.RAILWAY_STATIC_URL)
		return `https://${process.env.RAILWAY_STATIC_URL}` // live dev SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export const trpcQueryClientConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
		mutations: { retry: false },
	},
}

export const trpcClientConfig: CreateTRPCClientOptions<AppRouter> &
	WithTRPCConfig<AppRouter> = {
	url: `${getBaseUrl()}/api/trpc`,
	transformer: superjson,
	queryClientConfig: trpcQueryClientConfig,
	fetch(input, init?) {
		return fetch(input, {
			...init,
			credentials: 'same-origin',
		})
	},
}

export const trpc = createReactQueryHooks<AppRouter>();
export const trpcClient = trpc.createClient(trpcClientConfig);