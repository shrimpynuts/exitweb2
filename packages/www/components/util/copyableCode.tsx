import classNames from 'classnames'
import React from 'react'
import toast from 'react-hot-toast'

import useClipboard from 'react-use-clipboard'

interface IProps {
  text: string
  inline?: boolean
}

export default function CopyCode({ text, inline = false }: IProps) {
  const [_, setCopied] = useClipboard(text, { successDuration: 1000 })

  const onClick = () => {
    setCopied()
    toast.success('Copied to clipboard')
  }

  return (
    <code
      onClick={onClick}
      className={classNames('block truncate cursor-pointer code p-2 bg-gray-100 rounded-lg my-2', {
        inline: inline,
      })}
    >
      {text}
    </code>
  )
}
