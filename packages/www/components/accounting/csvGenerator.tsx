import { CSVLink } from 'react-csv'

// import { transactions as mockTransactions } from './mockData/mockTransactions'
import { ITransaction } from '../../frontend/types/accounting'
import { calculateReceiptValues, IETH_EUR_Prices } from './util'
import Button from '../util/button'
import moment from 'moment'

interface IProps {
  transactions: ITransaction[]
  ETH_EUR_Prices: IETH_EUR_Prices
  onDownload: () => void
}

function CSVGenerator({ transactions, ETH_EUR_Prices, onDownload }: IProps) {
  const headers = [
    { label: 'Txn #', key: 'index' },
    { label: 'From', key: 'from' },
    { label: 'Hash', key: 'hash' },
    { label: 'Transaction Link', key: 'etherscanURL' },
    { label: 'Token ID', key: 'tokenId' },

    { label: 'Timestamp', key: 'timestamp' },
    { label: 'Price (Ether)', key: 'price' },

    { label: 'Total Amount (€)', key: 'totalAmount' },
    { label: 'VAT Amount (€)', key: 'vatAmount' },
    { label: 'Excluding VAT Amount (€)', key: 'excludingVATAmount' },
    { label: 'ETH/EUR Price (Ether/€)', key: 'ETH_EUR_Price' },
  ]

  const data = transactions
    .sort((txnA: ITransaction, txnB: ITransaction) => txnA.timestamp - txnB.timestamp)
    .map((txn, index) => {
      const txnMoment = moment.unix(txn.timestamp)
      const roundedMoment = txnMoment.startOf('day')
      const ETH_EUR_Price = ETH_EUR_Prices[roundedMoment.unix()]
      const { totalAmount, vatAmount, excludingVATAmount } = calculateReceiptValues(txn, ETH_EUR_Price)
      return {
        index: index + 1,
        buyer: txn.buyer,
        hash: txn.hash,
        etherscanURL: `https://etherscan.io/tx/${txn.hash}`,
        tokenId: txn.tokenId,

        timestamp: moment.unix(txn.timestamp).format('DD.MM.YYYY'),
        price: totalAmount.displayETH,

        totalAmount: totalAmount.displayEUR,
        vatAmount: vatAmount.displayEUR,
        excludingVATAmount: excludingVATAmount.displayEUR,

        ETH_EUR_Price: ETH_EUR_Price.toFixed(2),
      }
    })

  return (
    <div>
      <CSVLink headers={headers} filename="all-invoices-table.csv" data={data}>
        <Button onClick={onDownload}>Download CSV</Button>
      </CSVLink>
    </div>
  )
}

export default CSVGenerator
