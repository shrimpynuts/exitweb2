import Link from 'next/link'
import { ICommunity } from '../../types'
import { CommunityCardTiny } from './communityCard'

interface IProps {
  popularCommunities: ICommunity[]
  growingCommunities: ICommunity[]
  newestCommunities: ICommunity[]
}
export default function CommunityList({ popularCommunities, growingCommunities, newestCommunities }: IProps) {
  return (
    <div className="flex flex-col md:flex-row space-x-4">
      <SingleCommunityList communities={popularCommunities} title="Popular Communities 🔥" />
      <SingleCommunityList communities={popularCommunities} title="Growing Communities 📈" />
      <SingleCommunityList communities={popularCommunities} title="Newest Communities ✨" />
    </div>
  )
}

interface ISingleCommuntyListProps {
  communities: ICommunity[]
  title: string
}

function SingleCommunityList({ communities, title }: ISingleCommuntyListProps) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-1">{title}</h2>
      <div className="flex flex-col space-y-0 border border-gray-300 rounded-lg md:w-80">
        {communities && communities.length > 0 ? (
          <>
            {communities.map((community, i) => (
              <Link href={`/community/${community.slug}`} key={i}>
                <div className=" cursor-pointer hover:bg-gray-100 ">
                  <CommunityCardTiny community={community} withRequirement={false} />
                </div>
              </Link>
            ))}
          </>
        ) : (
          <div>
            <h1 className="text-center py-8">No communities found :/</h1>
          </div>
        )}
      </div>
    </div>
  )
}
