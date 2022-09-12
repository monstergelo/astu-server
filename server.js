import helloRoute from './routes/hello.js'
import Fastify from 'fastify'
import dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT || 3000
const host = process.env.HOST || "0.0.0.0"
console.log(port, host)

// Require the framework and instantiate it
const fastify = Fastify({ logger: true })

fastify.register(helloRoute);

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port, host })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()