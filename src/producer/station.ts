import 'dotenv/config'
import { connect } from 'amqplib'

// Publish
const run = async () => {
  try {
    const client = await connect(process.env.AMQP_URL)
    const channel = await client.createChannel()

    const exchange = 'customers'
    const headers = { company: 'hmaistoken' }

    Array(3)
      .fill('')
      .forEach((_, index) => {
        /**
         * Payload.
         */

        const data = { name: `Cliente ${index + 1}` }

        const options = { headers }

        /**
         * Publish.
         */
        channel.publish(
          exchange,
          '',
          Buffer.from(JSON.stringify(data)),
          options
        )
      })
  } catch ({ message }) {
    console.error(message)
  }
}

run()
