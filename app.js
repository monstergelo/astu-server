import helloRoute from './routes/hello.js'
import measurementRoute from './routes/measurement.js'
import measureeRoute from './routes/measuree.js'
import facilityRoute from './routes/facility.js'
import userRoute from './routes/user.js'
import cookie from '@fastify/cookie'
import auth from '@fastify/auth'
import jwt from '@fastify/jwt'
import postgres from '@fastify/postgres'
import dotenv from 'dotenv'

dotenv.config();

async function setup (fastify, options) {
  fastify.register(cookie)
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })
  fastify.register(postgres, {
    connectionString: process.env.DB_URI,
    ssl: {
      rejectUnauthorized: false
    }
  })
  await fastify.after()

  fastify.decorate('verifyJWTandLevel', function (request, reply, done) {
    const auth = request?.headers?.authorization;
    const token = request.cookies.jwt || auth.split(' ')[1]
    const verified = fastify.jwt.verify(token)
    request.user = verified

    if(verified) {
      done()
    }
  })
  fastify.register(auth)

  fastify.register(helloRoute);
  fastify.register(measurementRoute);
  fastify.register(measureeRoute);
  fastify.register(facilityRoute);
  fastify.register(userRoute);
}

export default setup

