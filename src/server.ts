import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import turso from "./db";
require('dotenv').config()

const app = fastify();

app.register(fastifyCors, { origin: "*" });

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

app.put("/items/:id", async (request, reply) => {
    try {
        const itens = await turso.execute("SELECT * FROM items");
        if(!itens.rowsAffected)
        {
            return reply.status(404).send({message: "No Item found"})
        }
        reply.send(itens.rows)
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

app.listen({ port: Number(process.env.PORT)}, () => {
    console.log("Server is running on port " + Number(process.env.PORT));
});
