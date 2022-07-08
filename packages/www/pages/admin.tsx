import { Toaster } from 'react-hot-toast'
import type { NextPage } from 'next'
import Head from 'next/head'

import AllSubmissions from '../components/submissions/allSubmissions'
import Navbar from '../components/layout/navbar'

const Admin: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>Admin Panel</title>
            <meta name="description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />

          {/* Body section */}
          <section>
            <div className="md:w-1/2 lg:w-1/3 mx-auto mt-8 p-4 border border-gray-300 rounded">
              <h1 className="text-xl font-bold">All Submissions</h1>
              <AllSubmissions />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Admin
