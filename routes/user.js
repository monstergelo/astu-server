import bcrypt from 'bcrypt'

async function routes (fastify, options) {
  //REGISTER====================================================================
  fastify.post('/register', async (request, reply) => {
    const username = request.body['username']
    const password = bcrypt.hashSync(request.body['password'], 2);

    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
        with new_measurer as (
          INSERT INTO kopi_bubuk.measurer (
            name, email, location
          )
          VALUES($1, $2, $3)
          RETURNING id
        )
        INSERT INTO kopi_bubuk.user (
          username, password, measurer_id
        )
        VALUES($4, $5, (select id from new_measurer))
        RETURNING id
        `, [
          request.body['name'],
          request.body['email'],
          request.body['location'],
          username,
          password
        ]
      )

      return {
        status: 'success',
        data: value.rows[0]
      }
    } finally {
      client.release()
    }
  })
  //LOGIN====================================================================
  fastify.post('/login', async (request, reply) => {
    const username = request.body['username']

    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          SELECT * 
          FROM kopi_bubuk.user u
          JOIN kopi_bubuk.measurer m
          ON u.measurer_id = m.id
          WHERE username=$1;
        `, [
          username,
        ]
      )

      const hashPassword = value.rows[0].password;
      const isMatched = bcrypt.compareSync(request.body['password'], hashPassword);

      if (isMatched) {
        const token = fastify.jwt.sign({ 
          id: value.rows[0].id,
          username: value.rows[0].username,
          measurer_id: value.rows[0].measurer_id,
        })
        reply.setCookie('jwt', token, {
          httpOnly: true,
        })

        return {
          status: 'success',
          data: {
            id: value.rows[0].id,
            username: value.rows[0].username,
            name: value.rows[0].name,
            email: value.rows[0].email,
            location: value.rows[0].location,
            token
          }
        }
      }

      return {
        status: 'error',
        msg: 'username/password not found'
      }
    } finally {
      client.release()
    }
  })
  //LOGOUT====================================================================
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('jwt')

    return {
      status: 'success',
      msg: 'successfully logged out'
    }
  })
}

export default routes