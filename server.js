const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/search', async (req, res) => {
    const { city } = req.query;
    const locationIQKey = process.env.LOCATIONIQ_API_KEY;
    const openWeatherKey = process.env.OPENWEATHER_API_KEY;
    const aqicnKey = process.env.AQICN_API_KEY;

    try {
        // Get the latitude and longitude for the city from LocationIQ
        const geocodeUrl = `https://us1.locationiq.com/v1/search.php?key=${locationIQKey}&q=${encodeURIComponent(city)}&format=json`;
        const geocodeResponse = await axios.get(geocodeUrl);
        const { lat, lon } = geocodeResponse.data[0];

        // Fetch weather data from OpenWeatherAPI using the coordinates
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&units=metric`;
        const weatherResponse = await axios.get(weatherUrl);

        // Fetch air quality data from AQICN
        const airQualityUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${aqicnKey}`;
        const airQualityResponse = await axios.get(airQualityUrl);

        // Construct the result object with data from both APIs
        const result = {
            weather: {
                temperature: weatherResponse.data.main.temp,
                description: weatherResponse.data.weather[0].description,
                humidity: weatherResponse.data.main.humidity,
                coordinates: { lat: weatherResponse.data.coord.lat, lon: weatherResponse.data.coord.lon },
                pressure: weatherResponse.data.main.pressure,
                windSpeed: weatherResponse.data.wind.speed,
                country: weatherResponse.data.sys.country,
                feelsLike: weatherResponse.data.main.feels_like,
                icon: weatherResponse.data.weather[0].icon,
                rainVolume: weatherResponse.data.rain ?weatherResponse.data.rain['3h'] : 0
            },
            airQuality: {
                aqi: airQualityResponse.data.data.aqi,
                // Add other air quality details if needed
            },
            location: {
                address: geocodeResponse.data[0].display_name,
                lat: lat,
                lon: lon,
            },
        };

        res.json(result);
    } catch (error) {
        console.error('Error in /search route:', error);
        res.status(500).send('Error processing your request');
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
