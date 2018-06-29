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




//Pulls all users from DB
app.get('/api/v1/users', (req, res) => {
    console.log('Pulled all users from DB (GET request)')
    let SQL = `SELECT * FROM users;`;
    client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Pull all cards from DB.
app.get('/api/v1/cards', (req, res) => {
    console.log('Pulled all cards from DB (GET request)')
    let SQL = `SELECT * FROM cards;`;
    client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Add new user to DB
app.post('/api/v1/users', (req, res) => {
    console.log(req.body);
    let SQL = `INSERT INTO users(user_name)
    VALUES ($1);`;
    
    
    let values = [
        req.body.username,
    ];
    
    
    client.query(SQL, values)
    .then(function () {
        res.send('New user added!')
    })
    .catch(function (err) {
        console.error(err);
    })
});

//Add a new card to the DB.
app.post('/api/v1/cards', (req, res) => {
    let SQL = `INSERT INTO cards(user_id, color, name, card_id, image_url, body, rarity, set)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
    
    console.log(req);
    
    let values = [
        req.body.user_id,
        req.body.color,
        req.body.name,
        req.body.card_id,
        req.body.image_url,
        req.body.set,
        req.body.body,
        req.body.rarity,
        req.body.rarity
    ];
    
    
    client.query(SQL, values)
    .then(function () {
        res.send('Inserted new card into db')
    })
    .catch(function (err) {
        console.error(err);
    })
});

//Remove card from DB
app.delete('/api/v1/collection/:id', (req, res) => {
    
    let SQL = `
    DELETE FROM collection WHERE card_id= ${req.params.id};
    `;
    
    client.query(SQL)
    
    .then(results => res.send(results.rows))
    .catch(console.error);
});


app.get('/api/v1/users:id', (req, res) => {
    console.log(req.body);
    let SQL = `SELECT `
    
    
    let values = [
        req.body.username,
    ];
    
    
    client.query(SQL, values)
    .then(function () {
        res.send('New user added!')
    })
    .catch(function (err) {
        console.error(err);
    })
});

// Endpoints 

app.get('/api/v1/users', (req, res) => { //Pulls all users from DB
  console.log('Pulled all users from DB (GET request)');
  res.send('We attempted to pull all users from DB'); 
  // let SQL = `SELECT * FROM users;`;
  // client.query(SQL)
  // .then(results => res.send(results.rows))
  // .catch(console.error);
}); // end app.get for users

app.get('/api/v1/cards/search:id', (req, res) => { //Looking for card with api_card_id value of ;id 
  console.log(`looking for api_card_id ${req.params.id}`);
  res.send(`attempted to look at api_card_id ${req.params.id}`); 
  let SQL = `SELECT id FROM cards
    WHERE api_card_id = '${req.params.id}';`;
  client.query(SQL)
  .then(results => res.send(results.rows))
  .catch(console.error);
}); // end app.get for cards SEEMS TO WORK


app.get('/api/v1/cards/:id', (req, res) => { //Looking for card with DB cards table id = :id
  console.log(`Looking for card in our DB with cards table card_id ${params.req.id}`);
  res.send(`attempted to look for card in our DB with card_id ${params.req.id}`); 
  // let key = `card_id`; 
  // let value = req;
  // console.log(value); 
  // console.log(`Key ${key}, Value ${value}`); 
  // res.send(req.body); 
  // let SQL = `SELECT * FROM cards
  //   WHERE ${key} = ${value};`;
  // client.query(SQL)
  // .then(results => res.send(results.rows))
  // .catch(console.error);

}); // end app.get for cards

app.get('/api/v1/cards:id', (req, res) => { //Pull cards in collection of user :id
  console.log(`looking for cards collected by user ${req.params.id}`);

  console.log('====================================================');
  // res.send(`attempted to see all cards collected by ${req.params.id}`); 

  let user_card_list = `SELECT card_id FROM users_cards WHERE user_id = ${req.params.id}`;
  let SQL = `SELECT * FROM cards
    WHERE card_id IN (${user_card_list});`; 
  console.log(`With search of ${SQL}`); 
  console.log('------------------------------------------------');
  client.query(SQL)
  .then(results => res.send(results.rows))
  .catch(console.error);
}); // end app.get for retrieving the collection for user :id 

app.post('/api/v1/collection', (req, res) => { //Looking for card with api_card_id value of :id 
  console.log(`Adding for user ${req.body.user_id} card name: ${req.body.name}`);

  // res.send(`attempted to add to user ${req.body.user_id} card name: ${req.body.name}`); 
  
  if (req.body.card_id !== 'search') { 
    console.log('we should skip to addRelations');
    console.log('------------Skip to step 3! -------------------------------');
    addRelation(req.body.card_id); 
  } else { // we are adding from search and need to check if it is in our cards table
    console.log('Maybe we know this card, maybe not! ');
    console.log('------------------------------------------------');
    let SQL = `INSERT INTO cards(name, api_card_id, image_url, color, set, rarity, body) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    ON CONFLICT DO NOTHING;`; 
    let values = [
      req.body.name, 
      req.body.api_card_id, 
      req.body.image_url, 
      req.body.color, 
      req.body.set, 
      req.body.rarity, 
      req.body.body
    ]; 
    client.query(SQL, values, function(err) {
      if(err) console.error(err);
      console.log('inside of INSERT for the card');
      console.log('------------Step 1 ------------------------------------');
      searchId(); 
    });
    
    function searchId() {
      console.log('Inside searchId function');
      console.log('-----------------Step 2-------------------------------');

      let SQL = `SELECT card_id FROM cards WHERE api_card_id=$1;`; 
      let values = [req.body.api_card_id];
      console.log(SQL); 
      console.log(values);
      client.query(SQL, values, function (err, results) {
        if (err) console.error(err); 
        console.log(`These are the results:`);
        console.log(results); 
        console.log('------==== What the heck! =====------------');
        addRelation(results.rows[0].card_id);
      });
    } // end searchId funciton
  } // end of else section: AKA we are checking on card we got from search results

  function addRelation(card_id) {
    console.log('Inside addRelations function'); 
    let SQL = `
      INSERT INTO users_cards(user_id, card_id, amount)
      VALUES ($1, $2, $3);
      `;
    let values = [
      req.body.user_id, 
      card_id, 
      1 // the amount of this card the user has in collection. 
    ];
    client.query(SQL, values)
      .then(results => {
        console.log('Inserting the relationship!');
        console.log('----------------Step 3--------------------------------');
        res.send('insert to collections complete'); 
      })
      .catch(console.error); // end client.query
  } // end addRelations function 

  // // .then(results => res.send(results.rows))
  // .catch(console.error);
}); // end app.post for cards that may or may not be in our cards table

app.post('/api/v1/users', (req, res) => { //Add new user to DB
  console.log(`We have POST for adding user: ${req.body.username}`); 
  res.send(`We attempted to add user ${req.body.username}`);  
  let SQL = `INSERT INTO users(user_name)
  VALUES ($1);`;
  let values = [
      req.body.username,
  ];
  client.query(SQL, values)
  .then( () => res.send('New user added!'))
  .catch(console.error(err));
}); // end adding new user to DB 

app.post('/api/v1/cards', (req, res) => { //Add a new card to the DB.
  console.log(`POST to add a card ${req.body.name}`);
  res.send(`We attempted to add card ${req.body.name}`); 
  let SQL = `INSERT INTO cards(
    name, api_card_id, image_url, color, set, rarity, body)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
  let values = [
    req.body.name,
    req.body.api_card_id,
    req.body.image_url,
    req.body.color,
    req.body.set,
    req.body.rarity,
    req.body.body
  ];
  client.query(SQL, values)
    .then( () => res.send('Inserted new card into db'))
    .catch(console.error(err));
}); // end of adding card to database

app.delete('/api/v1/cards:id', (req, res) => { //Remove card from users collection 
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