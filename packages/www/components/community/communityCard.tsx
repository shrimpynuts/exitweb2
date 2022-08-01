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
        <img
          className="w-16 h-16 rounded-full border-4 border-white object-contain bg-white"
          src={community.icon_image_url}
        />
        <h1 className="text-xl font-bold">{community.name}</h1>
        <h3 className="mt-2 mb-2">{community.description}</h3>
        {withRequirement && <p className="text-sm italic mt-auto">Requirement: {community.requirement}</p>}
      </div>
    </div>
  )
}

export function CommunityCardSmallVertical({ community }: IProps) {
  return (
    <div className="flex flex-col h-full w-full rounded-lg border border-gray-300 overflow-hidden p-4 bg-white hover:bg-blue-50">
      <img className="w-full -mb-8 h-24 object-cover rounded-t-lg" src={community.banner_image_url} />
      <div className="h-full flex flex-col">
        <div className="px-2">
          <img
            className="w-14 h-14 rounded-full border-4 border-white object-contain bg-white"
            src={community.icon_image_url}
          />
        </div>
        <h1 className="text-md font-bold">{community.name}</h1>
        <h3 className="text-sm mt-2 mb-2">{community.description}</h3>
      </div>
    </div>
  )
}

export function CommunityCardSmall({ community }: IProps) {
  return (
    <div className="flex flex-row h-full w-full overflow-hidden rounded-lg px-2 py-1 space-x-2 hover:bg-blue-50">
      <img
        className="w-14 h-14 rounded-xl border-2 border-gray-300 object-contain bg-white"
        src={community.icon_image_url}
      />
      <div className="h-full flex flex-col flex-grow">
        <h1 className="text-md font-bold overflow-hidden text-ellipsis line-clamp-1">{community.name}</h1>
        <h3 className="text-xs overflow-hidden text-ellipsis line-clamp-2">{community.description}</h3>
      </div>
    </div>
  )
}

export function CommunityCardSmallSkeleton() {
  return (
    <div className="px-3 py-2 max-w-sm w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-xl bg-gray-200 h-14 w-14"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="grid grid-cols-4 gap-4">
            <div className="h-2 bg-gray-200 rounded col-span-3"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-gray-200 rounded col-span-2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
