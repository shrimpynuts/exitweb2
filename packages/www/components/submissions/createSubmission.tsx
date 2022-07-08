import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { INSERT_SUBMISSION_ONE } from '../../graphql/mutations'
import Button from '../util/button'
import toast from 'react-hot-toast'

interface IProps {}

interface IState {
  commitment: string
  community_id: string
  proof_of_interaction: string
}

export default function CreateSubmission({}: IProps) {
  const [insertSubmission] = useMutation(INSERT_SUBMISSION_ONE)
  const [formState, setFormState] = useState<IState>({
    commitment: 'default_commitment',
    proof_of_interaction: 'http://twitter.com/',
    community_id: 'b28923c8-507c-4dc0-80a0-baf45829ba9d',
  })

  const handleChange = (event: React.BaseSyntheticEvent) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    })
  }

  const onClick = () => {
    insertSubmission({
      variables: {
        submission: { ...formState },
      },
    })
      .then((res) => {
        console.log({ res })
        toast.success('Created new submission.')
      })
      .catch((err) => {
        toast.error(`Failed to create submission! ${err}`)
      })
  }

  return (
    <div className="flex flex-col w-96 mx-auto p-4 border border-gray-300 rounded">
      {/* <label>Commitment</label>
      <input
        className="rounded border mb-2 border-gray-300"
        required
        type="text"
        name="commitment"
        value={formState.commitment}
        onChange={handleChange}
      /> */}

      <label className="text-xl font-bold">Join the community.</label>
      <p className="mt-2">Provide a link that proves that you belong in this community.</p>
      <input
        className="rounded border mt-2 mb-2 border-gray-300"
        required
        type="text"
        name="proof_of_interaction"
        value={formState.proof_of_interaction}
        onChange={handleChange}
      />

      {/* <label>Community ID (only one for now)</label>
      <input
        className="rounded border mb-2 border-gray-300 bg-gray-100 cursor-not-allowed"
        required
        disabled
        type="text"
        name="community_id"
        value={formState.community_id}
        onChange={handleChange}
      /> */}
      <Button onClick={onClick}>Submit</Button>
    </div>
  )
}
