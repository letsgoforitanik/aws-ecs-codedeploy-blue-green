import http from "http";
import os from "os";
import express from "express";

import { fib, getPrimes } from "./fn";

const app = express();

app.get('/primes/:num', (req, res) => {
    const num = Number(req.params.num);
    const primes = getPrimes(num);
    return res.send(`First ${num} prime numbers are [${primes.join(',')}]`);
});


app.get('/fib/:num', (req, res) => {
    const num = Number(req.params.num);
    const answer = fib(num - 1) + fib(num - 2);
    return res.send(`Fibonacci(${num}) number is ${answer}`);
});

app.get('/author', (req, res) => res.send(`Authored by Aniruddha Banerjee v3`));

app.get('/', (req, res) => res.send(`Hello from host ${os.hostname()} | Aniruddha Banerjee v3`));

const server = http.createServer(app);
server.listen(3000, () => console.log(`Server is listening on port 3000`));