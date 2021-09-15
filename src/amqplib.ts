import { connect as connectAMQP, ConsumeMessage } from 'amqplib'

/**
 * Json data.
 */
type Json = Record<string, unknown>

/**
 * Exchange type.
 */
type Exchange = {
  exchange: string
  type: string
  fn: (companyToken: string, msg: Json | Json[]) => Promise<void> | void
}

/**
 * Connect.
 */
export const connect = async (
  companies: string[],
  service: string,
  exchanges: Exchange[]
) => {
  const client = await connectAMQP(process.env.AMQP_URL)
  const channel = await client.createChannel()
  channel.prefetch(1)

  companies.forEach(async companyToken => {
    const q = await channel.assertQueue(`${service}:${companyToken}`)

    exchanges.forEach(({ exchange, type }) => {
      console.log(companyToken, exchange)
      channel.assertExchange(exchange, type, { durable: false })
      channel.bindQueue(q.queue, exchange, '', { company: companyToken })
    })

    const onReceive = async (msg: ConsumeMessage | null) => {
      if (msg === null) return

      try {
        const data = JSON.parse(msg.content.toString())

        const receive = exchanges.find(
          ({ exchange }) => exchange === msg.fields.exchange
        )

        if (!receive) return

        await receive.fn(companyToken, data)

        channel.ack(msg)
      } catch {
        channel.reject(msg, true)
      }
    }

    channel.consume(q.queue, onReceive, { noAck: false })
  })
}
