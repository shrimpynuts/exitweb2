import { useMutation, useQuery } from '@apollo/client'
import classNames from 'classnames'
import moment from 'moment'
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'

import { GET_MESSAGES_BY_COMMUNITY } from '../../graphql/queries'
import { CommunityCardForChat } from '../community/communityCard'
import { COMMUNITY_TOKEN_ABI } from '../../lib/config'
import { ICommunity, IMessage } from '../../types'
import Lock from '../svg/lock'
import { INSERT_MESSAGE_ONE } from '../../graphql/mutations'
import toast from 'react-hot-toast'

interface IProps {
  community: ICommunity
  communityTokenAddress: string
}

export default function CommunityChat({ community, communityTokenAddress }: IProps) {
  const { address, isConnected } = useAccount()
  const [insertMessage] = useMutation(INSERT_MESSAGE_ONE)
  const [draft, setDraft] = useState<string>('')

  // Fetch all messages for this community
  const { data, refetch } = useQuery(GET_MESSAGES_BY_COMMUNITY, { variables: { community_id: community.id } })
  const messages: IMessage[] = data?.messages || []

  // Some ref's to manipulate scroll position
  const messageEndRef = useRef<HTMLInputElement>(null)
  const inputEl = useRef<HTMLInputElement>(null)

  // Determine whether the current signer is a member of this community by fetching token balance from contract
  const { data: contractData } = useContractRead({
    addressOrName: communityTokenAddress,
    contractInterface: COMMUNITY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address, community.contract_id],
  })
  const isOwner = contractData ? contractData.toNumber() > 0 : false

  const onEnter: KeyboardEventHandler = (e) => {
    if (draft && e.key === 'Enter') {
      if (!isConnected || !address) return toast.error('Not signed in!')
      const newMessage = { from: address, text: draft, community_id: community.id }
      insertMessage({ variables: { newMessage } }).then(() => refetch())
      setDraft('')
    }
  }

  useEffect(() => {
    inputEl.current && inputEl.current?.focus()
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const formatAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-2)}`

  // Component to render a single message
  const Message = ({ message, isThreadContinuation }: { message: IMessage; isThreadContinuation: boolean }) => {
    const fromName = message.from === address ? 'You' : formatAddress(message.from)
    return (
      <div className="w-full flex justify-between items-center">
        <div className={classNames('w-80 flex items-center space-x-4', { 'mt-2': !isThreadContinuation })}>
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

  return (
    <>
      {!isOwner && (
        <div className="blur-none text-center text-2xl absolute z-10 w-96 mx-auto left-0 right-0 mt-32 select-none cursor-not-allowed">
          <div className="border border-gray-300 rounded-xl bg-gray-50 py-6 px-4 shadow-md text-gray-700 tracking-tighter">
            <div className="text-center mx-auto w-8 ">
              <Lock />
            </div>
            Not a member of this community!
          </div>
        </div>
      )}
      <div
        className={classNames('border border-gray-300 rounded-lg overflow-hidden', {
          'select-none cursor-not-allowed': !isOwner,
        })}
        style={!isOwner ? { filter: 'blur(4px)' } : {}}
      >
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
            className={classNames('border-0 bg-gray-100 px-6 py-2 w-full focus:outline-0 focus:ring-0', {
              'select-none cursor-not-allowed': !isOwner,
            })}
            placeholder="Write a message..."
            value={draft}
            onChange={(e: React.BaseSyntheticEvent) => setDraft(e.target.value)}
            autoFocus
            onKeyPress={onEnter}
            autoComplete="off"
            disabled={!isOwner}
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
