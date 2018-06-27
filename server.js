'use strict';

//Dependencies 
const express = require('express');
const mtg = require('mtgsdk')
const pg = require('pg');
const cors = require('cors');

//Setup

const app = express();
const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL)

client.connect();
client.on('error', err => console.log(err));
//Middleware
app.use(cors());

app.get('*', (req, res) => res.status(404).send('Oh no. 404'));

app.listen(PORT, () => console.log(`The server is listening on PORT: ${PORT}`));

