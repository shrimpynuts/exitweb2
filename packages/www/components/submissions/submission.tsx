import { ISubmission } from '../../types'

interface IProps {
  submission: ISubmission
}

export default function AllSubmissions({ submission }: IProps) {
  return (
    <div className="p-2 border border-black rounded">
      <div>{submission.id}</div>
      <div>{submission.created_at}</div>
      <div>{submission.commitment}</div>
      <div>{submission.proof_of_interaction}</div>
      <div>{submission.community_id}</div>
    </div>
  )
}
