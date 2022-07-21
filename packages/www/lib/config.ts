import { ethers, Signer } from 'ethers'
import PRIVATE_AIRDROP_JSON from './ABIs/PrivateAirdrop.json'
import COMMUNITY_TOKEN_JSON from './ABIs/CommunityToken.json'

/** Private airdrop contract configs */
export const AIRDROP_CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
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
