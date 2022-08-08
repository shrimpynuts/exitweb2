import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { toast } from 'react-hot-toast'

import { UPDATE_SUBMISSION_APPROVAL } from '../../graphql/mutations'
import { ICommunity, ISubmission } from '../../types'
import Submission from '../submissions/submission'
import Button from '../util/button'

interface IProps {
  community: ICommunity
  submissions: ISubmission[]
  refetch: () => void
}

export default function AllSubmissions({ community, submissions, refetch }: IProps) {
  const [selectedIds, setSelectedIds] = useState<{ [id: number]: boolean }>({})
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

  const onSelect = (id: number) => {
    const newIds = {
      ...selectedIds,
      [id]: true,
    };

    if (id in selectedIds) {
      delete newIds[id];
    }

    setSelectedIds(newIds);
  }

  const onSelectAll = () => {
    const newSelectedIds: { [id: number]: boolean } = {}
    submissions.forEach((submission: ISubmission) => (newSelectedIds[parseInt(submission.id)] = true))
    setSelectedIds(newSelectedIds)
  }

  const onDeselectAll = () => setSelectedIds({})

  return (
    <div className="flex flex-col p-4 space-y-4">
      <h1 className="text-2xl font-bold">
        {submissions?.length} submissions for <span className="text-blue-600 italic">{community.name}</span>
      </h1>
      <div>
        <div className="flex space-x-1">
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
      <div
        className="space-y-0 flex-col border border-gray-300 rounded overflow-auto divide-y"
        style={{ minHeight: 100 }}
      >
        {submissions?.map((submission, idx: number) => (
          <Submission
            onClick={() => onSelect(parseInt(submission.id))}
            submission={submission}
            key={idx}
            selected={selectedIds[parseInt(submission.id)]}
          />
        ))}
      </div>
    </div>
  )
}
