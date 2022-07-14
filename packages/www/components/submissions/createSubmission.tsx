import { useState } from 'react'
import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'

import { pedersenHashConcat, randomBigInt, toHex } from '../../lib/zkp/util'
import { INSERT_SUBMISSION_ONE } from '../../graphql/mutations'
import { ICommunity } from '../../types'
import Button from '../util/button'

interface IProps {
  community: ICommunity
}

interface IState {
  community_id: string
  proof_of_interaction: string
}

export default function CreateSubmission({ community }: IProps) {
  const [insertSubmission] = useMutation(INSERT_SUBMISSION_ONE)

  const [formState, setFormState] = useState<IState>({
    proof_of_interaction: 'http://twitter.com/',
    community_id: community.id,
  })

  const handleChange = (event: React.BaseSyntheticEvent) =>
    setFormState({ ...formState, [event.target.name]: event.target.value })

  const onClick = async () => {
    // Generate secret and store into localStorage under "DEFAULT_COMMUNITY_ID"
    const secretKey = randomBigInt(31)
    localStorage.setItem(`exitweb2/community/${community.id}`, toHex(secretKey))

    const nullifier = BigInt(community.hash)

    // Calculate commitment and create the submission object
    const commitment = toHex(pedersenHashConcat(nullifier, secretKey))
    const submission = { ...formState, commitment }

    // Insert submission into database
    insertSubmission({ variables: { submission } })
      // Handle successful response
      .then((res) => {
        console.log({ res })
        toast.success('Created new submission.')
      })
      // Handle error response
      .catch((err) => {
        toast.error(`Failed to create submission! ${err}`)
      })
  }

  return (
    <div className="flex flex-col justify-between h-full my-auto w-1/2 mx-auto p-4 border border-gray-300 rounded">
      <div>
        <label className="text-xl font-bold">
          Join the <span className="italic text-blue-600">{community.name}</span> community.
        </label>
        <p className="mt-2">Here is the requirement for your proof: {community.requirement}</p>
        {/* <p className="mt-2">Provide a link that proves that you belong in this community.</p> */}
      </div>

      <div className="flex flex-col">
        <input
          className="rounded border mt-2 mb-2 border-gray-300"
          required
          type="text"
          onFocus={(event: any) => event.target.select()}
          name="proof_of_interaction"
          value={formState.proof_of_interaction}
          onChange={handleChange}
        />
        <Button onClick={onClick}>Request membership</Button>
      </div>
    </div>
  )
}
