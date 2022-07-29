import classNames from 'classnames'
import Moment from 'react-moment'
import { ISubmission } from '../../types'
import Emoji from '../util/emoji'

interface IProps {
  submission: ISubmission
  selected: boolean
  onClick: () => void
}

export default function Submission({ submission, selected, onClick }: IProps) {
  return (
    <div
      className={classNames('p-3  focus-within:border-gray-300 flex justify-between space-x-2 cursor-pointer', {
        'bg-blue-50 ': selected,
      })}
      onClick={onClick}
    >
      <div className="flex-none">
        <div className="">#{submission.id}</div>
        <div className="text-sm text-gray-500 italic mt-1">
          <Moment fromNow>{submission.created_at}</Moment>
        </div>
      </div>
      <div className="flex-1 truncate">
        <p className="truncate">{submission.commitment}</p>
        <div className="truncate">{submission.proof_of_interaction}</div>
      </div>
      <div className="flex-none truncate">{<Emoji label="approval" symbol={submission.approved ? '✅' : '❌'} />}</div>
    </div>
  )
}
