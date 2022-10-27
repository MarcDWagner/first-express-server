'use strict';

console.log('First server');

// ***** REQUIRES *****

const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json');
const cors = require('cors');
const axios = require('axios');
// cors is middleware to share resources across the internet


// once express is in we need to us it - per express docs
// app === server
const app = express();

app.use(cors());

// define port
const PORT = process.env.PORT || 3002;
// 3002 - if server is up on 3002, then something is wrong with .env file or I didn't bring in dotenv

// ***** ENDPOINTS *****

// base endpoint
app.get('/', (request, response) => {
  console.log('Shows up in terminal');
  response.status(200).send('Welome to my server');
});

// app.get('/hello', (request, response) => {
//   console.log(request.query);
//   let firstName = request.query.firstName;
//   let lastName = request.query.lastName;
//   response.status(200).send(`Hello ${firstName} ${lastName}, welcome to my server.`);
// });
// todo:  build /weather route and send groomed json data - arr of 3 days of weather {date, description} - to front end
// front-end axio.get to: http://localhost:3001/weather?searchQuery=value&lat=anothervalue&long=anothervaule

app.get('/weather', (request, response, next) => {
  let cityName = request.query.searchQuery;
  let lat = request.query.lat;
  let long = request.query.lon;
  try {
    let cityData = data.find(city => city.city_name === cityName);
    let groomedData = cityData.data.map(day => new Forecast(day));
    response.status(200).send(groomedData);

  } catch (error) {
    next(error);
  }
});


class Forecast {
  constructor(dayObj) {
    this.date = dayObj.datetime;
    this.description = dayObj.weather.description;
  }
}

// Catch-all

app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

// ***** ERROR HANDLING *****

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// ***** SERVER START *****

app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));
