async function routes (fastify, options) {
  //GET-ALL====================================================================
  fastify.get('/facility', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        'SELECT * FROM kopi_bubuk.facility'
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-ONE from id============================================================
  fastify.get('/facility/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        'SELECT * FROM kopi_bubuk.facility WHERE id=$1', [request.params.id]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })

  //CREATE====================================================================
  fastify.post('/facility', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          INSERT INTO kopi_bubuk.facility (
            name, address, city
          )
          VALUES($1, $2, $3);
        `, [
          request.body['name'],
          request.body['address'],
          request.body['city'],
        ]
      )

      return 'success'
    } finally {
      client.release()
    }
  })

  //UPDATE=================================================================
  fastify.put('/facility/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          UPDATE kopi_bubuk.facility 
          SET
            name=COALESCE($2, name),
            address=COALESCE($3, address),
            city=COALESCE($4, city)
          WHERE id=$1;
        `, [
          request.params['id'],
          request.body['name'],
          request.body['address'],
          request.body['city'],
        ]
      )

      return 'success'
    } finally {
      client.release()
    }
  })

  //DELETE===================================================================
  fastify.delete('/facility/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          DELETE FROM kopi_bubuk.facility
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