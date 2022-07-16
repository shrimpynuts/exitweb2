import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { CommunityPickerSmall } from '../community/communityPicker'
import { GET_ALL_COMMUNITIES } from '../../graphql/queries'
import AllSubmissions from '../submissions/allSubmissions'
import { ICommunity } from '../../types'

export default function Home() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)

  const [selectedCommunity, setSelectedCommunity] = useState<ICommunity>()
  const communities: ICommunity[] = data?.community
  return (
    <>
      {communities && (
        <div className="mx-4 lg:mx-24 mt-8 p-4 border border-gray-300 rounded">
          <CommunityPickerSmall
            selectedCommunity={selectedCommunity}
            setSelectedCommunity={setSelectedCommunity}
            communities={communities}
          />
          <AllSubmissions community={communities[0]} />
        </div>
      )}
    </>
  )
}
