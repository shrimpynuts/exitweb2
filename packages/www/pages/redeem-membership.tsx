import { Toaster } from 'react-hot-toast'
import Head from 'next/head'

import Navbar from '../components/layout/navbar'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/dist/client/router'
import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import { ICommunity } from '../types'
import GenerateProof from '../components/submissions/generateProof'

export default function RedeemMembership() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const router = useRouter()
  const communities: ICommunity[] = data?.community

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>Exit Web2</title>
            <meta name="description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />

          <section>
            {communities && communities[0] && (
              <div className="flex flex-col space-y-4">
                <GenerateProof community={communities[0]} />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
