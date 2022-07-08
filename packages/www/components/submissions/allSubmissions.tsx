import { useQuery } from '@apollo/client'

import { GET_SUBMISSIONS } from '../../graphql/queries'
import { ISubmission } from '../../types'
import Submission from './submission'

interface IProps {}

export default function AllSubmissions({}: IProps) {
  const { data, loading } = useQuery(GET_SUBMISSIONS)

  return (
    <div className="flex flex-col mt-2">
      {data &&
        !loading &&
        data.submissions &&
        data.submissions.map((submission: ISubmission, idx: number) => (
          <Submission submission={submission} key={idx} />
        ))}
    </div>
  )
}
