import { ethers, Signer } from 'ethers'
import PRIVATE_AIRDROP_JSON from './ABIs/PrivateAirdrop.json'
import COMMUNITY_TOKEN_JSON from './ABIs/CommunityToken.json'

/** Private airdrop contract configs */
export const AIRDROP_CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
export const AIRDROP_ABI = PRIVATE_AIRDROP_JSON.abi

export const AIRDROP_CONTRACT_DATA = {
  addressOrName: AIRDROP_CONTRACT_ADDRESS,
  contractInterface: AIRDROP_ABI,
}

export const getAirdropContractWithSigner = (signer: Signer) => {
  return new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_ABI, signer)
}

const publicProvider = ethers.getDefaultProvider()

export const getAirdropContractWithPublicProvider = () => {
  return new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_ABI, publicProvider)
}

/** Community token contract configs */
export const COMMUNITY_TOKEN_ABI = COMMUNITY_TOKEN_JSON.abi
