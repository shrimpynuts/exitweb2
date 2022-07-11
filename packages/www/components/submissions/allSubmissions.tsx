import { useQuery } from '@apollo/client'

import { GET_SUBMISSIONS } from '../../graphql/queries'
import MerkleTree from './merkleTree'
import { ISubmission } from '../../types'
import Submission from './submission'
import Button from '../util/button'

interface IProps {}

export default function AllSubmissions({}: IProps) {
  const { data, loading, refetch } = useQuery(GET_SUBMISSIONS)

  const onRefreshClick = () => {
    refetch()
  }

  return (
    <div className="flex flex-col mt-2 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">All Submissions</h1>
        <Button onClick={onRefreshClick}>Refetch</Button>
      </div>
      <div className="space-y-2">
        {data &&
          !loading &&
          data.submissions &&
          data.submissions.map((submission: ISubmission, idx: number) => (
            <Submission submission={submission} key={idx} />
          ))}
      </div>
      <MerkleTree submissions={data?.submissions} />
    </div>
  )
}
