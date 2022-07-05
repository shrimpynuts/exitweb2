export interface IEtherscanTransaction {
  [key: string]: any
}

export interface ITransaction {
  hash: string
  buyer: string
  tokenId: string
  price: number
  timestamp: number

  // DotCom Seance specific
  workId: number
  editionId: number
  artistReceived: number
  adminReceived: number
}
