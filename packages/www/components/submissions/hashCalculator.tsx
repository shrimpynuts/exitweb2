import { useEffect, useState } from 'react'

import Button from '../util/button'
import { ICommunity } from '../../types'
import { pedersenHash, pedersenHashConcat, toHex } from '../../lib/zkp/Library'

interface IProps {
  community: ICommunity
}

interface IState {
  secret: string
  community_hash: string
}

export default function HashCalculator({ community }: IProps) {
  const [result, setResult] = useState<string>()
  const [formState, setFormState] = useState<IState>({
    secret: '',
    community_hash: community.hash,
  })

  useEffect(() => {
    const secretKey = localStorage.getItem(`exitweb2/community/${community.id}`) || ''
    setFormState({ ...formState, secret: secretKey })
  }, [])

  const handleChange = (event: React.BaseSyntheticEvent) =>
    setFormState({ ...formState, [event.target.name]: event.target.value })

  const onClick = async () => {
    console.log({ formState })
    setResult(toHex(pedersenHashConcat(BigInt(formState.community_hash), BigInt(formState.secret))))
  }

  return (
    <div className="flex flex-col w-96 mx-auto p-4 border border-gray-300 rounded">
      <label className="text-xl font-bold">Hash Calculator</label>
      <label className="mt-2">Secret</label>
      <input
        className="rounded border mt-2 mb-2 border-gray-300"
        required
        type="text"
        onFocus={(event: any) => event.target.select()}
        name="proof_of_interaction"
        value={formState.secret}
        onChange={handleChange}
      />
      <label className="">Community Hash</label>
      <input
        className="rounded border mt-2 mb-2 border-gray-300"
        required
        type="text"
        onFocus={(event: any) => event.target.select()}
        name="proof_of_interaction"
        value={formState.community_hash}
        onChange={handleChange}
      />
      <Button onClick={onClick}>Hash</Button>
      <div className="truncate mt-2">{result}</div>
    </div>
  )
}
