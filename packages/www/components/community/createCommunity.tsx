import { useState } from 'react'

import { randomBigInt } from '../../lib/zkp/util'
import { toHex } from '../../lib/zkp/Library'
import CommunityCard, { CommunityCardSmall } from './communityCard'
import { ICommunity } from '../../types'
import CreateCommunityForm from './createCommunityForm'
import SuccessBadge from '../svg/success-badge'
import Button from '../util/button'
import { SlowShow } from '../util/slowShow'
import Plus from '../svg/plus'
import Link from 'next/link'

interface IProps {}

export type NewCommunity = Omit<ICommunity, 'created_at' | 'updated_at' | 'id'>

export default function CreateCommunity({}: IProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [formState, setFormState] = useState<NewCommunity>({
    name: 'Elon Musk Fan Club',
    description: 'A community for early supporters of Elon Musk and his various ventures.',
    requirement: 'Must post a link to your tweet mentioning @elonmusk prior to 2020.',
    icon_image_url: 'https://ucarecdn.com/dbdaef6c-4614-4bb6-9329-ef2f82f41f6b/gettyimages1229892983square.jpeg',
    banner_image_url: 'https://ucarecdn.com/77e5ce9f-fe2e-4198-a819-76f063877794/download.jpeg',
    key: toHex(randomBigInt(31)),
    slug: 'elon-fan-club',
  })

  return (
    <>
      {isSuccess ? (
        <SlowShow step={6}>
          <div className="flex flex-col w-2/3 p-8 border border-gray-300 rounded mx-auto bg-gray-100 mt-24 shadow">
            <SuccessBadge className="mx-auto" />
            {/* <img
              className="mx-auto w-14 h-14 rounded-full border-4 border-gray-300 object-contain bg-white"
              src={formState.icon_image_url}
            /> */}
            <h1 className="text-2xl font-bold text-center mt-4">
              Created the <span className="text-blue-600 italic">{formState.name}</span> community!
            </h1>
            <div className="mx-auto mt-4">
              <Button>
                <a href={`/community/${formState.slug}`}>View Community Page</a>
              </Button>
            </div>
          </div>
        </SlowShow>
      ) : (
        <div className="flex space-x-8 mx-4">
          <SlowShow step={2}>
            <CreateCommunityForm
              onSuccess={(_newCommunity) => setIsSuccess(true)}
              formState={formState}
              setFormState={setFormState}
            />
          </SlowShow>

          <SlowShow step={4}>
            <div className="flex flex-col w-96 p-4 border border-gray-300 rounded bg-gray-100">
              <h1 className="text-2xl mb-2 font-bold">Preview</h1>
              <CommunityCard community={formState} />
              <div className="mt-2 border border-gray-300 rounded-lg">
                <CommunityCardSmall community={formState} noHoverBgColor />
              </div>
            </div>
          </SlowShow>
        </div>
      )}
    </>
  )
}

export const CreateCommunityButton = () => {
  return (
    <Link href="/create-community">
      <Button bgColor="bg-gray-700" classOverrides="text-sm">
        <div className="flex items-center space-x-2">
          <Plus /> &nbsp; Create a new community
        </div>
      </Button>
    </Link>
  )
}
