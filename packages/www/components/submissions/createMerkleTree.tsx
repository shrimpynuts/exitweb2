import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useClipboard from 'react-use-clipboard'
import { useMutation } from '@apollo/client'

import { UPDATE_COMMUNITY_MERKLE_TREE } from '../../graphql/mutations'
import PRIVATE_AIRDROP_JSON from '../../lib/ABIs/PrivateAirdrop.json'
import { ICommunity, ISubmission } from '../../types'
import { MerkleTree } from '../../lib/zkp/MerkleTree'
import { randomBigInt } from '../../lib/zkp/util'
import Button from '../util/button'
import { Contract } from 'ethers'
import { useSigner } from 'wagmi'
import CopyCode from '../util/copyableCode'
import { toHex } from '../../lib/zkp/Library'

interface IProps {
  submissions: ISubmission[]
  community: ICommunity
}

const DEFAULT_HEIGHT = 5

export default function CreateMerkleTree({ submissions, community }: IProps) {
  const [merkleTree, setMerkleTree] = useState<MerkleTree>()
  const [merkleTreeStorageString, setMerkleTreeStorageString] = useState('')
  const [_, setCopied] = useClipboard(merkleTreeStorageString, { successDuration: 1000 })

  const [smartContractRoot, setSmartContractRoot] = useState<string>()
  const [smartContractOwner, setSmartContractOwner] = useState<string>()
  const { data: signer } = useSigner()

  useEffect(() => {
    setMerkleTree(undefined)
    setMerkleTreeStorageString('')
  }, [community])

  useEffect(() => {
    if (!signer) {
      toast.error('Not signed in with Ethereum!')
    } else {
      let airdropContract = new Contract(AIRDROP_ADDR, PRIVATE_AIRDROP_JSON.abi, signer)
      console.log('Fetching merkle root from smart contract...')
      airdropContract.root().then(setSmartContractRoot)
      airdropContract.owner().then(setSmartContractOwner)
    }
  }, [community])

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

  const onUploadClick = () => {
    updateCommunityMerkleTree({ variables: { merkle_tree: merkleTreeStorageString, id: community.id } })
      .then(() => toast.success('Merkle tree uploaded!'))
      .catch((e) => toast.error(e.message))
  }

  const AIRDROP_ADDR = '0x9A676e781A523b5d0C0e43731313A708CB607508'
  const onUpdateSmartContractClick = async () => {
    if (!merkleTree) return toast.error('No merkle tree to upload')
    if (!signer) return toast.error('Not signed in with Ethereum!')
    console.log(signer.provider)
    let airdropContract = new Contract(AIRDROP_ADDR, PRIVATE_AIRDROP_JSON.abi, signer)
    console.log('Updating smart contract...')
    console.log({ newRootHex: toHex(merkleTree.root.val) })
    const txn = await airdropContract.updateRoot(toHex(merkleTree.root.val))
    await txn.wait().then(() => toast.success('Smart contract updated!'))
  }

  return (
    <div>
      <Button onClick={onGenerateClick}>Generate New Merkle Tree</Button>
      <div className="overflow-hidden">
        <p className="font-bold text-lg my-2">Smart contract:</p>
        <div>
          <p className="inline"> Address:</p>
          <CopyCode text={AIRDROP_ADDR} />
        </div>
        <div>
          <p className="inline"> Root:</p>
          {smartContractRoot && <CopyCode text={smartContractRoot} />}
        </div>
        <div>
          <p className="inline">Owner:</p>
          {smartContractOwner && <CopyCode text={smartContractOwner} />}
        </div>
      </div>
      <div>
        {merkleTree && (
          <div>
            <p className="font-bold text-lg my-2">Newly Generated Merkle Tree:</p>
            <CopyCode text={merkleTree.getStorageString()} />
            <CopyCode text={toHex(merkleTree.root.val)} />
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
