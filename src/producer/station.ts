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

        const options = { headers, priority: 2 }

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

    Array(3)
      .fill('')
      .forEach((_, index) => {
        /**
         * Payload.
         */

        const data = { name: `Produto ${index + 1}` }

        const options = { headers, priority: 1 }

        /**
         * Publish.
         */
        channel.publish(
          'products',
          '',
          Buffer.from(JSON.stringify(data)),
          options
        )
      })

    Array(3)
      .fill('')
      .forEach((_, index) => {
        /**
         * Payload.
         */

        const data = { name: `Cliente ${index + 4}` }

        const options = { headers, priority: 2 }

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
