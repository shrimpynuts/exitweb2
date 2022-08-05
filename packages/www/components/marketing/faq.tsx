import classNames from 'classnames'
import { useState } from 'react'
import ChevronDown from '../svg/chevron-down'

interface ISingleFAQProps {
  question: string
  answer: string
  initialState?: boolean
}

function SingleFAQ({ question, answer, initialState }: ISingleFAQProps) {
  const [isOpen, setIsOpen] = useState(initialState || false)
  return (
    <div>
      <dt className="cursor-pointer flex justify-between w-full" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-xl font-semibold pb-2">{question}</h3>
        <div>
          <div
            className={classNames('transform transition-all duration-150 ease-in-out origin-center', {
              'rotate-0': !isOpen,
              'rotate-180': isOpen,
            })}
          >
            <ChevronDown />
          </div>
        </div>
      </dt>
      <dd
        className={classNames('overflow-hidden transition-all duration-150 ease-in-out ', {
          'h-0': !isOpen,
          'h-full': isOpen,
        })}
      >
        <p>{answer}</p>
      </dd>
    </div>
  )
}

function FAQ() {
  return (
    <div className="p-8 border border-gray-300 rounded bg-gray-100">
      <div className="mx-auto flex flex-col md:flex-row">
        <h2 className="mr-8 w-full text-2xl font-bold pb-4">Frequently-asked questions</h2>
        <dl className="flex flex-col space-y-4 px-2">
          <SingleFAQ
            question="What does the platform know about me?"
            answer="We know the mapping between your user id used to generate your community NFT and the social media username that you use to enter the community. However, we delete this information immediately after you claim your NFT, so if you lose access to your community NFT, you will have to repeat the process again."
          />
          <SingleFAQ
            question="How do the zk-proofs work and how is my identity pseudonymous?"
            answer="Link to the repo."
          />
          <SingleFAQ
            question="Can anyone read my chats with my community if they are not part of it?"
            answer="No, the chats cannot be read by us or anyone who doesn't belong to the community"
          />
          <SingleFAQ
            question="What information about me does the platform store after I claim my community NFT?"
            answer="Nothing. Any information we know is publicly accessible on the Ethereum blockchain."
          />
        </dl>
      </div>
    </div>
  )
}

export default FAQ
