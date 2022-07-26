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
import Modal from '../util/modal'

interface IProps {
  community: ICommunity
  secret: string
  nullifier: string
}

export default function GenerateProof({ community, secret, nullifier }: IProps) {
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

      // Check if leaf is even in the merkle tree
      const merkleTree = MerkleTree.createFromStorageString(community.merkle_tree)
      const computedCommitment = toHex(pedersenHashConcat(BigInt(nullifier), BigInt(secret)))
      if (!merkleTree.leafExists(BigInt(computedCommitment)))
        return Promise.reject(new Error('Commitment not found in merkle tree!'))

      // Generate proof and setState
      return generateProofCallData(merkleTree, BigInt(nullifier), BigInt(secret), address, WASM_BUFF, ZKEY_BUFF)
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
    <div className="flex flex-col mx-auto p-12 rounded">
      <label className="text-xl font-bold">Generate a proof.</label>
      <p>Found secret key corresponding to this community in local storage.</p>

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
          <ClaimToken proof={proof} community={community} nullifier={nullifier} />
        </>
      )}
    </div>
  )
}

export function GenerateProofButton({ community, secret, nullifier }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <GenerateProof community={community} secret={secret} nullifier={nullifier} />
      </Modal>
      <Button bgColor="bg-yellow-600" onClick={() => setIsOpen(true)}>
        Redeem
      </Button>
    </>
  )
}
