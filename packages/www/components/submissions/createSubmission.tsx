import { useState } from 'react'

import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'

import { INSERT_SUBMISSION_ONE } from '../../graphql/mutations'
import { pedersenHashConcat, randomBigInt, toHex } from '../../lib/zkp/util'
import Button from '../util/button'
import { ICommunity } from '../../types'

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
    console.log({ commitment, secret: toHex(secretKey) })
    // key: 0x00630812d5ee0954e1de5adeb5fb5d4dfc9961ab96fa2aeab9fd31cddf092f90
    // 0x07c34a802ea5ac83791aa9c44dbab13a6aafda8dcf3b77972d1946e7eab572b6

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
