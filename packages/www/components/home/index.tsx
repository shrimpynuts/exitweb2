import { useRouter } from 'next/dist/client/router'
import Button from '../util/button'

export default function Home() {
  const router = useRouter()
  return (
    <div className="mt-8 sm:w-3/4 lg:w-2/3 mx-auto">
      <div className="flex flex-col space-y-8 mx-4 lg:mx-auto lg:w-96">
        <div className="flex flex-col p-4 border border-gray-300 rounded">
          <h1 className="text-2xl font-bold">Join a community</h1>
          <p className="mt-2">
            Request to join a web3 community by proving your membership, while maintaining anonymity.
          </p>
          <Button classOverrides="mt-4" onClick={() => router.push('/join-community')}>
            Browse communities
          </Button>
        </div>
        <div className="flex flex-col p-4 border border-gray-300 rounded">
          <h1 className="text-2xl font-bold">Create a community</h1>
          <p className="mt-2">Bootstrap a new web3 community by privately airdropping tokens to members.</p>
          <Button classOverrides="mt-4" onClick={() => router.push('/create-community')}>
            Create a new community
          </Button>
        </div>
      </div>
    </div>
  )
}
