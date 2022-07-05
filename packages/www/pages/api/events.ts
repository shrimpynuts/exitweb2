import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

import DotComSeanceABI from '../../backend/ABI/dotcomSeanceController.json'
import { ITransaction } from '../../frontend/types/accounting'
import { alchemyProvider } from '../../lib/ethersProvider'

/**
 * Struct for purchased edition event
 *  event editionBought(
 *      uint256 workId,
 *      uint256 editionId,
 *      uint256 tokenId,
 *      address recipient,
 *      uint256 paid,
 *      uint256 artistReceived,
 *      uint256 adminReceived
 *  )
 */

interface IBlockNumberToTimestampObject {
  [blockNumber: number]: number
}

function parseEvent(event: any, blockNumberToTimestampsObject: IBlockNumberToTimestampObject): ITransaction {
  const [workId, editionId, tokenId, recipient, paid, artistReceived, adminReceived] = event.args
  return {
    hash: event.transactionHash,
    workId: workId.toNumber(),
    editionId: editionId.toNumber(),
    tokenId: tokenId.toNumber(),
    buyer: recipient,
    price: parseFloat(ethers.utils.formatEther(paid)),
    artistReceived: parseFloat(ethers.utils.formatEther(artistReceived)),
    adminReceived: parseFloat(ethers.utils.formatEther(adminReceived)),
    timestamp: blockNumberToTimestampsObject[event.blockNumber],
  }
}

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const contract = new ethers.Contract('0xCF1f4b4f0FA1B41e74431E74551B4EF5424043DB', DotComSeanceABI, alchemyProvider)
  let eventFilter = contract.filters.editionBought()
  let events = await contract.queryFilter(eventFilter)

  // Get all unique block numbers
  let blockNumbers = new Set<number>()
  events.forEach((event) => blockNumbers.add(event.blockNumber))

  // Fetch all block timestamps in parallel
  const blockNumberToTimestamps = await Promise.all(
    Array.from(blockNumbers).map((blockNumber) => {
      return alchemyProvider.getBlock(blockNumber).then((block) => {
        return {
          blockNumber,
          timestamp: block.timestamp,
        }
      })
    }),
  )

  // Create a mapping from block number to timestamp
  const blockNumberToTimestampsObject = blockNumberToTimestamps.reduce((acc, { blockNumber, timestamp }) => {
    return { ...acc, [blockNumber]: timestamp }
  }, {})

  // Parse the events into transaction objects
  const transactions = events.map((event) => parseEvent(event, blockNumberToTimestampsObject))

  return res.status(200).json({
    count: transactions.length,
    transactions: transactions,
  })
}

export default request
