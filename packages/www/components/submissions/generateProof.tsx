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
  secretKey: string
}

export default function GenerateProof({ community, secretKey }: IProps) {
  const [proof, setProof] = useState<string>()

  const onGenerateProof = async () => {
    if (!community) return
    try {
      if (!community.merkle_tree) return Promise.reject(new Error('Community has not generated a merkle tree yet!'))

      const communityHash = BigInt(community.hash)
      const userSecret = BigInt(secretKey)
      const computedCommitment = toHex(pedersenHashConcat(communityHash, userSecret))

      // Fetch wasm and zkey
      let domain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://exitweb2.vercel.app'
      let wasmBuff = await getFileBuffer(`${domain}/circuit.wasm`)
      let zkeyBuff = await getFileBuffer(`${domain}/circuit_final.zkey`)

      // Create merkle tree object
      const merkleTree = MerkleTree.createFromStorageString(community.merkle_tree)

      // Check if leaf is even in the merkle tree
      if (!merkleTree.leafExists(BigInt(computedCommitment)))
        return Promise.reject(new Error('Commitment not found in merkle tree!'))

      // TODO: require user sign in w/ Ethereum to generate proof and claim token
      const address = '0xdef6919d69b28394B9D97FAf31b0CC2f5739ab57'

      // Generate the proof
      return generateProofCallData(merkleTree, communityHash, userSecret, address, wasmBuff, zkeyBuff)
        .then(setProof)
        .catch(Promise.reject)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const onClick = () => {
    toast.promise(onGenerateProof(), {
      loading: 'Generating proof...',
      success: 'Proof successfully generated!',
      error: (err) => err.toString(),
    })
  }

  return (
    <div className="flex flex-col w-96 mx-auto p-4 border border-gray-300 rounded ">
      <>
        <label className="text-xl font-bold">Generate a proof.</label>
        <p>Found secret key corresponding to this community in local storage.</p>
        <CopyCode text={secretKey} />

        {community?.merkle_tree ? (
          <>
            <p className="mt-2">See if this key corresponds to an approved request:</p>
            <Button disabled={!community?.merkle_tree} classOverrides="mt-2" onClick={onClick}>
              Generate Proof
            </Button>
          </>
        ) : (
          <>Community has not generated merkle tree yet.</>
        )}
        {proof && <CopyCode text={proof} />}
      </>
    </div>
  )
}
