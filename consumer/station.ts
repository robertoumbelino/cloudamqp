import 'dotenv/config'
import { connect } from 'amqplib'

const urlConnection = process.env.AMQP_URL

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
    fn: (companyToken: string, msg: any) =>
      console.log('cliente', companyToken, msg)
  }
]

const run = async () => {
  try {
    const client = await connect(urlConnection, {})
    const channel = await client.createChannel()

    COMPANIES.forEach(async companyToken => {
      const q = await channel.assertQueue(`${SERVICE}:${companyToken}`)

      exchanges.forEach(({ exchange, type }) => {
        console.log(companyToken, exchange)
        channel.assertExchange(exchange, type, { durable: false })
        channel.bindQueue(q.queue, exchange, '', { company: companyToken })
      })

      const onReceive = (msg: any) => {
        const data = JSON.parse(msg.content.toString())

        const receive = exchanges.find(
          ({ exchange }) => exchange === msg.fields.exchange
        )

        if (!receive) return

        receive.fn(companyToken, data)
      }

      channel.consume(q.queue, onReceive, { noAck: true })
    })
  } catch ({ message }) {
    console.error(message)
  }
}

run()
