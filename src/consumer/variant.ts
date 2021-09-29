import 'dotenv/config'
import { connect } from '../amqplib'

const SERVICE = 'station'
const COMPANIES = ['hmaistoken', 'pokotinhatoken']

const exchanges = [
  {
    exchange: 'bolinha',
    type: 'headers',
    fn: (companyToken: string, msg: any) =>
      console.log('received-variant', companyToken, msg)
  }
]

// Consumer
connect(COMPANIES, SERVICE, exchanges)
