import Link from 'next/link'
import { ICommunity } from '../../types'
import { SlowShow } from '../util/slowShow'
import { CommunityCardSmallVertical, CommunityCardSmall, CommunityCardSmallSkeleton } from './communityCard'
import { motion } from 'framer-motion'

interface IProps {
  popularCommunities: ICommunity[]
  growingCommunities: ICommunity[]
  newestCommunities: ICommunity[]
}
export default function CommunityList({ popularCommunities, growingCommunities, newestCommunities }: IProps) {
  return (
    <div className="flex flex-col md:flex-row space-x-4">
      <SingleCommunityListVertical communities={popularCommunities} title="Popular Communities 🔥" />
      <SingleCommunityListVertical communities={growingCommunities} title="Growing Communities 📈" />
      <SingleCommunityListVertical communities={newestCommunities} title="Newest Communities ✨" />
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
            {[...Array(10)].map(() => (
              <CommunityCardSmallSkeleton />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export function SingleCommunityListHorizontal({ communities }: Omit<ISingleCommuntyListProps, 'title'>) {
  return (
    <div className="py-8 px-8 md:max-w-6xl mx-auto flex flex-col overflow-hidden">
      <SlowShow step={4}>
        <h3 className="self-start text-2xl mb-2 font-semibold">Trending communities</h3>
      </SlowShow>
      <SlowShow step={5}>
        <motion.ul variants={container} initial="hidden" animate="visible">
          <div className="flex flex-row space-x-2">
            {communities?.map((community, i) => (
              <Link href={`/community/${community.slug}`} key={i}>
                <motion.li key={i} className="w-64 cursor-pointer" variants={item}>
                  <CommunityCardSmallVertical community={community} withRequirement={false} />
                </motion.li>
              </Link>
            ))}
          </div>
        </motion.ul>
      </SlowShow>
      <a className="text-right self-end text-sm mt-2 font-semibold text-gray-600 hover:text-gray-800">
        <SlowShow step={6}>
          <Link href="/join-community">Explore all communities</Link>
        </SlowShow>
      </a>
    </div>
  )
}
