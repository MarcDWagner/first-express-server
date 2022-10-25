'use strict';

console.log('First server');

// ***** REQUIRES *****

const express = require('express');
require('dotenv').config();


// once express is in we need to us it - per express docs
// app === server
const app = express();

// define port
const PORT = process.env.PORT || 3002;
// 3002 - if server is up on 3002, then something is wrong with .env file or I didn't bring in dotenv

// ***** ENDPOINTS *****

// base endpoint
app.get('/', (request, response) => {
  console.log('shows up in terminal');
  response.status(200).send('Welome to my server');
});

// ***** ERROR HANDLING *****



// ***** SERVER START *****

app.listen(PORT, ()=> console.log(`Up and running on port ${PORT}`));

