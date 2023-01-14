import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-gas-reporter'

const ALCHEMY_API_KEY = 'kZb5sUltq_7nMFcMjSvis5g5M1ArXUkw'
const GOERLI_PRIVATE_KEY = ''

const COIN_MARKETCAP_API_KEY = '31c49d7b-71b3-40fb-81ae-dafcb3f4c41c'

export default {
  gasReporter: {
    currency: 'USD',
    gasPrice: 30,
    coinmarketcap: COIN_MARKETCAP_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 88888,
          },
        },
      },
      {
        version: '0.8.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 88888,
          },
        },
      },
    ],
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
  mocha: {
    timeout: 200000,
  },
}
