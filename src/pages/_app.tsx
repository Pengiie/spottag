import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PageLayout from '../components/PageLayout'
import {
	trpc,
	trpcClient,
	trpcClientConfig,
	trpcQueryClientConfig,
} from '../utils/trpc'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppRouter } from '../server/router'
import { withTRPC } from '@trpc/next'

function SpotTag({ Component, pageProps }: AppProps) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </QueryClientProvider>
		</trpc.Provider>
  )
}

export const queryClient = new QueryClient(trpcQueryClientConfig)

export default withTRPC<AppRouter>({
	ssr: false,
	config: () => trpcClientConfig,
})(SpotTag)