import { useState } from 'react'

import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { useContractRead, useSigner } from 'wagmi'

import { AIRDROP_CONTRACT_DATA, getAirdropContractWithSigner } from '../../lib/config'
import { INSERT_COMMUNITY_ONE, DELETE_COMMUNITY_BY_ID } from '../../graphql/mutations'
import { randomBigInt } from '../../lib/zkp/util'
import { toHex } from '../../lib/zkp/Library'
import CommunityCard, { CommunityCardSmall, CommunityCardSmallVertical } from './communityCard'
import { ICommunity } from '../../types'
import Button from '../util/button'
import { Widget } from '@uploadcare/react-widget'
import { useRouter } from 'next/dist/client/router'

interface IProps {}

type IState = Omit<ICommunity, 'created_at' | 'updated_at' | 'id'>

export default function CreateCommunity({}: IProps) {
  const [deleteCommunity] = useMutation(DELETE_COMMUNITY_BY_ID)
  const [insertCommunity] = useMutation(INSERT_COMMUNITY_ONE)
  const { data: signer } = useSigner()

  const router = useRouter()

  const [formState, setFormState] = useState<IState>({
    name: 'Twitter OGs',
    description: 'Made for the Twitter Open Graphs community.',
    requirement: 'Must post a link to your reply to a @twitter_og_bot tweet prior to 2022.',
    icon_image_url: 'https://cdn-icons-png.flaticon.com/512/124/124021.png',
    banner_image_url:
      'https://daocentral.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdaojones%2Fimage%2Fupload%2Fv1637755736%2FCleanShot_2021-11-24_at_04.08.33_pxl0kp.png&w=3840&q=75',
    key: toHex(randomBigInt(31)),
    slug: 'twitter-og',
  })

  const { data: numContractCommunities } = useContractRead({
    ...AIRDROP_CONTRACT_DATA,
    functionName: 'totalCommunities',
    select: (data) => data.toNumber(),
  })

  const handleChange = (event: React.BaseSyntheticEvent) =>
    setFormState({ ...formState, [event.target.name]: event.target.value })

  const onSubmitClick = async () => {
    // Calculate contract_id
    const contract_id = numContractCommunities
    const newCommunity = { ...formState, contract_id }

    // Add community to database
    try {
      const { data } = await insertCommunity({ variables: { newCommunity } })
      const newCommunityId = data.insert_community_one.id
      console.log('Inserted community with id ', newCommunityId)

      // Add community to airdrop contract
      try {
        if (!signer) return toast.error('Not signed in with Ethereum!')
        let airdropContract = getAirdropContractWithSigner(signer)
        let tx = await airdropContract.registerCommunity(formState.name)
        await tx
          .wait()
          .then(() => toast.success('Added community to smart contract.'))
          .then(() => router.push(`/community/${formState.slug}`))
      } catch (err) {
        // If we've added the community to our database, but couldn't add it to the smart contract,
        // we should delete the community from the database.
        deleteCommunity({ variables: { id: newCommunityId } })
          .then(() => console.log('Deleting community with id '))
          .catch((err) => console.log(`Failed to delete failed community id ${newCommunityId}, ${err}`))

        return toast.error(`Failed to add community to smart contract! ${err}`)
      }
    } catch (err: any) {
      console.log({ err })
      if (err.message.includes('unique constraint "community_slug_key"')) {
        return toast.error('Community with that slug already exists!')
      }
      return toast.error(`Failed to submit community to database! ${err}`)
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

        <label className="mt-2">Slug</label>
        <input
          className={inputClassName}
          type="text"
          name="slug"
          placeholder=""
          value={formState.slug}
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

        <label className="mt-2">Icon Image</label>
        <Widget
          publicKey="d1944ff5dd0b82f570fa"
          onChange={(file) => {
            if (file) {
              if (file.cdnUrl === null) return toast.error('Could not upload file. Please try again.')
              setFormState({ ...formState, icon_image_url: file.cdnUrl })
            }
          }}
        />

        <label className="mt-2">Banner Image</label>
        <Widget
          publicKey="d1944ff5dd0b82f570fa"
          onChange={(file) => {
            if (file) {
              if (file.cdnUrl === null) return toast.error('Could not upload file. Please try again.')
              setFormState({ ...formState, banner_image_url: file.cdnUrl })
            }
          }}
        />

        <Button classOverrides="mt-4" onClick={onSubmitClick}>
          Submit
        </Button>
      </div>

      <div className="flex flex-col w-96 p-4 border border-gray-300 rounded">
        <h1 className="text-2xl mb-2 font-bold">Preview</h1>
        <CommunityCard community={formState} />
        <div className="mt-2 border border-gray-300 rounded-lg">
          <CommunityCardSmall community={formState} />
        </div>
      </div>
    </div>
  )
}
