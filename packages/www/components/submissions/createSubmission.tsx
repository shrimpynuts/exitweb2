import { useState } from 'react'

import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'

import { INSERT_SUBMISSION_ONE } from '../../graphql/mutations'
import { pedersenHashConcat, randomBigInt, toHex } from '../../lib/util'
import Button from '../util/button'

interface IProps {}

interface IState {
  community_id: string
  proof_of_interaction: string
}

const DEFAULT_COMMUNITY_ID = 'f267857e-6840-49d7-a319-0a21a67114f3'
const DEFAULT_COMMUNITY_HASH = '0x00ac9ebcfd1af25d43ab918d740e418a16f373e2ad94fbf5b5737c73576cac51'

export default function CreateSubmission({}: IProps) {
  const [insertSubmission] = useMutation(INSERT_SUBMISSION_ONE)

  const [formState, setFormState] = useState<IState>({
    proof_of_interaction: 'http://twitter.com/',
    community_id: DEFAULT_COMMUNITY_ID,
  })

  const handleChange = (event: React.BaseSyntheticEvent) =>
    setFormState({ ...formState, [event.target.name]: event.target.value })

  const onClick = async () => {
    // Generate secret and store into localStorage under "DEFAULT_COMMUNITY_ID"
    const secretKey = randomBigInt(31)
    localStorage.setItem(`exitweb2/community/${DEFAULT_COMMUNITY_ID}`, toHex(secretKey))

    const nullifier = BigInt(DEFAULT_COMMUNITY_HASH)

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
    <div className="flex flex-col w-96 mx-auto p-4 border border-gray-300 rounded">
      <label className="text-xl font-bold">Join the community.</label>
      <p className="mt-2">Provide a link that proves that you belong in this community.</p>
      <input
        className="rounded border mt-2 mb-2 border-gray-300"
        required
        type="text"
        onFocus={(event: any) => event.target.select()}
        name="proof_of_interaction"
        value={formState.proof_of_interaction}
        onChange={handleChange}
      />
      <Button onClick={onClick}>Submit</Button>
    </div>
  )
}
