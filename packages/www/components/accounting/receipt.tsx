import { Page, Text, View } from '@react-pdf/renderer'
import moment from 'moment'
import { ITransaction } from '../../frontend/types/accounting'
import { calculateReceiptValues } from './util'

const Title: React.FC = ({ children }) => {
  return <Text style={{ color: 'blue', marginTop: 20 }}>{children}</Text>
}

interface IProps {
  ETH_EUR_Price: number
  txn: ITransaction
  pageNumber: number
}

const Receipt = ({ ETH_EUR_Price, txn, pageNumber }: IProps) => {
  const { totalAmount, vatAmount, excludingVATAmount } = calculateReceiptValues(txn, ETH_EUR_Price)

  return (
    <Page
      size="A4"
      style={{
        flexDirection: 'column',
        backgroundColor: 'white',
        margin: 10,
        padding: 70,
        flexGrow: 1,
        fontSize: 18,
      }}
    >
      {/* <Text>Page #{pageNumber + 1}</Text> */}
      <Title>RECHNUNG</Title>

      <Title>Käufer</Title>
      <Text style={{ textDecoration: 'underline' }}>
        <a href={`https://etherscan.io/address/${txn.buyer}`}>{txn.buyer}</a>
      </Text>

      <Title>Rechnungsnummer</Title>
      <Text style={{ textDecoration: 'underline' }}>
        <a href={`https://etherscan.io/tx/${txn.hash}`}>{`DC${txn.tokenId}`}</a>
      </Text>

      <Title>Betrifft</Title>
      <Text>Sale of DotCom Seance artwork</Text>

      <Title>Rechnungsdatum (Invoice date)</Title>
      <Text>{moment.unix(txn.timestamp).format('DD.MM.YYYY')}</Text>

      <Title>Lieferdatum (Delivery date)</Title>
      <Text>{moment.unix(txn.timestamp).format('DD.MM.YYYY')}</Text>

      <Title>Exkl. MwSt. (price excluding VAT)</Title>
      <Text>
        {excludingVATAmount.displayEUR} ({excludingVATAmount.displayETH})
      </Text>

      <Title>zzgl. MwSt. 7% (VAT amount)</Title>
      <Text>
        {vatAmount.displayEUR} ({vatAmount.displayETH})
      </Text>

      <Title>Gesamtbetrag (total amount)</Title>
      <Text>
        {totalAmount.displayEUR} ({totalAmount.displayETH})
      </Text>

      <Text style={{ marginTop: 10, marginBottom: 10, textAlign: 'center' }}> --------- </Text>

      <Text style={{ fontSize: 12 }}>
        Bezahlung erhalten in wallet Simon Denny 0x3F93dFd9a05027b26997ebCED1762FeE0E1058C0
      </Text>

      <Text style={{ marginTop: 10, marginBottom: 10 }}></Text>

      <View style={{ display: 'flex', flexDirection: 'row', color: 'blue' }}>
        <View style={{ display: 'flex', flexDirection: 'column', color: 'blue', marginRight: 20 }}>
          <Text>Studio Simon Denny </Text>
          <Text>Müllerstrasse 156a</Text>
          <Text>2. HH, Aufg. 12</Text>
          <Text>13353 Berlin</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', color: 'blue', marginLeft: 20 }}>
          <Text>USt-IdNr. DE 273950411</Text>
          <Text>Steuer-IdNr. 23/258/01408</Text>
        </View>
      </View>
    </Page>
  )
}

export default Receipt
