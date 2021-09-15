import 'dotenv/config'

import { sleep } from '../utils'
import { connect } from '../amqplib'

const SERVICE = 'station'
const COMPANIES = ['hmaistoken', 'pokotinhatoken']

const exchanges = [
  {
    exchange: 'products',
    type: 'headers',
    fn: async (companyToken: string, msg: any) => {
      console.log('Processando produto', companyToken, msg)

      await sleep(5 * 1000)

      console.log('Finalizado produto', companyToken, msg)
    }
  },
  {
    exchange: 'customers',
    type: 'headers',
    fn: async (companyToken: string, msg: any) => {
      console.log('Processando cliente', companyToken, msg)

      await sleep(5 * 1000)

      console.log('Finalizado cliente', companyToken, msg)
    }
  }
]

// Consumer
connect(COMPANIES, SERVICE, exchanges)
