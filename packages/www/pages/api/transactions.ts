import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

function parseTransaction(transaction: any): any {
  return {
    hash: transaction.hash,
    buyer: transaction.from,
    price: parseFloat(ethers.utils.formatEther(transaction.value)),
    // cumulativeGasUsed: transaction.cumulativeGasUsed,
    timestamp: transaction.timeStamp,
    // date: moment.unix(parseInt(transaction.timeStamp)),
  }
}

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query

  if (!address || typeof address !== 'string' || !ethers.utils.isAddress(address)) {
    res.status(400).json({ error: 'No address provided' })
    return
  }

  let txns: any[] = []
  let apiCalls = 0

  const LIMIT = 10 // The limit of Etherscan API requests to make
  const TXNS_PER_PAGE = 1000 // The number of transactions to fetch per page

  // const address = '0x6CA044FB1cD505c1dB4eF7332e73a236aD6cb71C' // DotComSeance
  // const address = '0xCF1f4b4f0FA1B41e74431E74551B4EF5424043DB' // DotComSeanceController

  while (true) {
    const url = new URL('https://api.etherscan.io/api')
    url.searchParams.append('module', 'account')
    url.searchParams.append('action', 'txlist')
    url.searchParams.append('address', address)
    url.searchParams.append('startblock', '0')
    url.searchParams.append('endblock', '99999999')
    url.searchParams.append('offset', TXNS_PER_PAGE.toString())
    url.searchParams.append('page', (apiCalls + 1).toString())
    url.searchParams.append('sort', 'asc')
    url.searchParams.append('apikey', String(process.env.ETHERSCAN_API_KEY))

    const { result } = await fetch(url.toString()).then((response) => response.json())
    txns.push(...result)
    apiCalls += 1

    console.log(`\n\n--- API Calls: ${apiCalls} ---`)
    console.log(url.toString())
    console.log(result.length)

    if (result.length < TXNS_PER_PAGE || apiCalls == LIMIT) {
      break
    }
  }

  const parsedTransactions = txns.map(parseTransaction)
  const saleTransactions = parsedTransactions.filter((txn) => txn.value > 0)

  const salesSum = saleTransactions.reduce((acc, txn) => acc + txn.value, 0)

  res.status(200).json({
    countRaw: txns.length,
    countParsed: parsedTransactions.length,
    countSales: saleTransactions.length,
    transactions: parsedTransactions,
    salesSum,
    apiCalls,
    sampleParsed: parsedTransactions.slice(0, 2),
    sampleRaw: txns.slice(0, 2),
  })
}

export default request
