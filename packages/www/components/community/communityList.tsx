import Link from 'next/link'
import { ICommunity } from '../../types'
import { CommunityCardSmallVertical, CommunityCardSmall } from './communityCard'

interface IProps {
  popularCommunities: ICommunity[]
  growingCommunities: ICommunity[]
  newestCommunities: ICommunity[]
}
export default function CommunityList({ popularCommunities, growingCommunities, newestCommunities }: IProps) {
  return (
    <div className="flex flex-col md:flex-row space-x-4">
      <SingleCommunityListVertical communities={popularCommunities} title="Popular Communities 🔥" />
      <SingleCommunityListVertical communities={popularCommunities} title="Growing Communities 📈" />
      <SingleCommunityListVertical communities={popularCommunities} title="Newest Communities ✨" />
    </div>
  )
}

interface ISingleCommuntyListProps {
  communities: ICommunity[]
  title: string
}

function SingleCommunityListVertical({ communities, title }: ISingleCommuntyListProps) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-1">{title}</h2>
      <div className="flex flex-col space-y-0 border border-gray-300 rounded-lg md:w-80">
        {communities && communities.length > 0 ? (
          <>
            {communities.map((community, i) => (
              <Link href={`/community/${community.slug}`} key={i}>
                <div className=" cursor-pointer hover:bg-gray-100 ">
                  <CommunityCardSmall community={community} withRequirement={false} />
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

export function SingleCommunityListHorizontal({ communities }: Omit<ISingleCommuntyListProps, 'title'>) {
  return (
    <div className="flex flex-row space-x-2 ">
      {communities && communities.length > 0 ? (
        <>
          {communities.map((community, i) => (
            <Link href={`/community/${community.slug}`} key={i}>
              <div className=" cursor-pointer hover:bg-gray-100 w-64 ">
                <CommunityCardSmallVertical community={community} withRequirement={false} />
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
  )
}
