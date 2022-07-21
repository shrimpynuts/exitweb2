import { ethers, Signer } from 'ethers'
import PRIVATE_AIRDROP_JSON from './ABIs/PrivateAirdrop.json'

export const AIRDROP_CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
export const AIRDROP_ABI = PRIVATE_AIRDROP_JSON.abi

export const AIRDROP_CONTRACT_DATA = {
  addressOrName: AIRDROP_CONTRACT_ADDRESS,
  contractInterface: AIRDROP_ABI,
}

// export const AIRDROP_CONTRACT = new Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_ABI, publicProvider)

export const getAirdropContractWithSigner = (signer: Signer) => {
  return new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_ABI, signer)
}

const publicProvider = ethers.getDefaultProvider()

export const getAirdropContractWithPublicProvider = () => {
  return new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_ABI, publicProvider)
}
