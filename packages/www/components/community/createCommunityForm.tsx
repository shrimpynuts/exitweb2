import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { useContractRead, useSigner } from 'wagmi'

import { AIRDROP_CONTRACT_DATA, getAirdropContractWithSigner } from '../../lib/config'
import { INSERT_COMMUNITY_ONE, DELETE_COMMUNITY_BY_ID } from '../../graphql/mutations'
import Button from '../util/button'
import { Widget } from '@uploadcare/react-widget'
import { NewCommunity } from './createCommunity'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect, useRef } from 'react'

interface IProps {
  onSuccess: (community: NewCommunity) => void
  formState: NewCommunity
  setFormState: (formState: NewCommunity) => void
}

export default function CreateCommunityForm({ onSuccess, formState, setFormState }: IProps) {
  const [deleteCommunity] = useMutation(DELETE_COMMUNITY_BY_ID)
  const [insertCommunity] = useMutation(INSERT_COMMUNITY_ONE)
  const { data: signer } = useSigner()
  const { openConnectModal } = useConnectModal()

  const { data: numContractCommunities } = useContractRead({
    ...AIRDROP_CONTRACT_DATA,
    functionName: 'totalCommunities',
    select: (data) => data.toNumber(),
  })

  const inputEl = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputEl.current && inputEl.current?.focus()
  }, [])

  const handleInputChange = (event: React.BaseSyntheticEvent) =>
    setFormState({ ...formState, [event.target.name]: event.target.value })

  const onSubmitClick = async () => {
    // Calculate contract_id
    const contract_id = Number(numContractCommunities)
    if (numContractCommunities === undefined || contract_id === undefined) {
      return toast.error('Error connecting to smart contract!')
    }
    const newCommunity = { ...formState, contract_id }
    if (!signer) {
      return openConnectModal && openConnectModal()
    }

    // Add community to database
    try {
      const { data } = await insertCommunity({ variables: { newCommunity } })
      const newCommunityId = data.insert_community_one.id
      console.log('Inserted community with id ', newCommunityId)

      // Add community to airdrop contract
      try {
        let airdropContract = getAirdropContractWithSigner(signer)
        let tx = await airdropContract.registerCommunity(formState.name)
        toast
          .promise(tx.wait(), {
            loading: 'Confirming transaction...',
            success: 'Successfully added community to smart contract!',
            error: 'Failed to add community to contract!',
          })
          .then(() => onSuccess(newCommunity))
      } catch (err: any) {
        // If we've added the community to our database, but couldn't add it to the smart contract,
        // we should delete the community from the database.
        deleteCommunity({ variables: { id: newCommunityId } })
          .then(() => console.log('Deleted community with id', newCommunityId))
          .catch((err) => console.error(`Failed to delete failed community id ${newCommunityId}, ${err}`))

        console.error({ err })
        if (err.code === 4001) return toast.error('Transaction rejected!')
        return toast.error(`Failed to add community to smart contract!`)
      }
    } catch (err: any) {
      console.error({ err })
      if (err.message.includes('unique constraint "community_slug_key"')) {
        return toast.error('Community with that slug already exists! Please choose a different slug.')
      }
      return toast.error(`Failed to submit community to database!`)
    }
  }

  const inputClassName = 'rounded border mb-2 border-gray-300 hover:'
  const windowUrl = process.env.NODE_ENV === 'development' ? 'localhost:3000/' : 'https://www.exitweb2.xyz/'

  return (
    <div className="flex flex-col w-96 p-4 border border-gray-300 rounded bg-gray-100">
      <h1 className="text-2xl mb-2 font-bold">Create a community.</h1>

      <label className="my-2 font-semibold">Name</label>
      <input
        className={inputClassName}
        ref={inputEl}
        type="text"
        name="name"
        placeholder="The name of your community"
        value={formState.name}
        required
        onChange={handleInputChange}
      />

      <label className="my-2 font-semibold">
        Slug{' '}
        <span className="italic text-xs font-normal">
          ({windowUrl}
          {formState.slug})
        </span>
      </label>
      <input
        className={inputClassName}
        type="text"
        name="slug"
        placeholder="The unique slug for the community's URL"
        value={formState.slug}
        required
        onChange={handleInputChange}
      />

      <label className="my-2 font-semibold">Description</label>
      <textarea
        className={inputClassName}
        rows={3}
        placeholder="The general description of what the community is about."
        name="description"
        value={formState.description}
        required
        onChange={handleInputChange}
      />

      <label className="my-2 font-semibold">Requirement</label>
      <textarea
        className={inputClassName}
        rows={3}
        placeholder="The requirement for new members to join. (e.g. 'Provide a link to a tweet')"
        name="requirement"
        value={formState.requirement}
        required
        onChange={handleInputChange}
      />

      <label className="my-2 font-semibold">Icon Image</label>
      <Widget
        publicKey="d1944ff5dd0b82f570fa"
        onChange={(file) => {
          if (file) {
            if (file.cdnUrl === null) return toast.error('Could not upload file. Please try again.')
            setFormState({ ...formState, icon_image_url: file.cdnUrl })
          }
        }}
      />

      <label className="my-2 font-semibold">Banner Image</label>
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
  )
}
