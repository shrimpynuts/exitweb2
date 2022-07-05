import moment from 'moment'
import { ITransaction } from '../../frontend/types/accounting'

export interface ICoingeckoOutput {
  prices: [number, number][]
  total_volumes: [number, number][]
  market_caps: [number, number][]
}

export interface IETH_EUR_Prices {
  [unixTimestamp: number]: number
}

export interface IETH_EUR_Value {
  value: number
  displayEUR: string
  displayETH: string
}

export interface IReceiptValues {
  totalAmount: IETH_EUR_Value
  excludingVATAmount: IETH_EUR_Value
  vatAmount: IETH_EUR_Value
}

export const parseCoingeckoOutput: (output: ICoingeckoOutput) => IETH_EUR_Prices = (output: ICoingeckoOutput) => {
  return output.prices.reduce((acc, [timestamp, price]) => {
    const timestampMoment = moment.unix(timestamp / 1000).startOf('day')
    return {
      ...acc,
      [timestampMoment.unix()]: price,
    }
  }, {})
}

export const getCoingeckoETH_EUR: (fromUnixTimestamp: number) => Promise<ICoingeckoOutput> = async (
  fromUnixTimestamp,
) =>
  fetch(
    `https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=eur&from=${fromUnixTimestamp}&to=9999999999`,
  ).then((res) => res.json())

export function calculateReceiptValues(transaction: ITransaction, ETH_EUR_Price: number): IReceiptValues {
  const VAT_PERCENTAGE = 7 / 107

  // Calculate receipt amounts
  const totalAmount = transaction.artistReceived
  const excludingVATAmount = totalAmount * (1 - VAT_PERCENTAGE)
  const vatAmount = totalAmount * VAT_PERCENTAGE

  // Calculate receipt values
  const totalAmountValue = generateETH_EUR_Value(totalAmount, ETH_EUR_Price)
  const vatAmountValue = generateETH_EUR_Value(vatAmount, ETH_EUR_Price)
  const excludingVATAmountValue = generateETH_EUR_Value(
    excludingVATAmount,
    ETH_EUR_Price,
    parseFloat(totalAmountValue.displayEUR) - parseFloat(vatAmountValue.displayEUR),
  )

  // Return receipt values
  return {
    totalAmount: totalAmountValue,
    excludingVATAmount: excludingVATAmountValue,
    vatAmount: vatAmountValue,
  }
}

function generateETH_EUR_Value(value: number, ETH_EUR_Price: number, overrideDisplayEUR?: number): IETH_EUR_Value {
  return {
    value,
    displayEUR: displayAmountEUR(overrideDisplayEUR ? overrideDisplayEUR : value * ETH_EUR_Price),
    displayETH: displayAmountETH(value),
  }
}

export function displayAmountEUR(amount: number) {
  return `${displayAmount(amount, 2, true)} €`
}

export function displayAmountETH(amount: number) {
  return `${displayAmount(amount, 5)} Ether`
}

export function displayAmount(amount: number, decimalPoints: number, trailingZeros = false) {
  if (trailingZeros) {
    return amount.toFixed(decimalPoints)
  }
  return Number(amount.toFixed(decimalPoints))
}
