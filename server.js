import helloRoute from './routes/hello.js'
import measurementRoute from './routes/measurement.js'
import measureeRoute from './routes/measuree.js'
import facilityRoute from './routes/facility.js'
import Fastify from 'fastify'
import dotenv from 'dotenv'
import postgres from '@fastify/postgres'

dotenv.config();
const port = process.env.PORT || 3000
const host = process.env.HOST || "0.0.0.0"

// Require the framework and instantiate it
const fastify = Fastify({ logger: true })

fastify.register(postgres, {
  connectionString: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
})

fastify.register(helloRoute);
fastify.register(measurementRoute);
fastify.register(measureeRoute);
fastify.register(facilityRoute);

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

