import Fastify from 'fastify'
import turso from './db'

const fastify = Fastify({
    logger: true
})

fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
})

fastify.get('/items', async function (request, reply) {
    const itens = await turso.execute("SELECT * FROM items");
    if(!itens)
    {
        reply.status(404).send({message: "No Item found"})
    }
    reply.send(itens.rows)
})


fastify.listen({ port: 8080 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})