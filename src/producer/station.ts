import 'dotenv/config'
import { connect } from 'amqplib'

// Publish
const run = async () => {
  try {
    const client = await connect(process.env.AMQP_URL)
    const channel = await client.createChannel()

    /**
     * Payload.
     */
    const exchange = 'customers'
    const headers = { company: 'hmaistoken' }
    const data = { name: 'Cliente 57' }

    const options = { headers }

    /**
     * Publish.
     */
    channel.publish(exchange, '', Buffer.from(JSON.stringify(data)), options)
  } catch ({ message }) {
    console.error(message)
  }
}

run()
