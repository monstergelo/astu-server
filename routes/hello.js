async function routes (fastify, options) {
  fastify.get('/write/:name', async (request, reply) => {
    const name = request.params.name || 'wawa'

    request.session.reload()
    request.session.user = {
      name: name
    }

    reply.send(request.session.user)
  })

  fastify.get('/read', async (request, reply) => {
    return JSON.stringify(request.session.sessionId)
  })

  fastify.get('/jwt-sign', async (request, reply) => {
    const token = fastify.jwt.sign({ 
      name: 'token name'
    })
    reply.setCookie('jwt', token, {
      httpOnly: true,
    })
    reply.send({ token })
  })

  fastify.get('/jwt-decode', async (request, reply) => {
    const token = request.cookies.jwt
    const verified = await fastify.jwt.verify(token)
    return {
      token,
      verify: verified
    }
  })
}

export default routes