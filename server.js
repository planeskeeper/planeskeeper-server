'use strict';

// Dependencies 
const express = require('express');
const mtg = require('mtgsdk')
const pg = require('pg');
const cors = require('cors');

// Application Setup
const app = express();
const PORT = process.env.PORT;
// Database Setup
const client = new pg.Client(process.env.DATABASE_URL)
client.connect();
client.on('error', err => console.log(err));

// Application Middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));

// Endpoints 

app.get('/api/v1/users', (req, res) => { //Pulls all users from DB
  console.log('Pulled all users from DB (GET request)');
  res.send('We attempted to pull all users from DB'); 
  // let SQL = `SELECT * FROM users;`;
  // client.query(SQL)
  // .then(results => res.send(results.rows))
  // .catch(console.error);
}); // end app.get for users

app.get('/api/v1/cards', (req, res) => { //Pull all cards from DB.
  console.log('Pulled all cards from DB (GET request)');
  res.send(`attempted to get all cards from DB`); 
  // let SQL = `SELECT * FROM cards;`;
  // client.query(SQL)
  // .then(results => res.send(results.rows))
  // .catch(console.error);
}); // end app.get for cards

app.get('/api/v1/collection/:id', (req, res) => { //Pull all cards from DB.
  console.log(`looking for cards collected by ${req.params.id}`);
  // res.send(`attempted to see all cards collected by ${req.params.id}`); 
  let user_card_list = `SELECT card_id FROM users_cards WHERE user_id = ${req.params.id}`;
  let SQL = `SELECT * FROM cards
    WHERE id IN (${user_card_list});`; 
  console.log(`With search of ${SQL}`); 
  client.query(SQL)
  .then(results => res.send(results.rows))
  .catch(console.error);
}); // end app.get for cards

app.post('/api/v1/users', (req, res) => { //Add new user to DB
  console.log(`We have POST for adding user: ${req.body.username}`); 
  res.send(`We attempted to add user ${req.body.username}`);  
  // let SQL = `INSERT INTO users(user_name)
  // VALUES ($1);`;
  // let values = [
  //     req.body.username,
  // ];
  // client.query(SQL, values)
  // .then( () => res.send('New user added!'))
  // .catch(console.error(err));
}); // end adding new user to DB 

app.post('/api/v1/cards', (req, res) => { //Add a new card to the DB.
  console.log(`POST to add a card ${req.body.name}`);
  res.send(`We attempted to add card ${req.body.name}`); 
  // let SQL = `INSERT INTO cards(
  //   user_id, color, name, card_id, image_url, body, rarity, set)
  //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
  // let values = [
  //   req.body.user_id,
  //   req.body.color,
  //   req.body.name,
  //   req.body.card_id,
  //   req.body.image_url,
  //   req.body.set,
  //   req.body.body,
  //   req.body.rarity,
  //   req.body.rarity
  // ];
  // client.query(SQL, values)
  //   .then( () => res.send('Inserted new card into db'))
  //   .catch(console.error(err));
}); // end of adding card to database

app.delete('/api/v1/collection/:id', (req, res) => { //Remove card from users collection 
  console.log(`DELETE ${req.body.card_id} card from user# ${req.params.id} collection`);    
  res.send(`DELETE ${req.body.card_id} card from user# ${req.params.id} collection`);    
    // let SQL = `DELETE FROM users_cards 
    //   WHERE user_id = ${req.params.id}
    //   AND card_id = ${req.body.card_id}; 
    // `;
    // client.query(SQL)
    // .then(results => res.send('Delete successful'))
    // .catch(console.error);
}); // end removal of cards from user's colllection 

// Catch all for routes not asigned. 
app.get('*', (req, res) => res.status(404).send('Oh no. 404'));
// Listen 
app.listen(PORT, () => console.log(`The server is listening on PORT: ${PORT}`));