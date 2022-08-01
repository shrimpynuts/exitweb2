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

export default function JoinCommunity() {
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
            <Button bgColor="hidden lg:block bg-gray-700" classOverrides="text-sm">
              <div className="flex items-center space-x-2">
                <Plus /> &nbsp; Create a new community
              </div>
            </Button>
          </Link>
        </Navbar>
        <Toaster position="top-center" reverseOrder={false} />

        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <section className="mt-16 sm:w-4/5 lg:w-4/5 mx-auto">
            <CommunityList
              popularCommunities={communities}
              growingCommunities={communities?.slice().sort((a, b) => (b.name > a.name ? 1 : -1))}
              newestCommunities={communities
                ?.slice()
                .sort((a, b) => (new Date(b.created_at) > new Date(a.created_at) ? 1 : -1))}
            />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
