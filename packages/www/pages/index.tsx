import { Toaster } from 'react-hot-toast'
import type { NextPage } from 'next'
import Head from 'next/head'

import AllSubmissions from '../components/submissions/allSubmissions'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>NFT Accounting</title>
            <meta name="description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />

          {/* Body section */}
          <section>
            <AllSubmissions />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
