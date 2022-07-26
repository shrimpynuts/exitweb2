import { useMutation } from '@apollo/client'
import { toast } from 'react-hot-toast'

import { INSERT_COMMUNITY_MULTIPLE } from '../../graphql/mutations'
import Button from '../util/button'
import { mockCommunities } from '../../lib/mockData/mockCommunities'

interface IProps {}

export default function addMockCommunities({}: IProps) {
  const [insertCommunities] = useMutation(INSERT_COMMUNITY_MULTIPLE)
  const onClick = () => {
    toast.promise(insertCommunities({ variables: { communities: mockCommunities } }), {
      loading: 'Inserting mock communities...',
      success: 'Mock communities inserted!',
      error: (err) => err.toString(),
    })
  }
  return (
    <div className="">
      <Button bgColor="bg-red-500" onClick={onClick}>
        Load Demo Communities
      </Button>
    </div>
  )
}
