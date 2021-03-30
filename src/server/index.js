const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const get = require("lodash/get");
const moment = require("moment");
const momentTimezone = require("moment-timezone");

let projectData = [];

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("dist"));

app.get("/", (req, res) => res.sendFile("dist/index.html"));

app.get("/test", (req, res) => res.send("OK"));

app.post("/submitform", async (req, res) => {
  const { city, start_date, end_date } = req.body;

  let result = {};

  getDataFromGeoNames({ city })
    .then((data) => {
      // save data from GeoNames
      const dataResult = {
        lat: get(data, "geonames[0].lat"),
        lng: get(data, "geonames[0].lng"),
      };

      Object.assign(result, dataResult);

      return getDataFromWeatherBit(dataResult);
    })
    .then((data) => {
      // save data from WeatherBit
      const dataResult = {
        high_temp: get(data, "data[0].high_temp"),
        low_temp: get(data, "data[0].low_temp"),
        temp: get(data, "data[0].temp"),
        vis: get(data, "data[0].vis"),
        description: get(data, "data[0].weather.description"),
      };

      Object.assign(result, dataResult);

      return getDataFromPixabay({ city });
    })
    .then((data) => {
      // save data from Pixabay + data from dates
      const dataResult = {
        image: get(data, "hits[0].webformatURL"),
        dateFromNow: momentTimezone(start_date).fromNow(),
        start_date: moment(start_date).toDate(),
        end_date: moment(end_date).toDate(),
        daysDuration: moment(end_date).diff(moment(start_date), "days"),
      };

      Object.assign(result, dataResult);

      projectData.push(result);
      res.send(projectData);
    });
});

const server = app.listen(3001, () =>
  console.log("Example app listening on port 3001!")
);

const getDataFromGeoNames = async ({ city }) => {
  const apiURL = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`;
  const res = await fetch(apiURL);
  try {
    return res.json();
  } catch (error) {
    alert("GeoNames error: ", error);
  }
};

const getDataFromWeatherBit = async ({ lat, lng }) => {
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_APIKEY}`;
  const res = await fetch(url);
  try {
    return res.json();
  } catch (error) {
    alert("WeatherBit error: ", error);
  }
};

const getDataFromPixabay = async ({ city }) => {
  const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_APIKEY}&q=${city}&image_type=photo`;
  const res = await fetch(url);
  try {
    return res.json();
  } catch (error) {
    alert("Pixabay error: ", error);
  }
};

module.exports = server;
