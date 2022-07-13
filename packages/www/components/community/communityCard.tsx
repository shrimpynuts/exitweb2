import { ICommunity } from '../../types'

interface IProps {
  community: Omit<ICommunity, 'created_at' | 'updated_at' | 'id'>
}

export default function CommunityCard({ community }: IProps) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-300 overflow-hidden">
      <img className="w-full -mb-12 h-36 object-cover" src={community.banner_image_url} />
      <div className="p-4">
        <img className="w-16 h-16 rounded-full border-4 border-white" src={community.icon_image_url} />
        <h1 className="text-xl font-bold">{community.name}</h1>
        <h3 className="mt-2">{community.description}</h3>
        <p className="text-sm mt-2 italic">Requirement: {community.requirement}</p>
      </div>
    </div>
  )
}
