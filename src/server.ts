import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import prisma from "./db";
import MutateItemInterface from './interfaces/MutateItemInterface'
import PostItemValidationSchema from './ValidationSchemas/PostItemValidationSchema'
import 'dotenv/config'

const port = process.env.PORT || 3000;
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const app = fastify();

app.register(fastifyCors, { 
    origin: "*", 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'content-type',
        'accept',
        'content-type',
        'authorization'
  ],
    maxAge: 86400,
});

app.get("/", async (request, reply) => {
    try {
        return reply.status(200).send({ message: "Hello World" });
    } catch (error) {
        console.error(error)
        reply.status(500).send({ message: "Internal Server Error" });
    }
});

app.get("/items", async (request, reply) => {
    try {
        const items = await prisma.items.findMany()
        if(!items)
        {
            return reply.status(404).send({message: "No Items found"})
        }
        reply.send(items)
    } catch (error) {
        console.error(error)
        reply.status(500).send({ message: "Internal Server Error" });
    }
});

app.post<{Body: MutateItemInterface}>("/items", PostItemValidationSchema ,async (request, reply) => {
    try {
        const { name, quantity } = request.body
        const itens = await prisma.items.create({
            data: {
                name, quantity
            }
        })
        reply.status(201).send()
    } catch (error) {
        console.error(error)
        reply.status(500).send({ message: "Internal Server Error" });
    }
});


app.put<{Body: MutateItemInterface}>("/items/:id", PostItemValidationSchema,async (request, reply) => {
    try {
        const params = request.params as { id: number }
        const { name, quantity } = request.body
        const item = await prisma.items.update({where: {id: Number(params.id)},
        data: {
            name, quantity
        }})
        if(!item)
        {
            return reply.status(404).send({message: "No Item found"})
        }
        reply.send()
    } catch (error) {
        console.error(error)
        reply.status(500).send({ message: "Internal Server Error" });
    }
});

app.delete("/items/:id", async (request, reply) => {
    try {
        const params = request.params as { id: number }
        const itens = await prisma.items.delete({where: {id: Number(params.id)}})
        reply.send()
    } catch (error) {
        console.error(error)
        reply.status(500).send({ message: "Internal Server Error" });
    }
})

app.listen({host: host, port: Number(port) }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})