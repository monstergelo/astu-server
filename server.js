import helloRoute from './routes/hello.js'
import measurementRoute from './routes/measurement.js'
import measureeRoute from './routes/measuree.js'
import facilityRoute from './routes/facility.js'
import userRoute from './routes/user.js'
import Fastify from 'fastify'
// import session from '@fastify/session'
import cookie from '@fastify/cookie'
import auth from '@fastify/auth'
import jwt from '@fastify/jwt'
import postgres from '@fastify/postgres'
// import PgSession from 'connect-pg-simple'
import dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT || 3000
const host = process.env.HOST || "0.0.0.0"

// Require the framework and instantiate it
const fastify = Fastify({ logger: true })
// const SessionStore = PgSession(session)

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

// fastify.register(session, {
//   store: new SessionStore({
//     pool: fastify.pg.pool,
//     schemaName: 'kopi_bubuk',
//     tableName: 'session'
//   }),
//   secret: 'wawawakujhyvkuxtukxkujugkuihboyuboiboubyoioyoybiwaw',
//   resave: false,
//   cookieName: 'sessionId',
//   cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: false } // 30 days
// })

fastify.decorate('verifyJWTandLevel', function (request, reply, done) {
  const token = request.cookies.jwt
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

