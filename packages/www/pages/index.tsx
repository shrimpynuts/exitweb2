import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'

import Navbar from '../components/layout/navbar'
import Home from '../components/home'

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>Exit Web2</title>
            <meta name="description" content="" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />

          <section>
            <Home />
          </section>
        </div>
      </div>
    </div>
  )
}

export default HomePage
