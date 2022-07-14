import { useQuery } from '@apollo/client'
import { useRouter } from 'next/dist/client/router'
import { GET_ALL_COMMUNITIES } from '../../graphql/queries'
import { ICommunity } from '../../types'
import CreateSubmission from '../submissions/createSubmission'
import GenerateProof from '../submissions/generateProof'
import Button from '../util/button'

export default function Home() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)
  const router = useRouter()

  const communities: ICommunity[] = data?.community
  return (
    <div className="mt-8 sm:w-3/4 lg:w-2/3 mx-auto">
      <div className="flex flex-col space-y-8 mx-4 lg:mx-auto lg:w-96">
        <div className="flex flex-col p-4 border border-gray-300 rounded">
          <h1 className="text-2xl font-bold">Join a community</h1>
          <p>Request to join a web3 community by proving your membership, while maintaining anonymity.</p>
          <Button classOverrides="mt-4" onClick={() => router.push('/join-a-community')}>
            Browse communities
          </Button>
        </div>
        <div className="flex flex-col p-4 border border-gray-300 rounded">
          <h1 className="text-2xl font-bold">Create a community</h1>
          <p>Bootstrap a new web3 community by privately airdropping tokens to members.</p>
          <Button classOverrides="mt-4" onClick={() => router.push('/create-a-community')}>
            Create a new community
          </Button>
        </div>
        <div className="flex flex-col p-4 border border-gray-300 rounded">
          <h1 className="text-2xl font-bold">Redeem membership</h1>
          <p>
            After your request to join a community has been approved, you can redeem your membership here by claiming
            your token.
          </p>
          <Button classOverrides="mt-4" onClick={() => router.push('/redeem-membership')}>
            Redeem membership
          </Button>
        </div>
      </div>
      {communities && communities[0] && (
        <div className="flex flex-col space-y-4">
          <CreateSubmission community={communities[0]} />
          <GenerateProof community={communities[0]} />
        </div>
      )}
    </div>
  )
}
