import { Toaster } from 'react-hot-toast'
import type { NextPage, NextPageContext } from 'next'
import Head from 'next/head'

import AdminPage from '../../components/admin'
import Navbar from '../../components/layout/navbar'
import { GET_COMMUNITY_BY_SLUG } from '../../graphql/queries'
import client from '../../lib/apollo-client'
import { ICommunity } from '../../types'
import CommunityChat from '../../components/chat/communityChat'
import Button from '../../components/util/button'

interface IProps {
  community: ICommunity
}

function CommunityPage({ community }: IProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto">
          <Head>
            <title>{community.name}</title>
            <meta name={community.description} content="" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
        </div>

        <section>
          <img className="w-full -mb-12 h-60 object-cover" src={community.banner_image_url} />

          <div className="flex justify-between items-center max-w-screen-xl mx-auto px-8">
            <div className="py-0 px-4 h-full flex flex-row items-center ">
              <img
                className="w-32 h-32 rounded-full border-4 border-white object-contain bg-white"
                src={community.icon_image_url}
              />
              <h1 className="text-2xl font-bold mt-8 ml-4">{community.name}</h1>
            </div>

            <div className="mt-8 flex space-x-4">
              <Button>Join</Button>
              <Button bgColor="bg-yellow-600">Redeem</Button>
            </div>
          </div>

          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-3 gap-4 h-full">
              <div></div>
              <div className="col-span-2 flex space-x-4 mx-4">
                <div className="bg-gray-100 border border-b-0 border-gray-300 rounded-t-xl px-4 py-2 tracking-widest font-bold text-sm cursor-pointer">
                  Chat
                </div>
                <div className="border border-b-0 border-gray-300 rounded-t-xl px-4 py-2 tracking-widest font-bold text-sm select-none cursor-not-allowed">
                  Discussion Board
                </div>
                <div className="border border-b-0 border-gray-300 rounded-t-xl px-4 py-2 tracking-widest font-bold text-sm select-none cursor-not-allowed">
                  Tweets
                </div>
                <div className="border border-b-0 border-gray-300 rounded-t-xl px-4 py-2 tracking-widest font-bold text-sm select-none cursor-not-allowed">
                  News
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="flex flex-col border border-gray-300 rounded">
                <div className="text-xl font-semibold border-b border-gray-300 p-4">About this community</div>
                <div className="p-4">
                  <h3 className="leading-loose text-lg font-semibold">Description</h3>
                  <p className="">{community.description}</p>
                  <h3 className="leading-loose text-lg font-semibold">Requirement</h3>
                  <p className="">{community.requirement}</p>
                </div>
              </div>
              <div className="col-span-2 flex flex-col p-4 border border-gray-300 rounded relative">
                <CommunityChat community={community} communityTokenAddress={''} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const slug = context.query.slug
  const result = await client.query({ query: GET_COMMUNITY_BY_SLUG, variables: { slug } })
  const community = result.data.community[0]
  return { props: { community } }
}

export default CommunityPage
