import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from '@apollo/client'
import { useContractWrite, useSigner } from 'wagmi'

import { UPDATE_COMMUNITY_MERKLE_TREE } from '../../graphql/mutations'
import { AIRDROP_CONTRACT_DATA } from '../../lib/config'
import { ICommunity, ISubmission } from '../../types'
import { MerkleTree } from '../../lib/zkp/MerkleTree'
import { randomBigInt } from '../../lib/zkp/util'
import { toHex } from '../../lib/zkp/Library'
import CopyCode from '../util/copyableCode'
import Button from '../util/button'

interface IProps {
  submissions: ISubmission[]
  community: ICommunity
}

const DEFAULT_HEIGHT = 13

export default function CreateMerkleTree({ submissions, community }: IProps) {
  const [merkleTree, setMerkleTree] = useState<MerkleTree>()
  const [merkleTreeStorageString, setMerkleTreeStorageString] = useState('')
  const [merkleTreeRoot, setMerkleTreeRoot] = useState('')
  const [updateCommunityMerkleTree] = useMutation(UPDATE_COMMUNITY_MERKLE_TREE)

  const { data: signer } = useSigner()

  const { writeAsync } = useContractWrite({
    ...AIRDROP_CONTRACT_DATA,
    functionName: 'updateRoot',
    args: [community.contract_id, merkleTreeRoot],
  })

  // Reset the merkle tree to undefined when community changes
  useEffect(() => setMerkleTree(undefined), [community])

  // Keep the storage string and root up to date with the merkle tree in this local state
  useEffect(() => {
    if (merkleTree) {
      setMerkleTreeStorageString(merkleTree.getStorageString())
      setMerkleTreeRoot(toHex(merkleTree.root.val))
    }
  }, [merkleTree])

  // Generates a new merkle tree using the submissions
  const onGenerateClick = () => {
    const approvedSubmissions: ISubmission[] = submissions.filter((obj) => obj.approved)
    const commitments: BigInt[] = approvedSubmissions.map((obj) => BigInt(obj.commitment))
    if (commitments.length > 2 ** DEFAULT_HEIGHT) return toast.error('Too many commitments for tree height')
    // Pad on random commitments to the tree until it is full
    for (let i = commitments.length; i < 2 ** DEFAULT_HEIGHT; i++) commitments.push(randomBigInt(31))
    const merkleTree = MerkleTree.createFromLeaves(commitments)
    setMerkleTree(merkleTree)
  }

  const onUploadClick = () => {
    updateCommunityMerkleTree({ variables: { merkle_tree: merkleTreeStorageString, id: community.id } })
      .then(() => toast.success('Merkle tree uploaded!'))
      .catch((e) => toast.error(e.message))
  }

  const onUpdateSmartContractClick = async () => {
    if (!merkleTree) return toast.error('No merkle tree to upload')
    if (!signer) return toast.error('Not signed in with Ethereum!')
    writeAsync().catch((e) => toast.error(e.message))
  }

  return (
    <div>
      <Button onClick={onGenerateClick}>Generate New Merkle Tree</Button>
      <div>
        {merkleTree && (
          <div>
            <p className="font-bold text-lg my-2">Newly Generated Merkle Tree:</p>
            <CopyCode text={merkleTree.getStorageString()} />
            <CopyCode text={merkleTreeRoot} />
            <div className="flex space-x-2 mt-4">
              <Button bgColor="bg-green-500" onClick={onUploadClick}>
                Update Merkle Tree in Database
              </Button>
              <Button bgColor="bg-yellow-500" onClick={onUpdateSmartContractClick}>
                Update Smart Contract Root
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
