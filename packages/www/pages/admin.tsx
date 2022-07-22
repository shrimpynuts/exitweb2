import { Toaster } from 'react-hot-toast'
import type { NextPage } from 'next'
import Head from 'next/head'

import AdminPage from '../components/admin'
import Navbar from '../components/layout/navbar'

const Admin: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
          <Head>
            <title>Admin Panel</title>
            <meta name="description" content="" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />

          {/* Body section */}
          <section>
            <AdminPage />
          </section>
        </div>
      </div>
    </div>
  )
}

export default Admin
