import 'dotenv/config'
import {
  Channel,
  Connection,
  ConsumeMessage,
  connect as connectAMQP
} from 'amqplib'

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
  fn: (msg: Json | Json[]) => Promise<void> | void
}

const ATTEMPTS = 3
const DELAY_MESSAGE = 2000
const queueName = 'test-products'

/**
 * AMQP client.
 */
export let client: Connection

/**
 * Connected channel.
 */
export let channel: Channel

/**
 * Connect.
 */
export const connect = async (exchanges: Exchange[]) => {
  /**
   * Client connection.
   */
  client = await connectAMQP(process.env.AMQP_URL)

  /**
   * Create channel.
   */
  channel = await client.createChannel()

  /**
   * Process quantity simultaneously.
   */
  channel.prefetch(1)

  /**
   * Queue config.
   */
  await channel.assertQueue(queueName, { maxPriority: 255 })

  /**
   * Log.
   */
  console.log(`Registrando fila ${queueName}`)

  /**
   * Bind queue to exchanges.
   */
  exchanges.forEach(({ exchange, type = 'direct' }) => {
    /**
     * Normal queue.
     */
    channel.assertExchange(exchange, 'x-delayed-message', {
      durable: true,
      arguments: { 'x-delayed-type': type },
      autoDelete: false
    })
    channel.bindQueue(queueName, exchange, '')
  })

  /**
   * Consume.
   */
  const onReceive = async (msg: ConsumeMessage | null) => {
    /**
     * If message is null, then finish process.
     */
    if (msg === null) {
      /**
       * Log.
       */
      console.log('Mensagem inválida (null)')

      return
    }

    /**
     * Company token.
     */
    const companyToken = msg.properties.headers.companyToken

    /**
     * Log.
     */
    console.log(`Consumindo ${msg.fields.exchange} na empresa ${companyToken}`)

    try {
      /**
       * Get data from message.
       */
      const data = JSON.parse(msg.content.toString())

      /**
       * Find exchange function by message.
       */
      const receive = exchanges.find(
        ({ exchange }) => exchange === msg.fields.exchange
      )

      /**
       * If exchange function is not found, then finish process.
       */
      if (!receive) {
        /**
         * Log.
         */
        console.log(
          `Recurso ${msg.fields.exchange} na empresa ${companyToken} não encontrado, será removido da fila`
        )

        return channel.ack(msg)
      }

      /**
       * Log.
       */
      console.log(
        `Executando consumidor ${msg.fields.exchange} na empresa ${companyToken}`
      )

      /**
       * Execute exchange function.
       */
      await receive.fn(data)

      /**
       * Acknowledge message.
       */
      channel.ack(msg)
    } catch ({ message }) {
      const currentAttempts = msg.properties.headers.attempts || 1

      /**
       * Log.
       */
      console.log(
        `Houve um erro no consumidor ${msg.fields.exchange} na empresa ${companyToken}, tentativas (${currentAttempts}). Erro: ${message}`
      )

      /**
       * Is to retry.
       */
      const isToRetry = currentAttempts < ATTEMPTS

      /**
       * Retry.
       */
      if (isToRetry) {
        /**
         * Delay time.
         */
        const delayTime = Math.pow(2, currentAttempts) * DELAY_MESSAGE

        /**
         * Log.
         */
        console.log(
          `Retentativa no consumidor ${msg.fields.exchange} na empresa ${companyToken}, com delay de ${delayTime} segundos`
        )

        channel.ack(msg)

        return channel.publish(msg.fields.exchange, '', msg.content, {
          ...msg.properties,
          headers: {
            ...msg.properties.headers,
            'x-delay': delayTime,
            attempts: currentAttempts + 1
          },
          priority: 255
        })
      }

      /**
       * Log.
       */
      console.log(
        `Foi realizado ${ATTEMPTS} no recurso ${
          msg.fields.exchange
        } tentativas sem sucesso, será removido da fila o payload: ${JSON.stringify(
          msg
        )}`
      )

      /**
       * Finish invalid message.
       */
      channel.reject(msg, false)
    }
  }

  /**
   * Create consumer.
   */
  channel.consume(queueName, onReceive, { noAck: false })
}
