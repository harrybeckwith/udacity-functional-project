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

// API calls for nasa rover data
app.get("/roverInfo/:rover_name", async (req, res) => {
  const url = "https://api.nasa.gov/mars-photos/api/v1/";

  try {
    // Get data for rover name
    const dataResponse = await fetch(
      `${url}manifests/${req.params.rover_name}?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    // Store rover name and max date
    const roverName = dataResponse.photo_manifest.name;
    const maxDate = dataResponse.photo_manifest.max_date;
    // Get photos for rover and max date
    const roverData = await fetch(
      `${url}/rovers/${roverName}/photos?earth_date=${maxDate}&page=1&api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    res.send({ roverData });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
