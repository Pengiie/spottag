import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PageLayout from '../components/PageLayout'

function SpotTag({ Component, pageProps }: AppProps) {
  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  )
}

export default SpotTag;
