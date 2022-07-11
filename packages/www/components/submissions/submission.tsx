import Moment from 'react-moment'
import { ISubmission } from '../../types'
import Emoji from '../util/emoji'

interface IProps {
  submission: ISubmission
}

export default function AllSubmissions({ submission }: IProps) {
  return (
    <div className="p-3 border border-gray-300 flex justify-between space-x-8">
      <div className="flex-none w-32">
        <div className="">#{submission.id}</div>
        <div className="text-sm text-gray-500 italic mt-1">
          <Moment fromNow>{submission.created_at}</Moment>
        </div>
      </div>
      <div className="flex-1 truncate">
        <p className="truncate">{submission.commitment}</p>
        <div className="w-64 truncate">{submission.proof_of_interaction}</div>
      </div>
      <div className="flex-none truncate w-8">
        {<Emoji label="approval" symbol={submission.approved ? '✅' : '❌'} />}
      </div>
    </div>
  )
}
