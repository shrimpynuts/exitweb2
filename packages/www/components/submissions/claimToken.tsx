import toast from 'react-hot-toast'
import { useContractWrite } from 'wagmi'

import { AIRDROP_CONTRACT_DATA } from '../../lib/config'
import { pedersenHash, toHex } from '../../lib/zkp/Library'
import { ICommunity } from '../../types'
import Button from '../util/button'

interface IProps {
  community: ICommunity
  proof: string
  nullifier: string
}

export default function ClaimToken({ community, proof, nullifier }: IProps) {
  const { writeAsync: claim } = useContractWrite({
    ...AIRDROP_CONTRACT_DATA,
    functionName: 'collectAirdrop',
    args: [community.contract_id, proof, toHex(pedersenHash(BigInt(nullifier)))],
  })

  const claimToken = async () => {
    return claim().catch((error) => {
      if (error.data.message.includes('Airdrop already redeemed')) {
        return Promise.reject(`Token has already been claimed!`)
      } else {
        return Promise.reject(`Error claiming tokens: ${error.data.message}`)
      }
    })
  }

  // Onclick handler for claiming tokens
  const onClaimTokenClick = () => {
    toast.promise(claimToken(), {
      loading: 'Claiming token...',
      success: 'Token claimed!',
      error: (err) => err.toString(),
    })
  }

  return (
    <Button onClick={onClaimTokenClick} bgColor="bg-green-500">
      Claim Tokens
    </Button>
  )
}
