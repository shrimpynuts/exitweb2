import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { UPDATE_SUBMISSION_APPROVAL } from '../../graphql/mutations'
import { GET_SUBMISSIONS } from '../../graphql/queries'
import MerkleTree from './createMerkleTree'
import { ICommunity, ISubmission } from '../../types'
import Submission from './submission'
import Button from '../util/button'
import { toast } from 'react-hot-toast'

interface IProps {
  community: ICommunity
}

export default function AllSubmissions({ community }: IProps) {
  const [selectedIds, setSelectedIds] = useState<{ [id: number]: boolean }>({})
  const { data, loading, refetch } = useQuery(GET_SUBMISSIONS)

  const [updateSubmissionApproval] = useMutation(UPDATE_SUBMISSION_APPROVAL)

  const onRefreshClick = () => {
    refetch()
  }

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
    <div className="flex flex-col mt-2 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">All Submissions</h1>
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
      <div className="space-y-2">
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
      <MerkleTree submissions={data?.submissions} community={community} />
    </div>
  )
}
