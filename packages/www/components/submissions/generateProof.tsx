import { BigNumber, Contract } from 'ethers'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useSigner } from 'wagmi'

import { pedersenHashConcat, toHex, generateProofCallData, pedersenHash } from '../../lib/zkp/Library'
import PRIVATE_AIRDROP_JSON from '../../lib/ABIs/PrivateAirdrop.json'

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
  const { address, isConnected } = useAccount()
  const { data: signer, isError } = useSigner()

  const AIRDROP_ADDR = '0x9A676e781A523b5d0C0e43731313A708CB607508'

  const onGenerateProof = async () => {
    if (!community) return
    try {
      if (!community.merkle_tree) return Promise.reject(new Error('Community has not generated a merkle tree yet!'))
      if (!signer) return Promise.reject(new Error('Not signed in with Ethereum!'))
      if (!isConnected || !address) return Promise.reject(new Error('Not signed in with Ethereum!'))

      // Fetch wasm and zkey
      let domain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://exitweb2.vercel.app'
      let WASM_BUFF = await getFileBuffer(`${domain}/circuit.wasm`)
      let ZKEY_BUFF = await getFileBuffer(`${domain}/circuit_final.zkey`)

      // Fetch key (nullifier stored in community database) and secret (stored in local storage)
      const key = BigInt(community.hash)
      const secret = BigInt(secretKey)

      // Check if leaf is even in the merkle tree
      const merkleTree = MerkleTree.createFromStorageString(community.merkle_tree)
      const computedCommitment = toHex(pedersenHashConcat(key, secret))
      if (!merkleTree.leafExists(BigInt(computedCommitment)))
        return Promise.reject(new Error('Commitment not found in merkle tree!'))

      // Generate proof and setState
      await generateProofCallData(merkleTree, key, secret, address, WASM_BUFF, ZKEY_BUFF)
        .then(setProof)
        .catch((err) => toast.error(`Failed to create submission! ${err}`))
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const onClaimTokens = async () => {
    if (!signer) return Promise.reject(new Error('Not signed in with Ethereum!'))
    let keyHash = toHex(pedersenHash(BigInt(community.hash)))
    let airdropContract = new Contract(AIRDROP_ADDR, PRIVATE_AIRDROP_JSON.abi, signer)
    let tx = await airdropContract.collectAirdrop(proof, keyHash)
    await tx.wait()
  }

  const onGenerateProofClick = () => {
    toast.promise(onGenerateProof(), {
      loading: 'Generating proof...',
      success: 'Proof successfully generated!',
      error: (err) => err.toString(),
    })
  }

  const onClaimTokensClick = () => {
    toast.promise(onClaimTokens(), {
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

        <p>Secret:</p>
        <CopyCode text={secretKey} />

        {/* <p>Computed Commitment:</p>
        <CopyCode text={toHex(pedersenHashConcat(BigInt(community.hash), BigInt(secretKey)))} /> */}

        {community?.merkle_tree ? (
          <>
            <p className="mt-2">See if this key corresponds to an approved request:</p>
            <Button disabled={!community?.merkle_tree} classOverrides="mt-2" onClick={onGenerateProofClick}>
              Generate Proof
            </Button>
          </>
        ) : (
          <>Community has not generated merkle tree yet.</>
        )}
        {proof && (
          <>
            <CopyCode text={proof} />
            <Button onClick={onClaimTokensClick} bgColor="bg-green-500" disabled={!community?.merkle_tree}>
              Claim Tokens
            </Button>
          </>
        )}
      </>
    </div>
  )
}
