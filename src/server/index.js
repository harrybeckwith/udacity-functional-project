require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

// example API call
app.get("/roverInfo/:rover_name", async (req, res) => {
  const url = "https://api.nasa.gov/mars-photos/api/v1/";
  try {
    const dataResponse = await fetch(
      `${url}manifests/${req.params.rover_name}?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    // res.send({dataResponse})
    let max_date = dataResponse.photo_manifest.max_date;
    let rover_name = dataResponse.photo_manifest.name;
    let roverPhotos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover_name}/photos?earth_date=${max_date}&page=1&api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    res.send(roverPhotos);
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
