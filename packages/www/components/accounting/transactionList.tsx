import classnames from 'classnames'
import { ethers } from 'ethers'
import moment from 'moment'
import { FixedSizeList as List } from 'react-window'
import { ExternalLinkIcon } from '@heroicons/react/solid'

import { ITransaction } from '../../frontend/types/accounting'
import { middleEllipses } from '../../lib/util'

interface IProps {
  transactions: ITransaction[]
}

function TransactionList({ transactions }: IProps) {
  const totalSales = transactions.reduce((acc, txn) => acc + txn.price, 0)
  return (
    <div>
      <div className="flex flex-col text-gray-700 my-3 w-96 border rounded-lg shadow-sm p-4">
        <div className="flex justify-between">
          <span>Total sales:</span>
          <span> {transactions.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Sales with 1 value:</span> <span> {transactions.filter((txn) => txn.price === 1).length}</span>
        </div>
        <div className="flex justify-between">
          <span>Sales with .1 value:</span>
          <span> {transactions.filter((txn) => txn.price === 0.1).length}</span>
        </div>
        <div className="flex justify-between">
          <span>Total sales value:</span>
          <span>
            {totalSales.toFixed(2)}
            {ethers.constants.EtherSymbol}
          </span>
        </div>
      </div>
      <List
        itemData={transactions}
        height={400}
        itemCount={transactions.length}
        width={500}
        itemSize={60}
        className="border border-gray-300 rounded-lg shadow-sm"
      >
        {({ data, index, style }) => {
          const txn = data[index]
          return (
            <div
              style={style}
              key={index}
              className={classnames('flex items-center justify-between w-full p-4 border-b hover:bg-gray-100', {
                'bg-gray-50': txn.price > 0,
                'bg-white': txn.price === 0,
              })}
            >
              <div className="flex space-x-3 items-center">
                <div className="text-sm text-gray-700">#{data.length - index}</div>
                <div className="text-sm text-gray-700">{moment.unix(txn.timestamp).format('ll')}</div>
                <div className="font-semibold text-gray-800">{middleEllipses(txn.buyer, 4, 5, 4)}</div>
              </div>
              <div className="flex space-x-3 items-center">
                <div
                  className={classnames('text-gray-600 text-sm w-20 text-center border rounded', {
                    'bg-gray-400': txn.price === 0,
                    'bg-green-400': txn.price > 0,
                  })}
                >
                  {txn.price === 0 ? 'No value' : `${txn.price}${ethers.constants.EtherSymbol}`}
                </div>
                <div className="text-sm text-gray-700 hover:cursor-pointer">
                  <a href={`https://etherscan.io/tx/${txn.hash}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="h-4 w-4 fill-current" />
                  </a>
                </div>
              </div>
            </div>
          )
        }}
      </List>
    </div>
  )
}

export default TransactionList
