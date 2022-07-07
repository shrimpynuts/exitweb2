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
    proof_of_interaction: 'default_proof_of_interaction',
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
    <div className="">
      <div className="flex flex-col mb-2 w-96">
        <label>Commitment</label>
        <input required type="text" name="commitment" value={formState.commitment} onChange={handleChange} />

        <label>Proof Of Interaction</label>
        <input
          required
          type="text"
          name="proof_of_interaction"
          value={formState.proof_of_interaction}
          onChange={handleChange}
        />

        <label>Community ID</label>
        <input required type="text" name="community_id" value={formState.community_id} onChange={handleChange} />
      </div>
      <Button onClick={onClick}>Add Submission</Button>
    </div>
  )
}
