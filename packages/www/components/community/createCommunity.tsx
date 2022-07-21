import { useState } from 'react'

import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { useSigner } from 'wagmi'

import { getAirdropContractWithSigner } from '../../lib/config'
import { INSERT_COMMUNITY_ONE } from '../../graphql/mutations'
import { randomBigInt } from '../../lib/zkp/util'
import { toHex } from '../../lib/zkp/Library'
import CommunityCard from './communityCard'
import { ICommunity } from '../../types'
import Button from '../util/button'

interface IProps {}

type IState = Omit<ICommunity, 'created_at' | 'updated_at' | 'id'>

export default function CreateSubmission({}: IProps) {
  const [insertCommunity] = useMutation(INSERT_COMMUNITY_ONE)
  const { data: signer } = useSigner()

  const [formState, setFormState] = useState<IState>({
    name: 'Twitter OGs',
    description: 'Made for the Twitter Open Graphs community.',
    requirement: 'Must post a link to your reply to a @twitter_og_bot tweet prior to 2022.',
    icon_image_url: 'https://cdn-icons-png.flaticon.com/512/124/124021.png',
    banner_image_url:
      'https://daocentral.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdaojones%2Fimage%2Fupload%2Fv1637755736%2FCleanShot_2021-11-24_at_04.08.33_pxl0kp.png&w=3840&q=75',
    hash: toHex(randomBigInt(31)),
  })

  const handleChange = (event: React.BaseSyntheticEvent) =>
    setFormState({ ...formState, [event.target.name]: event.target.value })

  const onSubmitClick = async () => {
    const hash = toHex(randomBigInt(31))
    const newCommunity = {
      ...formState,
      hash,
    }

    try {
      await insertCommunity({ variables: { newCommunity } })
        // Handle successful response
        .then((res) => toast.success('Submitted new community, pending approval.'))
    } catch (err) {
      toast.error(`Failed to submit community to database! ${err}`)
      return
    }

    try {
      if (!signer) return toast.error('Not signed in with Ethereum!')
      let airdropContract = getAirdropContractWithSigner(signer)
      let tx = await airdropContract.registerCommunity(formState.name)
      await tx.wait().then(() => toast.success('Added community to smart contract.'))
    } catch (err) {
      toast.error(`Failed to add community to smart contract! ${err}`)
      return
    }
  }

  const inputClassName = 'rounded border mb-2 border-gray-300'

  return (
    <div className="flex space-x-8 mx-4">
      <div className="flex flex-col w-96 p-4 border border-gray-300 rounded">
        <h1 className="text-2xl mb-2 font-bold">Create a community.</h1>

        <label className="mt-2">Name</label>
        <input
          className={inputClassName}
          type="text"
          name="name"
          placeholder="Crypto Twitter OGs"
          value={formState.name}
          required
          onChange={handleChange}
        />

        <label className="mt-2">Description</label>
        <input
          className={inputClassName}
          type="text"
          placeholder="The Crypto Twitter OGs community is a community of people who are interested in the crypto space."
          name="description"
          value={formState.description}
          required
          onChange={handleChange}
        />

        <label className="mt-2">Requirement</label>
        <input
          className={inputClassName}
          type="text"
          placeholder="You must provide a link to a reply to one of my tweets on the account @crypto_twitter_ogs."
          name="requirement"
          value={formState.requirement}
          required
          onChange={handleChange}
        />

        <label className="mt-2">Icon Image URL</label>
        <input
          className={inputClassName}
          type="text"
          placeholder="https://example.com/icon.png"
          name="icon_image_url"
          value={formState.icon_image_url}
          onChange={handleChange}
        />

        <label className="mt-2">Banner Image URL</label>
        <input
          className={inputClassName}
          type="text"
          placeholder="https://example.com/icon.png"
          name="banner_image_url"
          value={formState.banner_image_url}
          onChange={handleChange}
        />

        <Button classOverrides="mt-2" onClick={onSubmitClick}>
          Submit
        </Button>
      </div>

      <div className="flex flex-col w-96 p-4 border border-gray-300 rounded">
        <h1 className="text-2xl mb-4 font-bold">Preview</h1>
        <CommunityCard community={formState} />
      </div>
    </div>
  )
}
