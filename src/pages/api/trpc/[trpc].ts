import { TRPCError } from '@trpc/server'
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { HTTPError, RequestError } from 'got'
import { log } from '../../../server/log'
import { appRouter } from '../../../server/router'
import { createContext } from '../../../server/router/context'
import { trpc } from '../../../utils/trpc'

export default createNextApiHandler({
	router: appRouter,
	createContext,
	onError({ error, req }) {
		if(error.cause instanceof RequestError) {
			if(error.cause instanceof HTTPError) {
				log.debug(error.cause.request.requestUrl);
				log.debug(req);
			}
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'An error occured while communicating with the Spotify API',
			});
		}
	}
})