import Head from 'next/head'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'

import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import Navbar from '../components/layout/navbar'
import { useQuery } from '@apollo/client'
import { ICommunity } from '../types'
import CommunityPicker from '../components/community/communityPicker'
import { useContractRead } from 'wagmi'
import { AIRDROP_CONTRACT_DATA } from '../lib/config'
import CommunityChat from '../components/chat/communityChat'

export default function JoinACommunity() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const communities: ICommunity[] = data?.community

  const [selectedCommunity, setSelectedCommunity] = useState<ICommunity>()

  const { data: contractData } = useContractRead({
    ...AIRDROP_CONTRACT_DATA,
    functionName: 'communityToken',
  })

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>Exit Web2</title>
            <meta name="description" content="" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />

          <section>
            <div className="mt-8 sm:w-4/5 lg:w-3/4 mx-auto">
              <CommunityPicker
                communities={communities}
                selectedCommunity={selectedCommunity}
                setSelectedCommunity={setSelectedCommunity}
              />
              {selectedCommunity && contractData && (
                <div className="mt-2 pt-8 h-full ">
                  <CommunityChat community={selectedCommunity} communityTokenAddress={String(contractData)} />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
