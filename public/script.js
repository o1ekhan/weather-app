// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('searchInput').value.trim();
    if (city) {
        fetchWeatherAndAirQuality(city);
    } else {
        alert('Please enter a city name.');
    }
});

// Function to fetch weather and air quality data for the specified city
async function fetchWeatherAndAirQuality(city) {
    try {
        const response = await fetch(`/search?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (response.ok) {
            updateWeatherUI(data.weather);
            updateAirQualityUI(data.airQuality);
            updateLocationUI(data.location);
        } else {
            throw new Error(data.message || 'An error occurred while fetching the data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data for the specified city.');
    }
}

// Function to update the UI with weather data
function updateWeatherUI(weather) {
    if (!weather) {
        console.error('No weather data to display.');
        return;
    }

    // Display weather information
    document.getElementById('weatherInfo').style.display = 'block';
    document.getElementById('temperature').textContent = `${weather.temperature}°C`;
    document.getElementById('weatherDescription').textContent = weather.description;
    document.getElementById('humidity').textContent = `Humidity: ${weather.humidity}%`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${weather.windSpeed} m/s`;
    document.getElementById('feelsLike').textContent = `Feels Like: ${weather.feelsLike}°C`;
    document.getElementById('rainVolume').textContent = `Rain Volume: ${weather.rainVolume} mm`;
    document.getElementById('latitude').textContent = `Latitude: ${weather.coord.lat}`;
    document.getElementById('longtitude').textContent = `Longtitude: ${weather.coord.lon}`;
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/w/${weather.icon}.png`;

    // Update the map or coordinates display if you have one
    // This could be a link to a map or an embedded map component
    const mapLink = document.getElementById('mapLink');
    if (mapLink) {
        mapLink.href = `https://www.openstreetmap.org/?mlat=${weather.coordinates.lat}&mlon=${weather.coordinates.lon}`;
        mapLink.textContent = 'View on Map';
    }
}
// Function to update the UI with air quality data
function updateAirQualityUI(airQuality) {
    if (!airQuality || airQuality.aqi === undefined) {
        console.error('No air quality data to display.');
        return;
    }

    document.getElementById('airQualityInfo').style.display = 'block';
    document.getElementById('aqi').textContent = `Air Quality Index: ${airQuality.aqi}`;
    // Add additional air quality details if needed
}

// Function to update the UI with location data
function updateLocationUI(location) {
    if (!location) {
        console.error('No location data to display.');
        return;
    }

    document.getElementById('locationInfo').style.display = 'block';
    document.getElementById('location').textContent = location.address;
}