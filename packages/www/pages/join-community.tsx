import Head from 'next/head'
import { useState } from 'react'
import classNames from 'classnames'
import { Toaster } from 'react-hot-toast'

import CreateSubmission from '../components/submissions/createSubmission'
import CommunityCard from '../components/community/communityCard'
import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import Navbar from '../components/layout/navbar'
import { useQuery } from '@apollo/client'
import { ICommunity } from '../types'

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
              {communities && (
                <div className="grid mx-4 space-y-4 md:space-y-0 grid-cols-1 md:grid-cols-3 md:space-x-4">
                  {communities.map((community, i) => (
                    <div
                      className={classNames('h-full duration-100 ease-out cursor-pointer transform hover:scale-105', {
                        ' bg-blue-50': community == selectedCommunity,
                      })}
                      onClick={() =>
                        community == selectedCommunity
                          ? setSelectedCommunity(undefined)
                          : setSelectedCommunity(community)
                      }
                      key={i}
                    >
                      <CommunityCard community={community} />
                    </div>
                  ))}
                </div>
              )}
              {selectedCommunity && (
                <div className="mt-8 pt-8 h-full border-t-2">
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
