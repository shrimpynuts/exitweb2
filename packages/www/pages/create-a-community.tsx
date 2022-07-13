import { Toaster } from 'react-hot-toast'
import type { NextPage } from 'next'
import Head from 'next/head'

import CreateCommunity from '../components/community/createCommunity'
import Navbar from '../components/layout/navbar'

const Admin: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>Create A Community</title>
            <meta name="description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />

          {/* Body section */}
          <section>
            <div className="mt-8 sm:w-3/4 lg:w-2/3 mx-auto">
              <CreateCommunity />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Admin
