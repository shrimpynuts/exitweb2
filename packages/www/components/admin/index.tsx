import { useQuery } from '@apollo/client'
import { GET_ALL_COMMUNITIES } from '../../graphql/queries'
import { ICommunity } from '../../types'
import AllSubmissions from '../submissions/allSubmissions'

export default function Home() {
  const { data } = useQuery(GET_ALL_COMMUNITIES)

  const communities: ICommunity[] = data?.community
  return (
    <>
      {communities && (
        <div className="mx-4 lg:mx-24 mt-8 p-4 border border-gray-300 rounded">
          <AllSubmissions community={communities[0]} />
        </div>
      )}
    </>
  )
}
