import { useState } from 'react'
import toast from 'react-hot-toast'

import { pedersenHashConcat, toHex, generateProofCallData } from '../../lib/zkp/Library'
import { MerkleTree } from '../../lib/zkp/MerkleTree'
import { getFileBuffer } from '../../lib/zkp/util'
import { ICommunity } from '../../types'
import Button from '../util/button'
import CopyCode from '../util/copyableCode'

interface IProps {
  community: ICommunity
}

export default function GenerateProof({ community }: IProps) {
  const [proof, setProof] = useState<string>()

  const onGenerateProof = async () => {
    const secretKey = localStorage.getItem(`exitweb2/community/${community.id}`)
    if (!secretKey) return toast.error('No secret key found!')

    const communityHash = BigInt(community.hash)
    const userSecret = BigInt(secretKey)
    const computedCommitment = toHex(pedersenHashConcat(communityHash, userSecret))

    let domain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://exitweb2.vercel.app'
    let wasmBuff = await getFileBuffer(`${domain}/circuit.wasm`)
    let zkeyBuff = await getFileBuffer(`${domain}/circuit_final.zkey`)

    const address = '0xdef6919d69b28394B9D97FAf31b0CC2f5739ab57'

    const merkleTree = MerkleTree.createFromStorageString(community.merkle_tree)

    if (!merkleTree.leafExists(BigInt(computedCommitment))) return toast.error('Commitment not found in merkle tree!')

    generateProofCallData(merkleTree, communityHash, userSecret, address, wasmBuff, zkeyBuff)
      .then(setProof)
      .then(() => toast.success('Proof generated'))
      .catch((err) => toast.error(err.message))
  }

  return (
    <div className="flex flex-col w-96 mx-auto p-4 border border-gray-300 rounded">
      <label className="text-xl font-bold">Generate a proof.</label>
      <Button bgColor="bg-blue-600" classOverrides="mt-2" onClick={onGenerateProof}>
        Generate Proof
      </Button>
      {proof && <CopyCode text={proof} />}
    </div>
  )
}
