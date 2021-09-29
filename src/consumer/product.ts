import 'dotenv/config'
import { connect } from '../amqplib'

const SERVICE = 'station'
const COMPANIES = ['hmaistoken', 'pokotinhatoken']

const exchanges = [
  {
    exchange: 'received-product',
    type: 'headers',
    fn: (companyToken: string, msg: any) =>
      console.log('received-product', companyToken, msg)
  }
]

// Consumer
connect(COMPANIES, SERVICE, exchanges)
