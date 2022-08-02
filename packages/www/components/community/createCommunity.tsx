import { useState } from 'react'

import { randomBigInt } from '../../lib/zkp/util'
import { toHex } from '../../lib/zkp/Library'
import CommunityCard, { CommunityCardSmall } from './communityCard'
import { ICommunity } from '../../types'
import CreateCommunityForm from './createCommunityForm'
import SuccessBadge from '../svg/success-badge'
import Button from '../util/button'
import { SlowShow } from '../util/slowShow'

interface IProps {}

export type NewCommunity = Omit<ICommunity, 'created_at' | 'updated_at' | 'id'>

export default function CreateCommunity({}: IProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [formState, setFormState] = useState<NewCommunity>({
    name: 'Twitter OGs',
    description: 'Made for the Twitter Open Graphs community.',
    requirement: 'Must post a link to your reply to a @twitter_og_bot tweet prior to 2022.',
    icon_image_url: 'https://cdn-icons-png.flaticon.com/512/124/124021.png',
    banner_image_url:
      'https://daocentral.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdaojones%2Fimage%2Fupload%2Fv1637755736%2FCleanShot_2021-11-24_at_04.08.33_pxl0kp.png&w=3840&q=75',
    key: toHex(randomBigInt(31)),
    slug: 'twitter-og',
  })

  return (
    <>
      {isSuccess ? (
        <SlowShow step={6}>
          <div className="flex flex-col w-2/3 p-8 border border-gray-300 rounded mx-auto bg-gray-100 mt-48 shadow">
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

          <SlowShow step={8}>
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
