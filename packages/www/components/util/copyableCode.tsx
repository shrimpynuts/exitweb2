import React from 'react'
import toast from 'react-hot-toast'

import useClipboard from 'react-use-clipboard'

interface IProps {
  text: string
}

export default function CopyCode({ text }: IProps) {
  const [_, setCopied] = useClipboard(text, { successDuration: 1000 })

  const onClick = () => {
    setCopied()
    toast.success('Copied to clipboard')
  }

  return (
    <div onClick={onClick} className="truncate cursor-pointer code p-2 bg-gray-100 rounded my-2">
      {text}
    </div>
  )
}
