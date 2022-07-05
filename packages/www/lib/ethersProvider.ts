import { ethers } from 'ethers'

const alchemyAPIKey = process.env.NEXT_PUBLIC_ALCHEMY_API

if (!alchemyAPIKey) {
  console.error('The NEXT_PUBLIC_ALCHEMY_API environment variable is not set, exiting.')
  process.exit(1)
}

export const alchemyProvider = new ethers.providers.AlchemyProvider(1, 'XJ_dGolXlwbvMdHln2f_Wcu5Okrpmjdz')
