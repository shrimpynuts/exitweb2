import { useQuery } from '@apollo/client'
import { GET_ALL_COMMUNITIES } from '../../graphql/queries'
import { ICommunity } from '../../types'
import CreateSubmission from '../submissions/createSubmission'
import GenerateProof from '../submissions/generateProof'
// import HashCalculator from '../submissions/hashCalculator'

export default function Home() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)

  const communities: ICommunity[] = data?.community
  return (
    <div className="mx-auto mt-8">
      {communities && (
        <div className="flex flex-col space-y-4">
          <CreateSubmission community={communities[0]} />
          <GenerateProof community={communities[0]} />
          {/* <HashCalculator community={communities[0]} /> */}
        </div>
      )}
    </div>
  )
}
