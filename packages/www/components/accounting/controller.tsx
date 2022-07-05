import * as React from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import classnames from 'classnames'

import { getCoingeckoETH_EUR, IETH_EUR_Prices, parseCoingeckoOutput } from './util'
import { ITransaction } from '../../frontend/types/accounting'
import TransactionList from './transactionList'
import { getServer } from '../../lib/util'
import CSVGenerator from './csvGenerator'
import PDFGenerator from './pdfGenerator'
import Searchbar from '../searchbar'
import Button from '../util/button'

const START_UNIX_TIMESTAMP = 1638316800

function AccountingController() {
  const [transactions, setTransactions] = React.useState<ITransaction[]>()
  const [transactionsConfirmed, setTransactionsConfirmed] = React.useState(false)
  const [ETH_EUR_Prices, setETH_EUR_Prices] = React.useState<IETH_EUR_Prices>()
  const [PDFDownloaded, setPDFDownloaded] = React.useState(false)
  const [CSVDownloaded, setCSVDownloaded] = React.useState(false)

  useEffect(() => {
    if (!ETH_EUR_Prices) {
      console.log('Fetching ETH_EUR prices...')
      getCoingeckoETH_EUR(START_UNIX_TIMESTAMP)
        .then(parseCoingeckoOutput)
        .then(setETH_EUR_Prices)
        .then(() => {
          toast.success('Fetched ETH/EUR prices!')
        })
        .catch(() => {
          toast.error('Error fetching ETH_EUR prices. Please check your internet connection.')
        })
    }
  }, [setETH_EUR_Prices])

  const onEnterPress = async (address: string) => {
    console.log('Fetching transactions...')
    const { transactions } = await fetch(`${getServer()}/api/events`).then((res) => res.json())
    console.log('Done fetching transactions...')
    setTransactions(transactions)
  }

  const onPDFDownload = () => {
    setPDFDownloaded(true)
  }

  const onCSVDownload = () => {
    setCSVDownloaded(true)
  }

  const onConfirmTransactions = () => {
    setTransactionsConfirmed(true)
  }

  const isStep1 = !transactions
  const isStep2 = ETH_EUR_Prices && transactions && !transactionsConfirmed
  const isStep3 = ETH_EUR_Prices && transactions && transactionsConfirmed && !PDFDownloaded
  const isStep4 = ETH_EUR_Prices && transactions && transactionsConfirmed && PDFDownloaded && !CSVDownloaded
  const finished = ETH_EUR_Prices && transactions && transactionsConfirmed && PDFDownloaded && CSVDownloaded

  return (
    <div className="w-3/5 mx-auto mt-8">
      <div className="px-8 py-4 border border-gray-300 rounded shadow-sm">
        {/* ---------- Step 1: CSV Generation ---------- */}
        {isStep1 && (
          <>
            <h1
              className={classnames('text-3xl font-bold text-gray-700 leading-loose', {
                'animate-pulse': !isStep1,
              })}
            >
              Step 1:
            </h1>
            <h3 className="text-xl text-gray-600 leading-relaxed">Enter the smart contract address.</h3>
            <Searchbar autoFocus onEnterPress={onEnterPress} />
          </>
        )}

        {/* ---------- Step 2: Confirm Transactions ---------- */}
        {isStep2 && (
          <>
            <h1
              className={classnames('text-3xl font-bold text-gray-700 leading-loose', {
                'animate-pulse': !isStep2,
              })}
            >
              Step 2:
            </h1>
            <h3 className="text-xl text-gray-600 leading-relaxed">Double check that the transactions look correct.</h3>
            <TransactionList transactions={transactions} />
            <Button classOverrides="mt-4" onClick={onConfirmTransactions}>
              Looks right!
            </Button>
          </>
        )}

        {/* ---------- Step 3: PDF Generation ---------- */}
        {isStep3 && (
          <>
            <h1
              className={classnames('text-3xl font-bold text-gray-700 leading-loose', {
                'animate-pulse': !isStep3,
              })}
            >
              Step 3:
            </h1>
            <h3 className="text-xl text-gray-600 leading-relaxed">Preview and download the PDF.</h3>
            <PDFGenerator ETH_EUR_Prices={ETH_EUR_Prices} transactions={transactions} onDownload={onPDFDownload} />
          </>
        )}

        {/* ---------- Step 2: CSV Generation ---------- */}
        {isStep4 && (
          <>
            <h1
              className={classnames('text-3xl font-bold text-gray-700 leading-loose', {
                'animate-pulse': isStep4,
              })}
            >
              Step 3:
            </h1>
            <h3 className="text-xl text-gray-600 leading-relaxed">Download the CSV.</h3>
            <CSVGenerator ETH_EUR_Prices={ETH_EUR_Prices} transactions={transactions} onDownload={onCSVDownload} />
          </>
        )}

        {finished && (
          <>
            <h1 className="text-3xl font-bold text-gray-700 leading-loose">Finished!</h1>
            <h3 className="text-xl text-gray-600 leading-relaxed">Message me if anything goes wrong.</h3>
            <h3 className="text-xl text-gray-600 leading-relaxed">Email: caimjonathan@gmail.com</h3>
            <h3 className="text-xl text-gray-600 leading-relaxed">Twitter: @jonathanmcai</h3>
          </>
        )}
      </div>
    </div>
  )
}

export default AccountingController
