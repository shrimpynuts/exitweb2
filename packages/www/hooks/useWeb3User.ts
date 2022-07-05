import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers'

import { ethers } from 'ethers'

const Web3UserState = () => {
  const [ensName, setEnsName] = useState<null | string>(null) // If the user has an ENS name, it gets set here.
  const [provider, setProvider] = useState<Web3Provider | JsonRpcProvider | null>(null) // Ethers provider
  const [ethPrice, setEthPrice] = useState<number>()

  // Fetch ether price
  useEffect(() => {
    async function fetchEtherPrice() {
      var etherscanProvider = new ethers.providers.EtherscanProvider()
      const price = await etherscanProvider
        .getEtherPrice()
        .then((price) => setEthPrice(price))
        .catch((err) => console.error(`Error while fetching eth price: ${err}`))
    }

    fetchEtherPrice()
  }, [])

  return {
    wallet: {
      status: 'not-connected',
      reset: () => {},
      networkName: 'mainnet',
      account: '0xf725a0353dbB6aAd2a4692D49DDa0bE241f45fD0',
      balance: 24,
    },
    ensName: 'jonathancai.eth',
    provider,
    ethPrice,
  }
}

const web3UserContainer = createContainer(Web3UserState)

export default web3UserContainer
