import 'dotenv/config'
import { connect } from 'amqplib'

const urlConnection = process.env.AMQP_URL

const COMPANIES = ['hmaistoken']

const exchanges = [
  {
    exchange: 'saved-customer',
    type: 'headers',
    fn: (companyToken: string, msg: any) =>
      console.log('saved customer', companyToken, msg)
  }
]

const SERVICE = 'crm'

// Consumer
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
