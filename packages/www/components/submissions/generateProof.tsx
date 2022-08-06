import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useContractWrite } from 'wagmi'

import { pedersenHashConcat, toHex, generateProofCallData, pedersenHash } from '../../lib/zkp/Library'
import { AIRDROP_CONTRACT_DATA } from '../../lib/config'
import { MerkleTree } from '../../lib/zkp/MerkleTree'
import { getFileBuffer } from '../../lib/zkp/util'
import { ICommunity } from '../../types'
import Button from '../util/button'
import Modal from '../util/modal'

interface IProps {
  community: ICommunity
  secret: string
  nullifier: string
}

function GenerateProof({ community, secret, nullifier }: IProps) {
  const { address, isConnected } = useAccount()
  const { writeAsync: claim } = useContractWrite({ ...AIRDROP_CONTRACT_DATA, functionName: 'collectAirdrop' })

  const generateProofAndClaimTokens = async () => {
    if (!community) return
    if (!community.merkle_tree) return Promise.reject(new Error('Community has not generated a merkle tree yet!'))
    if (!isConnected || !address) return Promise.reject(new Error('Not signed in with Ethereum!'))

    // Fetch wasm and zkey
    let domain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://exitweb2.vercel.app'
    let WASM_BUFF = await getFileBuffer(`${domain}/circuit_13.wasm`)
    let ZKEY_BUFF = await getFileBuffer(`${domain}/circuit_final_13.zkey`)

    // Check if leaf is even in the merkle tree
    const merkleTree = MerkleTree.createFromStorageString(community.merkle_tree)
    const computedCommitment = toHex(pedersenHashConcat(BigInt(nullifier), BigInt(secret)))

    if (!merkleTree.leafExists(BigInt(computedCommitment)))
      return Promise.reject(new Error('Commitment not found in merkle tree!'))

    const proof = await generateProofCallData(
      merkleTree,
      BigInt(nullifier),
      BigInt(secret),
      address,
      WASM_BUFF,
      ZKEY_BUFF,
    )

    return claim({ args: [community.contract_id, proof, toHex(pedersenHash(BigInt(nullifier)))] })
  }

  const onClaimClick = () => {
    toast.promise(generateProofAndClaimTokens(), {
      loading: 'Claiming your membership token. This may take a few minutes...',
      success: 'Transaction successfully submitted! Wait for it to be confirmed, then refresh this page.',
      error: (error) => {
        console.error({ error })
        if (error.toString().includes('User denied transaction signature.')) {
          return "You've denied the transaction."
        }
        if (error.data && error.data.message.includes('Airdrop already redeemed')) {
          return 'Token has already been claimed!'
        }
        return 'Error claiming tokens!'
      },
    })
  }

  return (
    <div className="flex flex-col mx-auto p-12 rounded">
      <label className="text-xl font-bold mb-4">Redeem your membership!</label>
      <Button onClick={onClaimClick} bgColor="bg-green-500">
        Claim Membership Token
      </Button>
    </div>
  )
}

interface IGenerateProofButtonProps {
  community: ICommunity
}

export default function GenerateProofButton({ community }: IGenerateProofButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<{ secret: string; nullifier: string }>({ secret: '', nullifier: '' })

  // This fetches the secret and nullifier from localStorage
  useEffect(() => {
    const data = localStorage.getItem(`exitweb2/community/${community.id}`)
    if (data) {
      const { secret, nullifier } = JSON.parse(data)
      if (secret && nullifier) {
        setState({ secret, nullifier })
      }
    }
  }, [])

  const communityIsOnSmartContract = !!community.contract_id
  const computedCommitment = toHex(pedersenHashConcat(BigInt(state.nullifier), BigInt(state.secret)))
  const merkleTree = community.merkle_tree && MerkleTree.createFromStorageString(community.merkle_tree)
  const isCommitmentInTree = merkleTree && merkleTree.leafExists(BigInt(computedCommitment))
  const redeemable =
    communityIsOnSmartContract && !!state.secret && !!state.nullifier && !!community.merkle_tree && !!isCommitmentInTree

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <GenerateProof community={community} secret={String(state.secret)} nullifier={String(state.nullifier)} />
      </Modal>
      {redeemable && (
        <Button bgColor="bg-yellow-600" onClick={() => setIsOpen(true)}>
          Redeem Membership
        </Button>
      )}
    </>
  )
}
