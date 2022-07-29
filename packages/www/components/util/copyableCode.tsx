import classNames from 'classnames'
import React from 'react'
import toast from 'react-hot-toast'

import useClipboard from 'react-use-clipboard'

interface IProps {
  text: string
  display?: string
  truncateDisplay?: number
  inline?: boolean
}

export default function CopyCode({ text, display, truncateDisplay, inline = false }: IProps) {
  const [_, setCopied] = useClipboard(text, { successDuration: 1000 })

  const onClick = () => {
    setCopied()
    toast.success('Copied to clipboard')
  }

  const show = display ? display : text
  const truncatedDisplay = truncateDisplay ? `${show.slice(0, truncateDisplay)}...` : show

  return (
    <code
      onClick={onClick}
      className={classNames('truncate cursor-pointer code p-2 bg-gray-100 rounded-lg my-2', {
        inline: inline,
      })}
    >
      {truncatedDisplay}
    </code>
  )
}
