// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require('express');
const path = require('path');
const { Client } = require('pg');
const next = require('next');
// const app = express();
// const port = 3000;

// const staticUrl = path.join(__dirname, '../../public');
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(staticUrl));

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const client = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  });
  
  client.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connected to PostgreSQL');
    }
  });
  const server = express();

  server.get("/test", (req, res) => {
    console.log("connected")
    res.json("logs on client")
  });
  
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
});


// import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }
