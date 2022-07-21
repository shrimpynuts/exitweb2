import { ICommunity } from '../../types'

interface IProps {
  community: Omit<ICommunity, 'created_at' | 'updated_at' | 'id'>
  withRequirement?: boolean
}

export default function CommunityCard({ community, withRequirement = true }: IProps) {
  return (
    <div className="flex flex-col h-full w-full rounded-lg border border-gray-300 overflow-hidden">
      <img className="w-full -mb-12 h-36 object-cover" src={community.banner_image_url} />
      <div className="p-4 h-full flex flex-col">
        <img className="w-16 h-16 rounded-full border-4 border-white" src={community.icon_image_url} />
        <h1 className="text-xl font-bold">{community.name}</h1>
        <h3 className="mt-2 mb-2">{community.description}</h3>
        {withRequirement && <p className="text-sm italic mt-auto">Requirement: {community.requirement}</p>}
      </div>
    </div>
  )
}

export function CommunityCardSmall({ community }: IProps) {
  return (
    <div className="flex h-full w-full rounded-lg border border-gray-300 overflow-hidden">
      <img className="w-20 -mr-20 object-cover" src={community.banner_image_url} />
      <div className="px-4 py-2 w-full flex items-center justify-between ">
        <img className="w-12 h-12 rounded-full border-4 border-white" src={community.icon_image_url} />
        <h1 className="text-xl font-bold text-right w-80 ">{community.name}</h1>
      </div>
    </div>
  )
}

export function CommunityCardSmallVertical({ community }: IProps) {
  return (
    <div className="flex flex-col h-full w-full rounded-lg border border-gray-300 overflow-hidden">
      <img className="w-full -mb-12 h-24 object-cover" src={community.banner_image_url} />
      <div className="p-4 h-full flex flex-col">
        <img className="w-16 h-16 rounded-full border-4 border-white" src={community.icon_image_url} />
        <h1 className="text-xl font-bold">{community.name}</h1>
        <h3 className="mt-2 mb-2">{community.description}</h3>
      </div>
    </div>
  )
}

export function CommunityCardForChat({ community }: IProps) {
  return (
    <div className="flex flex-col h-full w-full border border-gray-300 overflow-hidden rounded-t-lg ">
      <img className="w-full -mb-12 h-24 object-cover" src={community.banner_image_url} />
      <div className="py-0 px-4 h-full flex flex-col">
        <img className="w-16 h-16 rounded-full border-4 border-white" src={community.icon_image_url} />
        <h1 className="text-xl font-bold">{community.name}</h1>
        <h3 className="mt-1 mb-2 ">{community.description}</h3>
      </div>
    </div>
  )
}
