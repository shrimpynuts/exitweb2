import toast from 'react-hot-toast'
import { useContractWrite } from 'wagmi'

import { ICommunity } from '../../types'
import Button from '../util/button'
import { AIRDROP_CONTRACT_DATA } from '../../lib/config'

interface IProps {
  community: ICommunity
  contract_id: number
  proof: string
  nullifierHash: string
}

export default function ClaimToken({ community, proof, contract_id, nullifierHash }: IProps) {
  const { writeAsync: claim } = useContractWrite({
    ...AIRDROP_CONTRACT_DATA,
    functionName: 'collectAirdrop',
    args: [contract_id, proof, nullifierHash],
  })

  const claimToken = async () => {
    return claim().catch((error) => Promise.reject(`Error claiming tokens: ${error.message}`))
  }

  // Onclick handler for claiming tokens
  const onClaimTokenClick = () => {
    toast.promise(claimToken(), {
      loading: 'Claiming token...',
      success: 'Tokens claimed!',
      error: (err) => err.toString(),
    })
  }

  return (
    <Button onClick={onClaimTokenClick} bgColor="bg-green-500" disabled={!community?.merkle_tree}>
      Claim Tokens
    </Button>
  )
}
