const axios = require('axios');
require('dotenv').config();

const getLocation = async (req, res) => {
    try {
        const searchText = req.query.text;
        const GEOAPI = process.env.GEOAPI;
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchText)}&filter=countrycode:ca&apiKey=${GEOAPI}`;
        const response = await axios.get(url);

        const bcResults = response.data.features.filter(feature => feature.properties.state_code === 'BC');

        res.json({ ...response.data, features: bcResults });
    } catch (error) {
        console.error(error);
        const status = (error.response && error.response.status) ? error.response.status : 500;
        res.status(status).send("Error fetching autocomplete data");
    }
}


module.exports = {
    getLocation
}