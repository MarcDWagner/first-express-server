'use strict';

console.log('First server');

// ***** REQUIRES *****

const express = require('express');
require('dotenv').config();
// let data = require('./data/weather.json');
const cors = require('cors');
// const { default: axios } = require('axios');
const axios = require('axios');
// const weatherFunction = require('./modules/weather');
// const movieFunction = require('./modules/movies');
// cors is middleware to share resources across the internet


// once express is in we need to us it - per express docs
// app === server
const app = express();
// middleware:
app.use(cors());

// define port
const PORT = process.env.PORT || 3002;
// 3002 - if server is up on 3002, then something is wrong with .env file or I didn't bring in dotenv

// ***** ENDPOINTS *****

// base endpoint
app.get('/', (request, response) => {
  console.log('Shows up in terminal');
  response.status(200).send('Welcome to my server');
});


// todo:  build /weather route and send groomed json data - arr of 3 days of weather {date, description} - to front end
// front-end axio.get to: http://localhost:3001/weather?searchQuery=value&lat=anothervalue&lon=anothervaule

app.get('/weather', async (request, response, next) => {
  try {
    console.log('weather route works');
    // let cityName = request.query.searchQuery;
    let lat = request.query.lat;
    let lon = request.query.lon;
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=[I]&lat=${lat}&lon=${lon}`;
    let cityWeatherData = await axios.get(url);
    let groomedData = cityWeatherData.data.data.map(day => new Forecast(day));
    response.status(200).send(groomedData);

  } catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(dayObj) {
    this.date = dayObj.datetime;
    this.weather = dayObj.weather.description;
    this.high = dayObj.max_temp;
    this.low = dayObj.min_temp;
    // this.key = dayObj.index;
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
