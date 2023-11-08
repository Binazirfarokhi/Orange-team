const axios = require("axios");
require("dotenv").config();

const getLocation = async (req, res) => {
  try {
    const searchText = req.query.text;
    const GEOAPI = process.env.GEOAPI;
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      searchText
    )}&filter=countrycode:ca&apiKey=${GEOAPI}`;
    const response = await axios.get(url);

    const bcResults = response.data.features.filter(
      (feature) => feature.properties.state_code === "BC"
    );

    res.json({ ...response.data, features: bcResults });
  } catch (error) {
    console.error(error);
    const status =
      error.response && error.response.status ? error.response.status : 500;
    res.status(status).send("Error fetching autocomplete data");
  }
};

const displayMap = async (req, res) => {
    const { lat, lon } = req.query;

    try {
        if (!lat || !lon) {
            return res.status(400).send("Latitude and longitude missing");
        }

        const GEOAPI = process.env.GEOAPI;
        const zoom = 15; 
        const width = 600; 
        const height = 400; 

        
        const mapWithMarkerUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${width}&height=${height}&center=lonlat:${lon},${lat}&zoom=${zoom}&marker=lonlat:${lon},${lat};color:%23080808;size:large;type:awesome&apiKey=${GEOAPI}`;
        res.json({ imageUrl: mapWithMarkerUrl });

    } catch (error) {
        console.error(error);
        const status = (error.response && error.response.status) ? error.response.status : 500;
        res.status(status).send("Error generating map with marker");
    }
}


module.exports = {
    getLocation,
    displayMap
}

