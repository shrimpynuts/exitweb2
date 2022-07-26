import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import Navbar from '../components/layout/navbar'
import { useQuery } from '@apollo/client'
import { ICommunity } from '../types'
import CommunityList from '../components/community/communityList'
import Button from '../components/util/button'
import Link from 'next/link'
import Footer from '../components/layout/footer'

export default function HomePage() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const communities: ICommunity[] = data?.community

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>Exit Web2</title>
            <meta name="description" content="" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar>
            <Link href="/create-community">
              <Button bgColor="bg-gray-800">Create a new community</Button>
            </Link>
          </Navbar>
          <Toaster position="top-center" reverseOrder={false} />

          <section>
            <div className="mt-8 sm:w-4/5 lg:w-4/5 mx-auto">
              <CommunityList
                popularCommunities={communities}
                growingCommunities={communities}
                newestCommunities={communities}
              />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
