import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import FAQ from '../components/marketing/faq'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Head>
        <title>Exit Web2</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />

        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <section className="mt-8 sm:w-2/3 lg:w-2/3 mx-auto flex flex-col">
            <FAQ />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
