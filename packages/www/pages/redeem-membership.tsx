import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@apollo/client'
import Head from 'next/head'

import GenerateProof from '../components/submissions/generateProof'
import { GET_ALL_COMMUNITIES } from '../graphql/queries'
import Navbar from '../components/layout/navbar'
import { ICommunity } from '../types'
import { CommunityCardSmallVertical } from '../components/community/communityCard'

interface IState {
  [communityId: string]: {
    secretKey: string
    community: ICommunity
  }
}

const DEFAULT_CONTRACT_ID = 0

export default function RedeemMembership() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const communities: ICommunity[] = data?.community

  const [secretKeys, setSecretKeys] = useState<IState>()

  useEffect(() => {
    if (communities) {
      const secretKeys = communities.reduce((acc: IState, community) => {
        const secretKey = localStorage.getItem(`exitweb2/community/${community.id}`)
        if (secretKey) {
          acc[community.id] = { secretKey, community }
        }
        return acc
      }, {})
      setSecretKeys(secretKeys)
    }
  }, [communities])

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
            <div className="mt-8 sm:w-4/5 lg:w-3/4 mx-auto">
              <div className="flex flex-col space-y-4">
                {communities?.map((community, i) => {
                  return (
                    <div key={i} className="flex space-x-8">
                      <div className="w-96 ">
                        <CommunityCardSmallVertical community={community} />
                      </div>
                      {secretKeys && secretKeys[community.id] && (
                        <GenerateProof
                          community={community}
                          secretKey={secretKeys[community.id].secretKey}
                          contract_id={DEFAULT_CONTRACT_ID}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
