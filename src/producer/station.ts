import 'dotenv/config'
import { connect } from 'amqplib'

const urlConnection = process.env.AMQP_URL

// Publish
const run = async () => {
  try {
    const client = await connect(urlConnection)
    const channel = await client.createChannel()

    /**
     * Publish.
     */
    channel.publish(
      'customers',
      '',
      Buffer.from(JSON.stringify({ name: 'Cliente 57' })),
      {
        headers: { company: 'hmaistoken' }
      }
    )
  } catch ({ message }) {
    console.error(message)
  }
}

run()
