import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { CommunityPickerSmall } from '../community/communityPicker'
import { GET_ALL_COMMUNITIES } from '../../graphql/queries'
import AllSubmissions from '../submissions/allSubmissions'
import { ICommunity } from '../../types'
import { AIRDROP_CONTRACT_DATA, AIRDROP_CONTRACT_ADDRESS, COMMUNITY_TOKEN_ABI } from '../../lib/config'
import { useContractRead, useContractReads } from 'wagmi'
import CopyCode from '../util/copyableCode'

export default function Home() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)

  const [selectedCommunity, setSelectedCommunity] = useState<ICommunity>()
  const communities: ICommunity[] = data?.community

  const DEFAULT_CONTRACT_ID = 0

  const { data: contractData } = useContractReads({
    contracts: [
      { ...AIRDROP_CONTRACT_DATA, functionName: 'totalCommunities' },
      { ...AIRDROP_CONTRACT_DATA, functionName: 'owner' },
      { ...AIRDROP_CONTRACT_DATA, functionName: 'communities', args: [DEFAULT_CONTRACT_ID] },
      { ...AIRDROP_CONTRACT_DATA, functionName: 'roots', args: [DEFAULT_CONTRACT_ID] },
      { ...AIRDROP_CONTRACT_DATA, functionName: 'communityToken' },
    ],
  })

  const { data: tokenTotalSupply } = useContractRead({
    addressOrName: '0x75537828f2ce51be7289709686A69CbFDbB714F1',
    contractInterface: COMMUNITY_TOKEN_ABI,
    functionName: 'totalSupply',
    args: [DEFAULT_CONTRACT_ID],
    select: (data) => data.toNumber(),
  })

  return (
    <>
      {communities && (
        <div className="mx-4 lg:mx-24 mt-8">
          {contractData && (
            <div className="p-4 border border-gray-300 rounded my-2">
              <p className="font-bold text-2xl my-2">Airdrop Smart Contract:</p>
              <p className="text-lg inline">Contract address: </p>
              <CopyCode text={AIRDROP_CONTRACT_ADDRESS} inline />
              <p className="text-lg">Number of communities: {contractData[0].toNumber()}</p>
              <p className="text-lg inline">Owner: </p>
              <CopyCode text={String(contractData[1])} inline />
              <p className="text-lg">
                Name of community {DEFAULT_CONTRACT_ID}: {contractData[2]}
              </p>
              <p className="text-lg inline">Root of community {DEFAULT_CONTRACT_ID}:</p>
              <CopyCode text={String(contractData[3])} inline />
              <p className="text-lg inline">Community Token:</p>
              <CopyCode text={String(contractData[4])} inline />
              <p className="text-lg">
                Total Supply for ID {DEFAULT_CONTRACT_ID}: {tokenTotalSupply}
              </p>
            </div>
          )}
          <div className="p-4 border border-gray-300 rounded my-2">
            <p className="font-bold text-2xl my-2">Pick The Community:</p>
            <CommunityPickerSmall
              selectedCommunity={selectedCommunity}
              setSelectedCommunity={setSelectedCommunity}
              communities={communities}
            />
            {selectedCommunity && <AllSubmissions community={selectedCommunity} contract_id={DEFAULT_CONTRACT_ID} />}
          </div>
        </div>
      )}
    </>
  )
}
