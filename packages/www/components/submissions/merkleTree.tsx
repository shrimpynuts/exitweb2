import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MerkleTree } from '../../lib/zkp/MerkleTree'
import { randomBigInt } from '../../lib/zkp/util'
import { ISubmission } from '../../types'
import Button from '../util/button'
import useClipboard from 'react-use-clipboard'

interface IProps {
  submissions: ISubmission[]
}

const DEFAULT_HEIGHT = 5

export default function AllSubmissions({ submissions }: IProps) {
  const [merkleTree, setMerkleTree] = useState<MerkleTree>()
  const [merkleTreeStorageString, setMerkleTreeStorageString] = useState('')
  const [_, setCopied] = useClipboard(merkleTreeStorageString, { successDuration: 1000 })

  useEffect(() => {
    if (merkleTree) setMerkleTreeStorageString(merkleTree.getStorageString())
  }, [merkleTree])

  const onGenerateClick = () => {
    const approvedSubmissions: ISubmission[] = submissions.filter((obj) => obj.approved)
    const commitments: BigInt[] = approvedSubmissions.map((obj) => BigInt(obj.commitment))

    if (commitments.length > 2 ** DEFAULT_HEIGHT) return toast.error('Too many commitments for tree height')

    // Pad on random commitments to the tree until it is full
    for (let i = commitments.length; i < 2 ** DEFAULT_HEIGHT; i++) commitments.push(randomBigInt(31))

    const merkleTree = MerkleTree.createFromLeaves(commitments)

    setMerkleTree(merkleTree)
  }

  const onCopyClick = () => {
    setCopied()
    console.log({ s: JSON.stringify(merkleTree?.getStorageString()) })
    toast.success('Copied to clipboard')
  }

  return (
    <div className="">
      <Button onClick={onGenerateClick}>Generate Merkle Tree</Button>
      {merkleTree && (
        <div className=" p-4 bg-gray-100 mt-4 rounded cursor-pointer" onClick={onCopyClick}>
          <code className="overflow-x-auto line-clamp-3 hover:line-clamp-none">{merkleTree.getStorageString()}</code>
        </div>
      )}
    </div>
  )
}
