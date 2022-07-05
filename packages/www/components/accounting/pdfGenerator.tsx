import { Document, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'

// import { transactions as mockTransactions } from './mockData/mockTransactions'
import { ITransaction } from '../../frontend/types/accounting'
import { IETH_EUR_Prices } from './util'
import Button from '../util/button'
import Receipt from './receipt'
import moment from 'moment'

interface IProps {
  transactions: ITransaction[]
  ETH_EUR_Prices: IETH_EUR_Prices
  onDownload: () => void
}

function PDFGenerator({ transactions, ETH_EUR_Prices, onDownload }: IProps) {
  const MyDocument = () => (
    <Document>
      {transactions
        .sort((txnA: any, txnB: any) => parseInt(txnA.timestamp) - parseInt(txnB.timestamp))
        .filter((txn) => txn.price > 0)
        // .slice(0, 10)
        .map((txn, i) => {
          const txnMoment = moment.unix(txn.timestamp)
          const roundedMoment = txnMoment.startOf('day')
          const ETH_EUR_Price: any = ETH_EUR_Prices[roundedMoment.unix()]
          return <Receipt ETH_EUR_Price={ETH_EUR_Price} pageNumber={i} txn={txn} key={i} />
        })}
    </Document>
  )

  return (
    <div className="flex flex-col">
      {MyDocument && (
        <PDFDownloadLink document={<MyDocument />} fileName="all-invoices.pdf">
          {({ blob, url, loading, error }) => (
            <div className="mt-2 h-6">
              {!!loading || !!error ? (
                <Button disabled classOverrides="bg-gray-700">
                  Loading...
                </Button>
              ) : (
                <Button onClick={onDownload}>Download</Button>
              )}
            </div>
          )}
        </PDFDownloadLink>
      )}
      <PDFViewer style={{ height: '500px', marginTop: 20 }}>
        <MyDocument />
      </PDFViewer>
    </div>
  )
}

export default PDFGenerator
