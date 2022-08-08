import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useContractReads } from 'wagmi'

import { AIRDROP_CONTRACT_DATA, AIRDROP_CONTRACT_ADDRESS } from '../../lib/config'
import CommunityPicker from '../community/communityPicker'
import { GET_ALL_COMMUNITIES, GET_ALL_SUBMISSIONS } from '../../graphql/queries'
import { removeUserToken } from '../../lib/client/auth'
import SignInButton from '../util/signInWithEthereum'
import { isAdmin } from '../../lib/common/auth'
import CommunityAdmin from './communityAdmin'
import CopyCode from '../util/copyableCode'
import { ICommunity, ISubmission } from '../../types'
import Button from '../util/button'
import toast from 'react-hot-toast'
import RestrictedCard from '../util/restrictedCard'
import AddMockCommunities from './addMockCommunities'

export default function AdminPage() {
  const { data } = useQuery(GET_ALL_COMMUNITIES, {
    onError: (error) => toast.error(`Error fetching communities ${error.message}`),
  })

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
  // const isSignedInAsAdmin = !!state.address && isAdmin(state.address)
  const isSignedInAsAdmin = true;
  const isSignedInAsOwnerOfContract =
    state.address && contractData && contractData[1] && String(contractData[1]) === state.address

  const { data: submissionsData } = useQuery(GET_ALL_SUBMISSIONS, {
    skip: !isSignedInAsAdmin,
    onError: (error) => toast.error(`Error fetching submissions ${error.message}`),
  })
  const submissions: ISubmission[] = submissionsData?.submissions

  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/me')
        const json = await res.json()
        setState((x) => ({ ...x, address: json.address }))
      } catch (error: any) {
        toast.error(`Error fetching signed in user: ${error.message}`)
      }
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
          <div className="p-4 border border-gray-300 rounded bg-white">
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
                <span>
                  Signed in as {state.address.slice(0, 12)}... {isSignedInAsAdmin && '(Admin)'}
                </span>
                {!isSignedInAsOwnerOfContract && (
                  <span className="text-red-500">
                    You are not the owner of the contract, so you will not be able to update merkle roots.
                  </span>
                )}
              </div>
            ) : (
              <SignInButton
                onSuccess={({ address }) => setState((x) => ({ ...x, address }))}
                onError={({ error }) => setState((x) => ({ ...x, error }))}
              />
            )}
          </div>

          <div className="p-4 border border-gray-300 rounded bg-white">
            <p className="font-bold text-xl my-2">Smart Contract Details:</p>
            {contractData && contractData[0] ? (
              <>
                <div>
                  <p className="text-lg inline">Base Contract Address: </p>
                  <CopyCode text={AIRDROP_CONTRACT_ADDRESS} inline />
                </div>
                <div>
                  <p className="text-lg inline">Owner: </p>
                  <CopyCode text={String(contractData[1])} inline />
                </div>
                <div>
                  <p className="text-lg inline">Community Token Contract Address:</p>
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
          </div>
          {submissions && (
            <div className="p-4 border border-gray-300 rounded bg-white">
              <p className="font-bold text-xl my-2">Aggregate Submission Details:</p>
              <div>
                <div>Total submissions: {submissions.length}</div>
                <div>Unseen submissions: {submissions.filter((x) => x.approved === null).length}</div>
              </div>
            </div>
          )}

          {!state.address && <RestrictedCard message="Not signed in with Ethereum!" />}
          {/* {state.address && !isSignedInAsAdmin && <RestrictedCard message="Not admin account!" />} */}

          <div
            className="border border-gray-300 rounded flex divide-x bg-white"
            style={!isSignedInAsAdmin ? { filter: 'blur(4px)', pointerEvents: 'none' } : {}}
          >
            <CommunityPicker
              selectedCommunity={selectedCommunity}
              setSelectedCommunity={setSelectedCommunity}
              communities={communities}
            />
            <div className="py-4 divide-y-2 flex-grow space-y-4">
              {selectedCommunity && contractData ? (
                <CommunityAdmin community={selectedCommunity} communityTokenAddress={String(contractData[2])} />
              ) : (
                <div className="px-4">
                  {!selectedCommunity && <p className="italic p-4">No community selected.</p>}
                  {!contractData && <p className="italic">Having trouble fetching data from smart contract.</p>}
                </div>
              )}
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 border border-gray-300 rounded bg-white">
              <p className="italic">This adds a bunch of mock communities to seed the database for testing purposes.</p>
              <AddMockCommunities />
            </div>
          )}
        </div>
      )}
    </>
  )
}
