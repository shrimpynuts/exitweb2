import { useQuery } from '@apollo/client'

import { GET_SUBMISSIONS_FOR_COMMUNITY } from '../../graphql/queries'
import CreateMerkleTree from '../submissions/createMerkleTree'
import { ICommunity, ISubmission } from '../../types'
import CopyCode from '../util/copyableCode'
import AllSubmissions from './allSubmissions'

interface IProps {
  community: ICommunity
}

export default function CommunityAdmin({ community }: IProps) {
  const { data, refetch } = useQuery(GET_SUBMISSIONS_FOR_COMMUNITY, {
    variables: { id: community.id },
  })

  const submissions: ISubmission[] = data?.submissions
  return (
    <div className="">
      <AllSubmissions community={community} submissions={submissions} refetch={refetch} />
      <div className="overflow-hidden">
        <p className="font-bold text-lg my-2">Merkle Tree (in database):</p>
        {community.merkle_tree ? (
          <CopyCode text={community.merkle_tree} />
        ) : (
          <div>
            <p className="italic">No merkle tree generated yet.</p>
          </div>
        )}
      </div>
      <CreateMerkleTree submissions={submissions} community={community} />
    </div>
  )
}
