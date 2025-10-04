import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import turso from "./db";
require('dotenv').config()

const app = fastify();

app.register(fastifyCors, { origin: "*" });

app.get("/", async (request, reply) => {
    return reply.status(200).send({ message: "Hello World" });
});

app.get("/items", async (request, reply) => {
    const itens = await turso.execute("SELECT * FROM items");
    if(!itens.rows.length)
    {
        reply.status(404).send({message: "No Items found"})
    }
    reply.send(itens.rows)
})

app.put("/items/:id", async (request, reply) => {
    const itens = await turso.execute("SELECT * FROM items");
    if(!itens.rowsAffected)
    {
        reply.status(404).send({message: "No Item found"})
    }
    reply.send(itens.rows)
})

app.delete("/items/:id", async (request, reply) => {
    const params = request.params as { id: number }
    const itens = await turso.execute("DELETE FROM items WHERE items.id = ?", [params.id]);
    if(!itens.rowsAffected)
    {
        reply.status(404).send({message: "No Item found"})
    }
    reply.send()
})
app.listen({ port: Number(process.env.PORT)}, () => {
    console.log("Server is running on port " + Number(process.env.PORT));
});
