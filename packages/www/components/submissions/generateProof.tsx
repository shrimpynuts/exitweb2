import { BigNumber, Contract } from 'ethers'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'

import { pedersenHashConcat, toHex, generateProofCallData, pedersenHash } from '../../lib/zkp/Library'
import { MerkleTree } from '../../lib/zkp/MerkleTree'
import { getFileBuffer } from '../../lib/zkp/util'
import CopyCode from '../util/copyableCode'
import { ICommunity } from '../../types'
import ClaimToken from './claimToken'
import Button from '../util/button'

interface IProps {
  community: ICommunity
  secretKey: string
  contract_id: number
}

export default function GenerateProof({ community, secretKey, contract_id }: IProps) {
  const [proof, setProof] = useState<string>()
  const { address, isConnected } = useAccount()

  const generateProof = async () => {
    if (!community) return
    try {
      if (!community.merkle_tree) return Promise.reject(new Error('Community has not generated a merkle tree yet!'))
      if (!isConnected || !address) return Promise.reject(new Error('Not signed in with Ethereum!'))

      // Fetch wasm and zkey
      let domain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://exitweb2.vercel.app'
      // let WASM_BUFF = await getFileBuffer(`${domain}/circuit.wasm`)
      // let ZKEY_BUFF = await getFileBuffer(`${domain}/circuit_final.zkey`)
      let WASM_BUFF = await getFileBuffer(`${domain}/circuit_13.wasm`)
      let ZKEY_BUFF = await getFileBuffer(`${domain}/circuit_final_13.zkey`)

      // Fetch key (nullifier stored in community database) and secret (stored in local storage)
      const communityKey = BigInt(community.hash)
      const secret = BigInt(secretKey)
      const nullifier = pedersenHashConcat(communityKey, secret)

      // Check if leaf is even in the merkle tree
      const merkleTree = MerkleTree.createFromStorageString(community.merkle_tree)
      const computedCommitment = toHex(pedersenHashConcat(nullifier, secret))
      if (!merkleTree.leafExists(BigInt(computedCommitment)))
        return Promise.reject(new Error('Commitment not found in merkle tree!'))

      // Generate proof and setState
      return generateProofCallData(merkleTree, nullifier, secret, address, WASM_BUFF, ZKEY_BUFF)
        .then(setProof)
        .catch((err) => Promise.reject(`Failed to generate proof! ${err}`))
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // Onclick handler for proof generation
  const onGenerateProofClick = () => {
    toast.promise(generateProof(), {
      loading: 'Generating proof...',
      success: 'Proof successfully generated!',
      error: (err) => err.toString(),
    })
  }

  return (
    <div className="flex flex-col w-96 mx-auto p-4 border border-gray-300 rounded ">
      <label className="text-xl font-bold">Generate a proof.</label>
      <p>Found secret key corresponding to this community in local storage.</p>

      <p>Secret:</p>
      <CopyCode text={secretKey} />

      {community?.merkle_tree ? (
        <>
          <p className="mt-2">See if this key corresponds to an approved request:</p>
          <Button disabled={!community?.merkle_tree} classOverrides="mt-2" onClick={onGenerateProofClick}>
            Generate Proof
          </Button>
        </>
      ) : (
        <p className="italic text-red-500">Community has not generated a merkle tree yet.</p>
      )}

      {proof && (
        <>
          <CopyCode text={proof} />
          <ClaimToken
            community={community}
            proof={proof}
            contract_id={contract_id}
            nullifierHash={toHex(pedersenHash(BigInt(community.hash)))}
          />
        </>
      )}
    </div>
  )
}
