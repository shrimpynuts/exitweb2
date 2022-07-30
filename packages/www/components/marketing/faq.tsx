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
        <div
          className={classNames('transform transition-all duration-150 ease-in-out ', {
            'rotate-0': !isOpen,
            'rotate-180': isOpen,
          })}
        >
          <ChevronDown />
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
    <div className="py-4 px-2">
      <div className="mx-auto flex flex-col md:flex-row">
        <h2 className="mr-8 w-full text-2xl font-bold pb-4">Frequently-asked questions</h2>
        <dl className="flex flex-col space-y-6 px-2">
          <SingleFAQ
            question="What is the definition of Lorem Ipsum?"
            answer="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          />
          <SingleFAQ
            question="What is the definition of Lorem Ipsum?"
            answer="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          />
          <SingleFAQ
            question="What is the definition of Lorem Ipsum?"
            answer="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          />
          <SingleFAQ
            question="What is the definition of Lorem Ipsum?"
            answer="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          />
        </dl>
      </div>
    </div>
  )
}

export default FAQ
