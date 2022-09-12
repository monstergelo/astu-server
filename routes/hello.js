async function routes (fastify, options) {
  fastify.get('/:name', async (request, reply) => {
    const name = request.params.name || 'world'
    return { hello: name }
  })
}

export default routes