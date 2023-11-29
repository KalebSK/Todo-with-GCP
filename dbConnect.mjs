import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.DB_URL,
    authToken: process.env.DB_KEY
});

console.log(client.execute("DROP TABLE users"));
console.log(client.execute("DROP TABLE todoLists"));
const createUserTable = `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            refreshToken TEXT NOT NULL UNIQUE)`;

const createTodoTable = `CREATE TABLE IF NOT EXISTS todoLists (
        id TEXT PRIMARY KEY,
        user TEXT NOT NULL,
        FOREIGN KEY (user) REFERENCES users (email))`;

console.log(await client.execute(createUserTable));
console.log(await client.execute(createTodoTable));
