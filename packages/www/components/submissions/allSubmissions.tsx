import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { UPDATE_SUBMISSION_APPROVAL } from '../../graphql/mutations'
import { GET_SUBMISSIONS_FOR_COMMUNITY } from '../../graphql/queries'
import CreateMerkleTree from './createMerkleTree'
import { ICommunity, ISubmission } from '../../types'
import Submission from './submission'
import Button from '../util/button'
import { toast } from 'react-hot-toast'
import CopyCode from '../util/copyableCode'

interface IProps {
  community: ICommunity
  contract_id: number
}

export default function AllSubmissions({ community, contract_id }: IProps) {
  const [selectedIds, setSelectedIds] = useState<{ [id: number]: boolean }>({})
  const { data, loading, refetch } = useQuery(GET_SUBMISSIONS_FOR_COMMUNITY, {
    variables: { id: community.id },
  })

  const [updateSubmissionApproval] = useMutation(UPDATE_SUBMISSION_APPROVAL)

  const onRefreshClick = () => refetch()

  const onApproveClick = () => {
    if (Object.keys(selectedIds).length === 0) return
    updateSubmissionApproval({ variables: { submissionIds: Object.keys(selectedIds), approved: true } })
      .then(() => toast.success('Submissions approved!'))
      .then(() => refetch())
      .catch((e) => toast.error(e.message))
  }

  const onDisproveClick = () => {
    if (Object.keys(selectedIds).length === 0) return
    updateSubmissionApproval({ variables: { submissionIds: Object.keys(selectedIds), approved: false } })
      .then(() => toast.success('Submissions disproved!'))
      .then(() => refetch())
      .catch((e) => toast.error(e.message))
  }

  const onSelect = (id: number) => setSelectedIds({ ...selectedIds, [id]: !selectedIds[id] })

  const onSelectAll = () => {
    const newSelectedIds: { [id: number]: boolean } = {}
    data?.submissions.forEach((submission: ISubmission) => (newSelectedIds[parseInt(submission.id)] = true))
    setSelectedIds(newSelectedIds)
  }

  const onDeselectAll = () => setSelectedIds({})

  return (
    <div className="flex flex-col mt-4 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          Submissions for <span className="text-blue-600 italic">{community.name}</span>
        </h1>
        <div className="flex space-x-2">
          <Button onClick={onRefreshClick}>Refresh</Button>
          <Button onClick={onSelectAll}>Select All</Button>
          <Button onClick={onDeselectAll}>Select None</Button>
          <Button bgColor="bg-green-500" onClick={onApproveClick}>
            Approve
          </Button>
          <Button bgColor="bg-red-500" onClick={onDisproveClick}>
            Disprove
          </Button>
        </div>
      </div>
      <div className="space-y-0 flex-col divide-y border border-gray-300 rounded overflow-hidden">
        {data &&
          !loading &&
          data.submissions &&
          data.submissions.map((submission: ISubmission, idx: number) => (
            <Submission
              onClick={() => onSelect(parseInt(submission.id))}
              submission={submission}
              key={idx}
              selected={selectedIds[parseInt(submission.id)]}
            />
          ))}
      </div>
      <div className="overflow-hidden">
        <p className="font-bold text-lg my-2">Merkle Tree (in database):</p>
        {community.merkle_tree ? (
          <CopyCode text={community.merkle_tree} />
        ) : (
          <div>
            <p className="text-red-600 italic">No merkle tree generated yet.</p>
          </div>
        )}
      </div>
      <CreateMerkleTree submissions={data?.submissions} community={community} contract_id={contract_id} />
    </div>
  )
}
