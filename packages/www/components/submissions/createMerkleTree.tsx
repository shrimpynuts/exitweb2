import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MerkleTree } from '../../lib/zkp/MerkleTree'
import { randomBigInt } from '../../lib/zkp/util'
import { ICommunity, ISubmission } from '../../types'
import Button from '../util/button'
import useClipboard from 'react-use-clipboard'
import { useMutation } from '@apollo/client'
import { UPDATE_COMMUNITY_MERKLE_TREE } from '../../graphql/mutations'

interface IProps {
  submissions: ISubmission[]
  community: ICommunity
}

const DEFAULT_HEIGHT = 5

export default function CreateMerkleTree({ submissions, community }: IProps) {
  const [merkleTree, setMerkleTree] = useState<MerkleTree>()
  const [merkleTreeStorageString, setMerkleTreeStorageString] = useState('')
  const [_, setCopied] = useClipboard(merkleTreeStorageString, { successDuration: 1000 })

  const [updateCommunityMerkleTree] = useMutation(UPDATE_COMMUNITY_MERKLE_TREE)

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
    console.log({ merkle_tree_storage_string: JSON.stringify(merkleTree?.getStorageString()) })
    toast.success('Copied to clipboard')
  }

  const onUploadClick = () => {
    updateCommunityMerkleTree({ variables: { merkle_tree: merkleTreeStorageString, id: community.id } })
      .then(() => toast.success('Merkle tree uploaded!'))
      .catch((e) => toast.error(e.message))
  }

  return (
    <div>
      <Button onClick={onGenerateClick}>Generate Merkle Tree</Button>
      <div>
        {merkleTree && (
          <div>
            <div className="my-2 p-4 bg-gray-100 rounded cursor-pointer" onClick={onCopyClick}>
              <code className="overflow-x-auto line-clamp-3">{merkleTree.getStorageString()}</code>
            </div>
            <Button onClick={onUploadClick}>Upload To Database</Button>
          </div>
        )}
      </div>
    </div>
  )
}
