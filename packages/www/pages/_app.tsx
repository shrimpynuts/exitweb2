import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'

import client from '../frontend/apollo-client'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API }), publicProvider()],
)
const { connectors } = getDefaultWallets({
  appName: 'Exit Web2',
  chains,
})
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={lightTheme({
            borderRadius: 'small',
          })}
        >
          <ApolloProvider client={client}>
            <div className="min-h-screen bg-white dark:bg-blackPearl dark:text-white">
              <Component {...pageProps} />
            </div>
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}
export default App
