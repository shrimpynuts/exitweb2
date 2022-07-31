import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import { SingleCommunityListHorizontal } from '../components/community/communityList'
import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import Button from '../components/util/button'
import { useQuery } from '@apollo/client'
import { ICommunity } from '../types'
import Link from 'next/link'
import FAQ from '../components/marketing/faq'

export default function HomePage() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const communities: ICommunity[] = data?.community.slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Head>
        <title>Exit Web2</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />

        {/* Hero section */}
        <section className="bg-yellow-400 h-full">
          <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
            <div className="flex py-24 px-8 md:max-w-6xl mx-auto">
              {/* Left side */}
              <div className="flex flex-col">
                <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Connect with your tribe.</h1>
                <h1 className="text-2xl font-semibold my-4 text-gray-500">A new pseudonymous social experience.</h1>
                <div className="flex space-x-2 my-2">
                  <Link href="/join-community">
                    <Button classOverrides="py-1 text-lg text-gray-200 rounded-lg" bgColor="bg-black">
                      Join a community
                    </Button>
                  </Link>
                  <Link href="/create-community">
                    <Button classOverrides="py-1 text-lg text-gray-200 rounded-lg">Start a community</Button>
                  </Link>
                </div>
              </div>

              {/* Right side */}
              <div></div>
            </div>
          </div>
        </section>

        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <section className="py-8 px-8 md:max-w-6xl mx-auto flex flex-col overflow-hidden">
            <h3 className="self-start text-2xl mb-2 font-semibold">Trending communities</h3>
            <SingleCommunityListHorizontal communities={communities} />
            <Link href="/join-community">
              <a className="self-end text-sm mt-2 font-semibold text-gray-600">Explore all communities </a>
            </Link>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
