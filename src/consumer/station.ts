import 'dotenv/config'

import { sleep } from '../utils'
import { connect } from '../amqplib'

const exchanges = [
  {
    exchange: 'test-products',
    type: 'direct',
    fn: async (msg: any) => {
      console.log('Processando produto', msg.name)

      await sleep(2000)

      if (msg.name === 'Produto pai 2') {
        throw new Error('Erro no produto 2')
      }

      console.log('Finalizado produto', msg.name)
    }
  },
  {
    exchange: 'test-variant',
    type: 'direct',
    fn: async (msg: any) => {
      console.log('Processando variant', msg.name)

      await sleep(2000)

      console.log('Finalizado variant', msg.name)
    }
  }
]

// Consumer
connect(exchanges)
