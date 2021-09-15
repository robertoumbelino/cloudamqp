import * as amqplib from 'amqplib'

type Exchange = {
  exchange: string
  type: string
  fn: (companyToken: string, msg: any) => void
}

/**
 * Connect.
 */
export const connect = async (
  companies: string[],
  service: string,
  exchanges: Exchange[]
) => {
  const client = await amqplib.connect(process.env.AMQP_URL)
  const channel = await client.createChannel()

  companies.forEach(async companyToken => {
    const q = await channel.assertQueue(`${service}:${companyToken}`)

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
}
