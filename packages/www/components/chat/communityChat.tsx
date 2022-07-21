import { useQuery } from '@apollo/client'
import classNames from 'classnames'
import moment from 'moment'
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'

import { GET_SUBMISSIONS_FOR_COMMUNITY } from '../../graphql/queries'
import { CommunityCardForChat } from '../community/communityCard'
import { COMMUNITY_TOKEN_ABI } from '../../lib/config'
import { ICommunity, IMessage } from '../../types'
import Lock from '../svg/lock'

interface IProps {
  community: ICommunity
  communityTokenAddress: string
}

export default function CommunityChat({ community, communityTokenAddress }: IProps) {
  const { data, refetch } = useQuery(GET_SUBMISSIONS_FOR_COMMUNITY, { variables: { id: community.id } })
  const { address, isConnected } = useAccount()
  const defaultMessages: IMessage[] = [
    {
      updated_at: new Date().toString(),
      created_at: new Date().toString(),

      id: '1',
      text: 'Hello!',
      from: '0x1234567890123456789012345678901234567890',
      community_id: '0x1234567890123456789012345678901234567890',
    },
    {
      updated_at: new Date().toString(),
      created_at: new Date().toString(),

      id: '1',
      text: 'Messaging stuff is hard.',
      from: '0x1234567890123456789012345678901234567890',
      community_id: '0x1234567890123456789012345678901234567890',
    },
    {
      updated_at: new Date().toString(),
      created_at: new Date().toString(),

      id: '1',
      text: 'This is me!',
      from: String(address),
      community_id: '0x1234567890123456789012345678901234567890',
    },
    {
      updated_at: new Date().toString(),
      created_at: new Date().toString(),

      id: '1',
      text: 'Messaging stuff',
      from: '0x1234567890123456789012345678901234567890',
      community_id: '0x1234567890123456789012345678901234567890',
    },
    {
      updated_at: new Date().toString(),
      created_at: new Date().toString(),

      id: '1',
      text: 'Messaging stuff',
      from: String(address),
      community_id: '0x1234567890123456789012345678901234567890',
    },
  ]
  const [messages, setMessages] = useState<IMessage[]>(defaultMessages)
  const [draft, setDraft] = useState<string>()

  const { data: contractData } = useContractRead({
    addressOrName: communityTokenAddress,
    contractInterface: COMMUNITY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address, community.contract_id],
  })

  const onEnter: KeyboardEventHandler = (e) => {
    if (draft && e.key === 'Enter') {
      setMessages([
        ...messages,
        {
          id: '1',
          text: draft,
          from: String(address),
          community_id: community.id,
          updated_at: new Date().toString(),
          created_at: new Date().toString(),
        },
      ])
      setDraft('')
    }
  }

  const messageEndRef = useRef<HTMLInputElement>(null)
  const inputEl = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputEl.current && inputEl.current?.focus()
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-2)}`
  }

  interface IMessageProps {
    message: IMessage
    isThreadContinuation: boolean
  }
  const Message = ({ message, isThreadContinuation }: IMessageProps) => {
    const fromName = message.from === address ? 'You' : formatAddress(message.from)
    return (
      <div className="w-full flex justify-between items-center">
        <div
          className={classNames('w-80 flex items-center space-x-4', {
            'mt-2': !isThreadContinuation,
          })}
        >
          <div className="w-10">
            {!isThreadContinuation && (
              <img
                className="w-10 h-10 rounded-full self-end mt-4"
                src={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
              />
            )}
          </div>

          <div className="flex flex-col text-sm">
            {!isThreadContinuation && <span className="font-semibold">{fromName}</span>}
            <div className="border border-gray-300 px-4 py-2 rounded-xl ">
              <p className="">{message.text}</p>
            </div>
          </div>
        </div>
        <span className="text-xs italic">{moment(message.created_at).format('h:mm a')}</span>
      </div>
    )
  }

  const isOwner = contractData ? contractData.toNumber() > 0 : false

  return (
    <>
      {!isOwner && (
        <div className="blur-none text-center text-2xl absolute z-10 w-96 mx-auto left-0 right-0 mt-56 ">
          <div className="border border-gray-300 rounded-xl bg-gray-50 py-6 px-4 shadow-md text-gray-700 tracking-tighter">
            <div className="text-center mx-auto w-8 ">
              <Lock />
            </div>
            Not a member of this community!
          </div>
        </div>
      )}
      <div
        className="border border-gray-300 rounded-lg overflow-hidden blurred"
        style={!isOwner ? { filter: 'blur(4px)' } : {}}
      >
        <CommunityCardForChat community={community} withRequirement={false} />
        <div className="flex flex-col h-96 space-y-1 p-4 -mr-4 overflow-y-scroll">
          {messages.map((message, i) => {
            const isThreadContinuation = i > 0 && message.from === messages[i - 1].from
            return <Message message={message} key={i} isThreadContinuation={isThreadContinuation} />
          })}
          <div ref={messageEndRef}></div>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            name="message"
            type="text"
            ref={inputEl}
            className="border-0 bg-gray-100 px-6 py-2 w-full focus:outline-0 focus:ring-0"
            placeholder="Write a message..."
            value={draft}
            onChange={(e: React.BaseSyntheticEvent) => setDraft(e.target.value)}
            autoFocus
            onKeyPress={onEnter}
            autoComplete="off"
          />
        </form>
        <style jsx>{`
          .blurred: {
            filter: blur(4px);
          }
        `}</style>
      </div>
    </>
  )
}
