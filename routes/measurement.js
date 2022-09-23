async function routes (fastify, options) {
  //GET-ALL====================================================================
  fastify.get('/measurement', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        'SELECT * FROM kopi_bubuk.measurement'
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-ONE from id============================================================
  fastify.get('/measurement/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        'SELECT * FROM kopi_bubuk.measurement WHERE id=$1', [request.params.id]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })

  //CREATE====================================================================
  fastify.post('/measurement', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          INSERT INTO kopi_bubuk.measurement (
            date_of_visit, sex, date_of_birth, is_approximate_date, is_unknown_date, weight, height, recumbent_weight, recumbent_height,
            oedema, head_circumference, muac, triceps_skinfold, subscapular_skinfold, status,
            measuree_id, facility_id
          )
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
        `, [
          request.body['date_of_visit'],
          request.body['sex'],
          request.body['date_of_birth'],
          request.body['is_approximate_date'],
          request.body['is_unknown_date'],
          request.body['weight'],
          request.body['height'],
          request.body['recumbent_weight'],
          request.body['recumbent_height'],
          request.body['oedema'],
          request.body['head_circumference'],
          request.body['muac'],
          request.body['triceps_skinfold'],
          request.body['subscapular_skinfold'],
          request.body['status'],
          request.body['measuree_id'],
          request.body['facility_id'],
        ]
      )

      return 'success'
    } finally {
      client.release()
    }
  })

  //UPDATE=================================================================
  fastify.put('/measurement/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          UPDATE kopi_bubuk.measurement 
          SET
            date_of_visit=COALESCE($2, date_of_visit),
            sex=COALESCE($3, sex),
            date_of_birth=COALESCE($4, date_of_birth),
            is_approximate_date=COALESCE($5, is_approximate_date),
            is_unknown_date=COALESCE($6, is_unknown_date),
            weight=COALESCE($7, weight),
            height=COALESCE($8, height),
            recumbent_weight=COALESCE($9, recumbent_weight),
            recumbent_height=COALESCE($10, recumbent_height),
            oedema=COALESCE($11, oedema),
            head_circumference=COALESCE($12, head_circumference),
            muac=COALESCE($13, muac),
            triceps_skinfold=COALESCE($14, triceps_skinfold),
            subscapular_skinfold=COALESCE($15, subscapular_skinfold),
            subscapular_skinfold=COALESCE($16, status),
            measuree_id=COALESCE($17, measuree_id),
            facility_id=COALESCE($18, facility_id)
          WHERE id=$1;
        `, [
          request.params['id'],
          request.body['date_of_visit'],
          request.body['sex'],
          request.body['date_of_birth'],
          request.body['is_approximate_date'],
          request.body['is_unknown_date'],
          request.body['weight'],
          request.body['height'],
          request.body['recumbent_weight'],
          request.body['recumbent_height'],
          request.body['measured'],
          request.body['oedema'],
          request.body['head_circumference'],
          request.body['muac'],
          request.body['triceps_skinfold'],
          request.body['subscapular_skinfold'],
          request.body['subscapular_skinfold'],
          request.body['status'],
          request.body['facility_id'],
        ]
      )

      return 'success'
    } finally {
      client.release()
    }
  })

  //DELETE==============================================================
  fastify.delete('/measurement/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          DELETE FROM kopi_bubuk.measurement
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