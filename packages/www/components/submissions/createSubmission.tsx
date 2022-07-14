import { useState } from 'react'
import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'

import { pedersenHashConcat, randomBigInt, toHex } from '../../lib/zkp/util'
import { INSERT_SUBMISSION_ONE } from '../../graphql/mutations'
import { ICommunity, ISubmission } from '../../types'
import Button from '../util/button'
import ShareTweetButton from '../util/shareTweetButton'

interface IProps {
  community: ICommunity
  onFinished: () => void
}

type IState = Pick<ISubmission, 'community_id' | 'proof_of_interaction' | 'proof_of_account_ownership'>

export default function CreateSubmission({ community, onFinished }: IProps) {
  const [insertSubmission] = useMutation(INSERT_SUBMISSION_ONE)

  const [formState, setFormState] = useState<IState>({
    proof_of_interaction: 'http://twitter.com/',
    community_id: community.id,
    proof_of_account_ownership: 'https://twitter.com/exitweb2/status/123456789',
  })

  const [step1Finished, setStep1Finished] = useState<boolean>(false)

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
        setStep1Finished(false)
        onFinished()
      })
      // Handle error response
      .catch((err) => {
        toast.error(`Failed to create submission! ${err}`)
      })
  }
  const twitterShareText = `I\'m exiting web2. \n@exitweb2`

  const twitterShareLink = `https://twitter.com/intent/tweet?ref_src=twsrc%5Etfw&text=${encodeURIComponent(
    twitterShareText,
  )}&tw_p=tweetbutton`

  return (
    <div className="flex flex-col justify-between h-80 my-auto w-1/2 mx-auto p-4 border border-gray-300 rounded">
      {!step1Finished ? (
        <>
          <div>
            <h1 className="text-xl font-bold mb-4">
              Join the <span className="italic text-blue-600">{community.name}</span> community.
            </h1>
            <p className="mt-2">Here is the requirement to join:</p>
            <p className="mt-2 italic">{community.requirement}</p>
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
            <Button onClick={() => setStep1Finished(true)}>Next</Button>
            <Button classOverrides="mt-1" bgColor="bg-gray-600" onClick={onFinished}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-xl font-bold mb-2">Finish the submission.</h1>
            <p className="">Prove that you own the account in the link you provided by making a tweet.</p>
            <div className="mt-2">
              <ShareTweetButton link={twitterShareLink} />
            </div>
          </div>
          <div className="flex flex-col ">
            <p className="">
              Then, give us the link to <span className="italic">that</span> tweet.
            </p>
            <input
              className="rounded border mt-2 mb-4 border-gray-300"
              required
              type="text"
              onFocus={(event: any) => event.target.select()}
              name="proof_of_account_ownership"
              value={formState.proof_of_account_ownership}
              onChange={handleChange}
            />
            <Button onClick={onClick}>Submit request</Button>
            <Button classOverrides="mt-1" bgColor="bg-gray-600" onClick={() => setStep1Finished(false)}>
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
