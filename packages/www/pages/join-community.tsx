import Head from 'next/head'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'

import CreateSubmission from '../components/submissions/createSubmission'
import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import Navbar from '../components/layout/navbar'
import { useQuery } from '@apollo/client'
import { ICommunity } from '../types'
import CommunityPicker from '../components/community/communityPicker'

export default function JoinACommunity() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const communities: ICommunity[] = data?.community

  const [selectedCommunity, setSelectedCommunity] = useState<ICommunity>()

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
            <div className="mt-8 sm:w-4/5 lg:w-3/4 mx-auto">
              <CommunityPicker
                communities={communities}
                selectedCommunity={selectedCommunity}
                setSelectedCommunity={setSelectedCommunity}
              />
              {selectedCommunity && (
                <div className="mt-2 pt-8 h-full ">
                  <CreateSubmission onFinished={() => setSelectedCommunity(undefined)} community={selectedCommunity} />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
