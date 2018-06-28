'use strict';

//Dependencies 
const express = require('express');
const mtg = require('mtgsdk');
const pg = require('pg');
const cors = require('cors');

// Application Setup
const app = express();
const PORT = process.env.PORT;
// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

// Application Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Endpoints 
app.get('/users/:id', (req, res) => { // access user properties. 
  console.log(`We are looking at user: ${req.params.id}`);
  // res.send(`Looking at user: ${req.params.id}`);  
  let SQL = `SELECT * FROM users
  WHERE user_id = ${req.params.id};`;
  // res.send(`Looking at user: ${req.params.id}. So you want to query: ${SQL}`);
  client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error)
}); // end app.get for /users/:id

app.get('/collect/users/:id', (req, res) => { // access this users list of cards
  console.log(`Get on Collections for user: ${req.params.id}`);
  // res.send(`Collections for user: ${req.params.id}`);  
  let SQL = `SELECT card_id, amount FROM collect
  WHERE user_id = ${req.params.id};`;
  // res.send(`Collections for user: ${req.params.id}. So you want to query: ${SQL}`);
  client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error)

}); // end app.get for /collect/users/:id

app.post('/users', (req, res) => { // so this should add a user
  console.log(`We have POST for adding user: ${req.body.username}`); 
  res.send(`We attempted to add user ${req.body.user}`);  
  // let SQL = `
  // INSERT INTO users (username)
  // VALUES ($1);
  // `;
  // let values = [
  //   req.body.username 
  // ];
  // client.query(SQL, values).then(res => res.send(`User was Added`)).catch(console.error); 

}); // end app.post for /user/:id 

app.post('/collect/users/:id', (req, res) => { // this is where we add cards to a users collection
  console.log(`We have POST for adding cards for user: ${req.params.id}`); 
  res.send(`For user ${req.params.id} we want to add card ${req.body.card_id}`); 
  // let SQL = `
  // INSERT INTO collect (user_id, card_id, amount)
  // VALUES ($1, $2, $3);
  // `; 
  // let values = [
  //   req.params.id, 
  //   req.body.card_id, 
  //   1
  // ]; 
  // client.query(SQL, values).then(res => res.send(`Added card ${req.body.card_id} to user ${req.params.id} collection`)).catch(console.error); 

}); // end app.post for /collect/users/:id 

// Catch all for routes not asigned. 
app.get('*', (req, res) => res.status(404).send('Oh no. 404'));
// Listen 
app.listen(PORT, () => console.log(`The server is listening on PORT: ${PORT}`));
