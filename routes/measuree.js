async function routes (fastify, options) {
  //GET-ALL====================================================================
  fastify.get('/measuree', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        'SELECT * FROM kopi_bubuk.measuree'
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-ONE from id============================================================
  fastify.get('/measuree/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        'SELECT * FROM kopi_bubuk.measuree WHERE id=$1', [request.params.id]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })

  //CREATE====================================================================
  fastify.post('/measuree', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          INSERT INTO kopi_bubuk.measuree (
            name, address, date_of_birth
          )
          VALUES($1, $2, $3);
        `, [
          request.body['name'],
          request.body['address'],
          request.body['date_of_birth'],
        ]
      )

      return 'success'
    } finally {
      client.release()
    }
  })

  //UPDATE=================================================================
  fastify.put('/measuree/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          UPDATE kopi_bubuk.measuree 
          SET
            name=COALESCE($2, name),
            address=COALESCE($3, address),
            date_of_birth=COALESCE($4, date_of_birth)
          WHERE id=$1;
        `, [
          request.params['id'],
          request.body['name'],
          request.body['address'],
          request.body['date_of_birth'],
        ]
      )

      return 'success'
    } finally {
      client.release()
    }
  })

  //DELETE
  fastify.delete('/measuree/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          DELETE FROM kopi_bubuk.measuree
          WHERE id=$1;
        `, [request.params.id]
      )

      return 'success'
    } finally {
      client.release()
    }
  })
}

export default routes