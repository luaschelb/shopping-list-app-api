import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import turso from "./db";

const app = fastify();

app.register(fastifyCors, { origin: "*" });

app.get("/", async (request, reply) => {
    return reply.status(200).send({ message: "Hello World" });
});

app.get("/items", async (request, reply) => {
    const itens = await turso.execute("SELECT * FROM items");
    if(!itens)
    {
        reply.status(404).send({message: "No Item found"})
    }
    reply.send(itens.rows)
})

app.listen({ port: 3333 }, () => {
    console.log("Server is running on port 3333");
});
