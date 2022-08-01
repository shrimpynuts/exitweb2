import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { GetStaticProps, GetStaticPropsContext } from 'next'

import { SingleCommunityListHorizontal } from '../components/community/communityList'
import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import client from '../lib/client/apollo-client'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import Button from '../components/util/button'
import { ICommunity } from '../types'
import Link from 'next/link'

interface IProps {
  communities: ICommunity[]
}

export default function HomePage({ communities }: IProps) {
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
        <section className="bg-blue-100 h-full">
          <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
            <div className="flex py-24 px-8 md:max-w-6xl mx-auto">
              {/* Left side */}
              <div className="flex flex-col">
                <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">Connect with your tribe.</h1>
                <h1 className="text-2xl font-semibold my-4 text-blue-900">A new pseudonymous social experience.</h1>
                <div className="flex space-x-2 my-2">
                  <Link href="/join-community">
                    <Button classOverrides="py-1 text-lg text-blue-50 rounded-lg" bgColor="bg-black">
                      Join a community
                    </Button>
                  </Link>
                  <Link href="/create-community">
                    <Button classOverrides="py-1 text-lg text-blue-50 rounded-lg">Start a community</Button>
                  </Link>
                </div>
              </div>

              {/* Right side */}
              <div></div>
            </div>
          </div>
        </section>

        <section className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <SingleCommunityListHorizontal communities={communities} />
        </section>
      </div>
      <Footer />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (_ctx: GetStaticPropsContext) => {
  const { data } = await client.query({ query: GET_ALL_COMMUNITIES })
  const communities: ICommunity[] = data?.community.slice(0, 6)
  return {
    props: { communities },
  }
}
