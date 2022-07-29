import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useContractReads } from 'wagmi'
import toast from 'react-hot-toast'

import { AIRDROP_CONTRACT_DATA, AIRDROP_CONTRACT_ADDRESS } from '../../lib/config'
import { GET_ALL_COMMUNITIES, GET_SUBMISSIONS } from '../../graphql/queries'
import { CommunityPickerSmall } from '../community/communityPicker'
import AddMockCommunities from './addMockCommunities'
import CommunityAdmin from './communityAdmin'
import CopyCode from '../util/copyableCode'
import { ICommunity } from '../../types'
import SignInButton from '../util/signInWithEthereum'
import { removeUserToken } from '../../lib/client/auth'
import Button from '../util/button'

export default function AdminPage() {
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

  const [state, setState] = useState<{ address?: string; error?: Error; loading?: boolean }>({})

  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/me')
        const json = await res.json()
        setState((x) => ({ ...x, address: json.address }))
      } catch (_error) {}
    }
    // 1. page loads
    handler()

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])

  return (
    <>
      {communities && (
        <div className="mx-4 lg:mx-24 mt-8 space-y-4">
          <div className="p-4 border border-gray-300 rounded">
            {state.address ? (
              <div className="flex space-x-4">
                <Button
                  onClick={async () => {
                    await fetch('/api/logout').then((resp) => resp.ok && removeUserToken())
                    setState({})
                  }}
                >
                  Sign Out
                </Button>
                <span>Signed in as {state.address}</span>
              </div>
            ) : (
              <SignInButton
                onSuccess={({ address }) => setState((x) => ({ ...x, address }))}
                onError={({ error }) => setState((x) => ({ ...x, error }))}
              />
            )}
          </div>

          <div className="p-4 border border-gray-300 rounded">
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
                <p>Double-check if you are connected to the right network.</p>
              </div>
            )}
            <AddMockCommunities />
          </div>
          <div className="border border-gray-300 rounded flex divide-x">
            <CommunityPickerSmall
              selectedCommunity={selectedCommunity}
              setSelectedCommunity={setSelectedCommunity}
              communities={communities}
            />
            <div className="py-4 divide-y-2 flex-grow space-y-4">
              {selectedCommunity && contractData ? (
                <CommunityAdmin community={selectedCommunity} communityTokenAddress={String(contractData[2])} />
              ) : (
                <div className="px-4">
                  {!selectedCommunity && <p className="italic">No community selected.</p>}
                  {!contractData && <p className="italic">Having trouble fetching data from smart contract.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
