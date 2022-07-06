import { GET_SUBMISSIONS } from '../../graphql/queries'
import { useQuery } from '@apollo/client'
import { ISubmission } from '../../types'
import Submission from './submission'

interface IProps {}

export default function AllSubmissions({}: IProps) {
  const { data, loading } = useQuery(GET_SUBMISSIONS)
  return (
    <div className="w-64">
      {data &&
        !loading &&
        data.submissions &&
        data.submissions.map((submission: ISubmission, idx: number) => (
          <Submission submission={submission} key={idx} />
        ))}
    </div>
  )
}
