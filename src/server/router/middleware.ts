import { ProcedureType, TRPCError } from '@trpc/server'
import {
	MiddlewareFunction,
	MiddlewareResult,
} from '@trpc/server/dist/declarations/src/internals/middlewares'
import { log } from '../log'
import { Context } from './context'

export type Middleware<TInputContext, TResult, TMeta = {}> = (opts: {
	ctx: TInputContext
	type: ProcedureType
	path: string
	rawInput: unknown
	meta?: TMeta
	next: {
		(): Promise<MiddlewareResult<TInputContext>>
		<T>(opts: { ctx: T }): Promise<MiddlewareResult<T>>
	}
}) => Promise<MiddlewareResult<TResult>>

export interface AuthMeta {
	requiresStripe?: boolean
}

// export const userAuthenticated: Middleware<Context, AuthContext, AuthMeta> = ({
// 	ctx,
// 	next,
// 	meta,
// }) => {
// 	if (!ctx.session) {
// 		throw new TRPCError({
// 			code: 'UNAUTHORIZED',
// 			message: 'User is not signed in',
// 		})
// 	}
// 	if (!ctx.session.user.stripeCustomerId) {
// 		throw new TRPCError({
// 			code: 'UNAUTHORIZED',
// 			message: 'User is not connected with stripe, try signing out and back in',
// 		})
// 	}
// 	if (
// 		meta?.requiresStripe &&
// 		ctx.session.user.progression !== AccountProgress.StripeVerified
// 	) {
// 		throw new TRPCError({
// 			code: 'UNAUTHORIZED',
// 			message: 'User does not have a stripe card present',
// 		})
// 	}
// 	return next({
// 		ctx: {
// 			...ctx,
// 			req: ctx.req!,
// 			res: ctx.res!,
// 			user: ctx.session.user,
// 		},
// 	})
// }

export const timingsLog: Middleware<Context, Context> = async ({
	ctx,
	path,
	type,
	next,
}) => {
	const start = Date.now()
	const result = await next()
	const durationMs = Date.now() - start
	result.ok
		? log.info('OK request timing:', { path, type, durationMs })
		: log.info('Non-OK request timing', { path, type, durationMs })

	return result
}