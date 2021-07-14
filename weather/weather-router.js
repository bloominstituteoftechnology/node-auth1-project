const axios = require("axios");

const router = require("express").Router();

router.get("/", (req, res) => {
  const requestOptions = {
    headers: { Accept: "application/json" },
  };

  axios
    .get("https://www.metaweather.com/api/location/2487956/", requestOptions)
    .then((response) => {
      console.log(response.data);
      let maps = response.data.consolidated_weather.map((item) => {
        console.log("item---->", item);
        return item;
      });
      res.status(200).json(maps);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error Fetching Weather", error: err });
    });
});

module.exports = router;
