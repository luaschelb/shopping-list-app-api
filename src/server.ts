import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import turso from "./db";
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
        reply.status(500).send({ message: "Internal Server Error" });
    }
});

app.get("/items", async (request, reply) => {
    try {
        const itens = await turso.execute("SELECT * FROM items");
        if(!itens.rows.length)
        {
            return reply.status(404).send({message: "No Items found"})
        }
        reply.send(itens.rows)
    } catch (error) {
        reply.status(500).send({ message: "Internal Server Error" });
    }
});

interface ItemInterface {
    name: string,
    quantity: number
}

let ItemSchema = {
    schema: {
        body: {
            type: 'object',
            required: ["name", "quantity"],
            properties: {
                name: {type: 'string'},
                quantity: {type: 'number'}
            }
        }
    }
}


app.post<{Body: ItemInterface}>("/items", ItemSchema ,async (request, reply) => {
    try {
        const { name, quantity } = request.body
        const itens = await turso.execute("INSERT INTO items (name, quantity) VALUES (?, ?)", [name, quantity]);
        reply.status(201).send()
    } catch (error) {
        reply.status(500).send({ message: "Internal Server Error" });
    }
});


app.put<{Body: ItemInterface}>("/items/:id", ItemSchema,async (request, reply) => {
    try {
        const params = request.params as { id: number }
        const { name, quantity } = request.body
        const itens = await turso.execute("SELECT * FROM items where items.id = ?", [params.id]);
        if(!itens.rows.length)
        {
            return reply.status(404).send({message: "No Item found"})
        }
        const update = await turso.execute("UPDATE items SET name=?, quantity=? WHERE items.id = ? ", [name, quantity, params.id])
        reply.send()
    } catch (error) {
        reply.status(500).send({ message: "Internal Server Error" });
    }
});

app.delete("/items/:id", async (request, reply) => {
    try {
        const params = request.params as { id: number }
        const itens = await turso.execute("DELETE FROM items WHERE items.id = ?", [params.id]);
        if(!itens.rowsAffected)
        {
            return reply.status(404).send({message: "No Item found"})
        }
        reply.send()
    } catch (error) {
        reply.status(500).send({ message: "Internal Server Error" });
    }
})

app.listen({host: host, port: Number(port) }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})