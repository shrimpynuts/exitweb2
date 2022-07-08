import { Toaster } from 'react-hot-toast'
import type { NextPage } from 'next'
import Head from 'next/head'

import Navbar from '../components/layout/navbar'
import CreateSubmission from '../components/submissions/createSubmission'

const Home: NextPage = () => {
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
            <div className="mx-auto mt-8">
              <CreateSubmission />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Home
