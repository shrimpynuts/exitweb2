import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import CommunityList from '../components/community/communityList'
import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import Button from '../components/util/button'
import { useQuery } from '@apollo/client'
import { ICommunity } from '../types'
import Link from 'next/link'
import Plus from '../components/svg/plus'

export default function HomePage() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const communities: ICommunity[] = data?.community

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Head>
        <title>Exit Web2</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar>
          <Link href="/create-community">
            <Button bgColor="bg-gray-800" classOverrides="text-sm">
              <div className="flex items-center space-x-2">
                <Plus /> &nbsp; Create a new community
              </div>
            </Button>
          </Link>
        </Navbar>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
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
