import Moment from 'react-moment'
import { ISubmission } from '../../types'

interface IProps {
  submission: ISubmission
}

export default function AllSubmissions({ submission }: IProps) {
  return (
    <div className="p-3 border border-gray-200 shadow rounded flex justify-between space-x-8">
      <div>
        <div className="">#{submission.id}</div>
        <div className="text-sm text-gray-500 italic mt-1">
          <Moment fromNow>{submission.created_at}</Moment>
        </div>
      </div>
      <div className="text-right">
        <div>{submission.commitment}</div>
        <div className="w-64 truncate">{submission.proof_of_interaction}</div>
      </div>
    </div>
  )
}
