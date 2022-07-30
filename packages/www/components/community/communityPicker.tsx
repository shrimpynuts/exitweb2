import classNames from 'classnames'

import { ICommunity } from '../../types'
import CommunityCard, { CommunityCardSmall, CommunityCardSmall } from './communityCard'

interface IProps {
  communities: ICommunity[]
  selectedCommunity: ICommunity | undefined
  setSelectedCommunity: (community: ICommunity | undefined) => void
}

export default function CommunityPicker({ communities, selectedCommunity, setSelectedCommunity }: IProps) {
  return (
    <div>
      {communities && communities.length > 0 ? (
        <div className="grid mx-4 grid-cols-1 md:grid-cols-3">
          {communities.map((community, i) => (
            <div
              className={classNames('m-2 duration-100 ease-out cursor-pointer transform hover:scale-105', {
                ' bg-blue-50': community == selectedCommunity,
              })}
              onClick={() =>
                community == selectedCommunity ? setSelectedCommunity(undefined) : setSelectedCommunity(community)
              }
              key={i}
            >
              <CommunityCard community={community} withRequirement={false} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1 className="text-center py-8">No communities found :/</h1>
        </div>
      )}
    </div>
  )
}

export function CommunityPickerSmall({ communities, selectedCommunity, setSelectedCommunity }: IProps) {
  return (
    <div>
      {communities && communities.length > 0 ? (
        <div className="flex flex-col w-80 border-b rounded">
          {communities.map((community, i) => (
            <div
              className={classNames('py-1 duration-100 ease-out cursor-pointer hover:bg-blue-200 ', {
                ' bg-blue-100': community == selectedCommunity,
              })}
              onClick={() =>
                community == selectedCommunity ? setSelectedCommunity(undefined) : setSelectedCommunity(community)
              }
              key={i}
            >
              <CommunityCardSmall community={community} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1 className="text-center py-8">No communities found :/</h1>
        </div>
      )}
    </div>
  )
}
