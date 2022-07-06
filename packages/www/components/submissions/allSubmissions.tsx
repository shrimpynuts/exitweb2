import { useQuery } from '@apollo/client'

import { GET_SUBMISSIONS } from '../../graphql/queries'
import { ISubmission } from '../../types'
import Submission from './submission'
import CreateSubmission from './createSubmission'

interface IProps {}

export default function AllSubmissions({}: IProps) {
  const { data, loading } = useQuery(GET_SUBMISSIONS)

  return (
    <div className="flex">
      <div className="m-4 flex flex-col space-y-2">
        {data &&
          !loading &&
          data.submissions &&
          data.submissions.map((submission: ISubmission, idx: number) => (
            <Submission submission={submission} key={idx} />
          ))}
      </div>
      <div>
        <CreateSubmission />
      </div>
    </div>
  )
}
