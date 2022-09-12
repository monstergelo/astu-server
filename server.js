import helloRoute from './routes/hello.js'
import Fastify from 'fastify'
import dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT || 3000

// Require the framework and instantiate it
const fastify = Fastify({ logger: true })

fastify.register(helloRoute);

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()