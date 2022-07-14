import { useState } from 'react'
import classNames from 'classnames'

import { ICommunity } from '../../types'
import CommunityCard from './communityCard'

interface IProps {
  communities: ICommunity[]
  selectedCommunity: ICommunity | undefined
  setSelectedCommunity: (community: ICommunity | undefined) => void
}

export default function CommunityPicker({ communities, selectedCommunity, setSelectedCommunity }: IProps) {
  return (
    <div>
      {communities && communities.length > 0 ? (
        <div className="grid mx-4 space-y-4 md:space-y-0 grid-cols-1 md:grid-cols-3 md:space-x-4">
          {communities.map((community, i) => (
            <div
              className={classNames('h-full duration-100 ease-out cursor-pointer transform hover:scale-105', {
                ' bg-blue-50': community == selectedCommunity,
              })}
              onClick={() =>
                community == selectedCommunity ? setSelectedCommunity(undefined) : setSelectedCommunity(community)
              }
              key={i}
            >
              <CommunityCard community={community} />
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
