import classNames from 'classnames'

import { ICommunity } from '../../types'
import { CommunityCardSmall } from './communityCard'

interface IProps {
  communities: ICommunity[]
  selectedCommunity: ICommunity | undefined
  setSelectedCommunity: (community: ICommunity | undefined) => void
  onHoverClass?: string
}

export default function CommunityPicker({
  communities,
  selectedCommunity,
  setSelectedCommunity,
  onHoverClass = 'bg-blue-200',
}: IProps) {
  return (
    <div>
      {communities && communities.length > 0 ? (
        <div className="flex flex-col w-80 border-b rounded">
          {communities.map((community, i) => (
            <div
              className={classNames(`py-1 duration-100 ease-out cursor-pointer hover:bg-blue-100`, {})}
              onClick={() =>
                community == selectedCommunity ? setSelectedCommunity(undefined) : setSelectedCommunity(community)
              }
              key={i}
            >
              <CommunityCardSmall noHoverBgColor community={community} />
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
