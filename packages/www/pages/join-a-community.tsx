import { Toaster } from 'react-hot-toast'
import Head from 'next/head'

import Navbar from '../components/layout/navbar'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/dist/client/router'
import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import { ICommunity } from '../types'
import CreateSubmission from '../components/submissions/createSubmission'
import CommunityCard from '../components/community/communityCard'

export default function JoinACommunity() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const router = useRouter()
  const communities: ICommunity[] = data?.community

  console.log({ communities, data })

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
                <div className="grid grid-cols-3 space-x-4">
                  {communities.map((community, i) => (
                    <div className="h-full duration-100 ease-out cursor-pointer transform hover:scale-105" key={i}>
                      <CommunityCard community={community} />
                    </div>
                  ))}
                  {/* <CreateSubmission community={communities[0]} /> */}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
