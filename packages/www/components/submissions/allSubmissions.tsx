import { GET_SUBMISSIONS } from '../../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { ISubmission } from '../../types'
import Submission from './submission'
import Button from '../util/button'
import { INSERT_SUBMISSION_ONE } from '../../graphql/mutations'

interface IProps {}

export default function AllSubmissions({}: IProps) {
  const { data, loading } = useQuery(GET_SUBMISSIONS)
  const [insertSubmission] = useMutation(INSERT_SUBMISSION_ONE)

  const onClick = () => {
    insertSubmission({
      variables: {
        submission: {
          commitment: '33333',
          community_id: 'b28923c8-507c-4dc0-80a0-baf45829ba9d',
          proof_of_interaction: 'proof_of_interaction',
        },
      },
    })
  }

  return (
    <div className="w-96">
      <div className="m-4 flex flex-col space-y-2">
        {data &&
          !loading &&
          data.submissions &&
          data.submissions.map((submission: ISubmission, idx: number) => (
            <Submission submission={submission} key={idx} />
          ))}
        <Button onClick={onClick}>Add Submission</Button>
      </div>
    </div>
  )
}
