import 'dotenv/config'
import { connect } from '../amqplib'

const SERVICE = 'station'
const COMPANIES = ['hmaistoken', 'pokotinhatoken']

const exchanges = [
  {
    exchange: 'products',
    type: 'headers',
    fn: (companyToken: string, msg: any) =>
      console.log('produto', companyToken, msg)
  },
  {
    exchange: 'customers',
    type: 'headers',
    fn: async (companyToken: string, msg: any) => {
      console.log('Processando cliente', companyToken, msg)

      await new Promise(resolve => setTimeout(resolve, 10 * 1000))

      console.log('Finalizado cliente', companyToken, msg)
    }
  }
]

// Consumer
connect(COMPANIES, SERVICE, exchanges)
