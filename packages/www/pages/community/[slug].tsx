import { Toaster } from 'react-hot-toast'
import type { NextPage, NextPageContext } from 'next'
import Head from 'next/head'

import AdminPage from '../../components/admin'
import Navbar from '../../components/layout/navbar'
import { GET_COMMUNITY_BY_SLUG } from '../../graphql/queries'
import client from '../../lib/apollo-client'
import { ICommunity } from '../../types'
import CommunityChat from '../../components/chat/communityChat'

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
          <div className="py-0 px-4 h-full flex flex-row items-center mx-12">
            <img
              className="w-32 h-32 rounded-full border-4 border-white object-contain bg-white"
              src={community.icon_image_url}
            />
            <h1 className="text-2xl font-bold mt-8 ml-4">{community.name}</h1>
          </div>
          <div className="mx-12 mt-8">
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
