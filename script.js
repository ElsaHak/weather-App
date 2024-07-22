// const lat = 51.5074;
// const lon = -0.1278;
// const apiKey = "9b4383e45fa10ef93a423d3c50463007";
// const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

// // fetch(apiUrl)
// //   .then(response => {
// //     if (!response.ok) {
// //       throw new Error('Network response was not ok');
// //     }
// //     return response.json();
// //   })
// //   .then(data => console.log(data))
// //   .catch(error => console.error('There was a problem with the fetch operation:', error));
const apiKey = '9b4383e45fa10ef93a423d3c50463007';
let isCelsius = true;

document.getElementById('unit-toggle').addEventListener('click', toggleUnits);
window.onload = () => getWeatherByLocation();

async function getWeather() {
    const city = document.getElementById('city-search').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }
    await fetchWeatherData(city);
}

async function fetchWeatherData(city) {
    const units = isCelsius ? 'metric' : 'imperial';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

    try {
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();
        if (currentWeatherData.cod !== 200) throw new Error(currentWeatherData.message);

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        if (forecastData.cod !== '200') throw new Error(forecastData.message);

        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(`Error: ${error.message}`);
    }
}

function displayCurrentWeather(data) {
    const weatherDiv = document.getElementById('current-weather');
    weatherDiv.innerHTML = `
        <div class="weather-card">
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>${new Date(data.dt * 1000).toLocaleDateString()}</p>
            <p>Temperature: ${data.main.temp}°${isCelsius ? 'C' : 'F'}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}</p>
            <p>${data.weather[0].description}</p>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        </div>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '<h3>5-Day Forecast:</h3>';
    const days = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    days.forEach(day => {
        forecastDiv.innerHTML += `
            <div class="weather-card">
                <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${day.main.temp}°${isCelsius ? 'C' : 'F'}</p>
                <p>${day.weather[0].description}</p>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            </div>
        `;
    });
}

function toggleUnits() {
    isCelsius = !isCelsius;
    const currentCity = document.getElementById('city-search').value;
    if (currentCity) {
        fetchWeatherData(currentCity);
    }
}

async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            const units = isCelsius ? 'metric' : 'imperial';
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

            try {
                const currentWeatherResponse = await fetch(currentWeatherUrl);
                const currentWeatherData = await currentWeatherResponse.json();
                if (currentWeatherData.cod !== 200) throw new Error(currentWeatherData.message);

                const forecastResponse = await fetch(forecastUrl);
                const forecastData = await forecastResponse.json();
                if (forecastData.cod !== '200') throw new Error(forecastData.message);

                displayCurrentWeather(currentWeatherData);
                displayForecast(forecastData);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                alert(`Error: ${error.message}`);
            }
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
