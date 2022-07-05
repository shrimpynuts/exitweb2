import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import Navbar from '../components/layout/navbar'
import dynamic from 'next/dynamic'
import Footer from '../components/layout/footer'

const AccountingControllerWithNoSSR = dynamic(() => import('../components/accounting/controller'), {
  ssr: false,
})

const Home: NextPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>NFT Accounting</title>
            <meta name="description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar displayConnectButton={false} customState={{ modalIsOpen, setModalIsOpen }} />
          <Toaster position="top-center" reverseOrder={false} />

          {/* Body section */}
          <section>
            <AccountingControllerWithNoSSR />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
