import { useQuery } from '@apollo/client'
import { useContractReads } from 'wagmi'

import { GET_SUBMISSIONS_FOR_COMMUNITY } from '../../graphql/queries'
import CreateMerkleTree from '../submissions/createMerkleTree'
import { AIRDROP_CONTRACT_DATA, COMMUNITY_TOKEN_ABI } from '../../lib/config'
import { ICommunity, ISubmission } from '../../types'
import AllSubmissions from './allSubmissions'

interface IProps {
  community: ICommunity
  communityTokenAddress: string
}

export default function CommunityAdmin({ community, communityTokenAddress }: IProps) {
  const { data, refetch } = useQuery(GET_SUBMISSIONS_FOR_COMMUNITY, { variables: { id: community.id } })
  const submissions: ISubmission[] = data?.submissions

  const { data: contractData } = useContractReads({
    contracts: [
      { ...AIRDROP_CONTRACT_DATA, functionName: 'communities', args: [community.contract_id] },
      { ...AIRDROP_CONTRACT_DATA, functionName: 'roots', args: [community.contract_id] },
      {
        addressOrName: communityTokenAddress,
        contractInterface: COMMUNITY_TOKEN_ABI,
        functionName: 'totalSupply',
        args: [community.contract_id],
      },
    ],
  })

  return (
    <div className="">
      <AllSubmissions community={community} submissions={submissions} refetch={refetch} />
      <div className="overflow-hidden my-2">
        <div className="my-2">
          <p className="font-bold text-2xl my-2">Database Data:</p>
          <p className="text-lg">Merkle Tree Root: {community.merkle_tree || 'Not generated yet'}</p>
          <p className="text-lg">Contract ID: {community.contract_id}</p>
        </div>
        <p className="font-bold text-2xl my-2">Contract Data:</p>
        {contractData && (
          <div className="my-2">
            <p className="text-lg">Name: {String(contractData[0])}</p>
            <p className="text-lg">Merkle Tree Root: {String(contractData[1])}</p>
            <p className="text-lg">Total Supply: {contractData[2].toNumber()}</p>
          </div>
        )}
      </div>
      <CreateMerkleTree submissions={submissions} community={community} />
    </div>
  )
}
