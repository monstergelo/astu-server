async function routes (fastify, options) {
  fastify.get('/', async (request, reply) => {
    const name = request.params.name || 'world'
    return { hello: name }
  })
}

export default routes