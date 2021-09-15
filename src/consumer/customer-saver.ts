import 'dotenv/config'
import { connect } from '../amqplib'

const SERVICE = 'customer-saver'
const COMPANIES = ['hmaistoken', 'pokotinhatoken']

const exchanges = [
  {
    exchange: 'saved-customer',
    type: 'headers',
    fn: (companyToken: string, msg: any) =>
      console.log('saved customer', companyToken, msg)
  }
]

// Consumer
connect(COMPANIES, SERVICE, exchanges)
