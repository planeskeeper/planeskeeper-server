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
    let SQL = `INSERT INTO cards(title, rating, description)
    VALUES ($1, $2, $3, $4, $5, $6);`;
    
    console.log(req);
    
    let values = [
        req.body.image_url,
        req.body.name,
        req.body.color,
        req.body.card_id,
        req.body.set,
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
app.delete('/api/v1/cards/:id', (req, res) => {
    
    let SQL = `
    DELETE FROM cards WHERE card_id= ${req.params.id};
    `;
    
    client.query(SQL)
    
    .then(results => res.send(results.rows))
    .catch(console.error);
});


app.get('*', (req, res) => res.status(404).send('Oh no. 404'));

app.listen(PORT, () => console.log(`The server is listening on PORT: ${PORT}`));