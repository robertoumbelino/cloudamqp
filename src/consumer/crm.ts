import 'dotenv/config'
import { connect } from '../amqplib'

const SERVICE = 'crm'
const COMPANIES = ['hmaistoken']

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
