import { useQuery } from '@apollo/client'
import { useContractReads } from 'wagmi'

import { GET_SUBMISSIONS_FOR_COMMUNITY } from '../../graphql/queries'
import CreateMerkleTree from './createMerkleTree'
import { AIRDROP_CONTRACT_DATA, COMMUNITY_TOKEN_ABI } from '../../lib/config'
import { ICommunity, ISubmission } from '../../types'
import AllSubmissions from './allSubmissions'
import CopyCode from '../util/copyableCode'
import { onError } from '@apollo/client/link/error'
import toast from 'react-hot-toast'

interface IProps {
  community: ICommunity
  communityTokenAddress: string
}

export default function CommunityAdmin({ community, communityTokenAddress }: IProps) {
  const { data, refetch } = useQuery(GET_SUBMISSIONS_FOR_COMMUNITY, {
    variables: { id: community.id },
    onError: (error) => toast.error(`Error fetching submissions ${error.message}`),
  })
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
    <>
      <AllSubmissions community={community} submissions={submissions} refetch={refetch} />
      <div className="overflow-hidden my-2 px-4">
        <div className="my-2">
          <p className="font-bold text-2xl my-2">Database Data:</p>
          <p className=" inline">Merkle Tree Root: </p>
          {community.merkle_tree ? (
            <CopyCode text={community.merkle_tree} truncateDisplay={20} inline />
          ) : (
            'Not generated yet'
          )}
          <p className="">Contract ID: {community.contract_id}</p>
        </div>
        <p className="font-bold text-2xl my-2">Contract Data:</p>
        {contractData && (
          <div className="my-2">
            <p className="">Name: {String(contractData[0])}</p>
            <p className=" inline">Merkle Tree Root: </p>
            {contractData[1] ? (
              <CopyCode text={String(contractData[1])} truncateDisplay={20} inline />
            ) : (
              'Not generated yet'
            )}
            <p className="">Total Supply: {contractData[2]?.toNumber()}</p>
          </div>
        )}
      </div>
      <div className="px-4 pt-4">
        <CreateMerkleTree submissions={submissions} community={community} />
      </div>
    </>
  )
}
