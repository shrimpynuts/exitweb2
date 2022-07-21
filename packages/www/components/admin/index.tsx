import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { AIRDROP_CONTRACT_DATA, AIRDROP_CONTRACT_ADDRESS } from '../../lib/config'
import { CommunityPickerSmall } from '../community/communityPicker'
import { GET_ALL_COMMUNITIES } from '../../graphql/queries'
import CommunityAdmin from './communityAdmin'
import CopyCode from '../util/copyableCode'
import { ICommunity } from '../../types'
import { useContractReads } from 'wagmi'

export default function Home() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)

  const [selectedCommunity, setSelectedCommunity] = useState<ICommunity>()
  const communities: ICommunity[] = data?.community

  const { data: contractData } = useContractReads({
    contracts: [
      { ...AIRDROP_CONTRACT_DATA, functionName: 'totalCommunities' },
      { ...AIRDROP_CONTRACT_DATA, functionName: 'owner' },
      { ...AIRDROP_CONTRACT_DATA, functionName: 'communityToken' },
    ],
  })

  return (
    <>
      {communities && (
        <div className="mx-4 lg:mx-24 mt-8">
          <div className="p-4 border border-gray-300 rounded my-2">
            <p className="font-bold text-2xl my-2">Airdrop Smart Contract:</p>
            {contractData && contractData[0] ? (
              <>
                <div>
                  <p className="text-lg inline">Contract address: </p>
                  <CopyCode text={AIRDROP_CONTRACT_ADDRESS} inline />
                </div>
                <div>
                  <p className="text-lg inline">Owner: </p>
                  <CopyCode text={String(contractData[1])} inline />
                </div>
                <div>
                  <p className="text-lg inline">Community Token:</p>
                  <CopyCode text={String(contractData[2])} inline />
                </div>
                <p className="text-lg">Number of communities: {contractData[0].toNumber()}</p>
              </>
            ) : (
              <div>
                <p className="text-red-500 italic">
                  Having issue connecting to smart contract at address {AIRDROP_CONTRACT_ADDRESS}.
                </p>
                <p>Double-check if it is deployed to this chain.</p>
              </div>
            )}
          </div>
          <div className="p-4 border border-gray-300 rounded my-2">
            <p className="font-bold text-2xl my-2">Pick The Community:</p>
            <CommunityPickerSmall
              selectedCommunity={selectedCommunity}
              setSelectedCommunity={setSelectedCommunity}
              communities={communities}
            />
            {selectedCommunity && contractData ? (
              <CommunityAdmin community={selectedCommunity} communityTokenAddress={String(contractData[2])} />
            ) : (
              <div className="text-center my-8">
                {!selectedCommunity && <p className="italic">No community selected.</p>}
                {!contractData && <p className="italic">Having trouble fetching data from smart contract.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
