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
    weatherDiv.innerHTML = '';

    function formatTime(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const temperature = data.main.temp.toFixed(1);
    const feelsLike = data.main.feels_like.toFixed(1);
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    weatherDiv.innerHTML = `
        <div class="weather-card">
            <div class="weather-left">
                <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
                <h1 class="temperature">${temperature}°${isCelsius ? 'C' : 'F'}</h1>
                <h2 class="city">${data.name}, ${data.sys.country}</h2>
                <p class="weather-description">${data.weather[0].description}</p>
            </div>
            <div class="weather-right">
                <div class="weather-details">
                    <div class="detail">
                        <p><strong>Feels Like:</strong> ${feelsLike}°${isCelsius ? 'C' : 'F'}</p>
                        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                        <p><strong>Wind Speed:</strong> ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}</p>
                        <p><strong>Cloudiness:</strong> ${data.clouds.all}%</p>
                        <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
                        <p><strong>Sunrise:</strong> ${formatTime(data.sys.sunrise)}</p>
                        <p><strong>Sunset:</strong> ${formatTime(data.sys.sunset)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}



function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { 
            const temperature = forecast.main.temp.toFixed(1);
            const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
            const date = new Date(forecast.dt * 1000).toLocaleDateString();

            const forecastCard = document.createElement('div');
            
            forecastCard.classList.add('forecast-card');
            forecastCard.innerHTML = ` 
                <img src="${iconUrl}" alt="${forecast.weather[0].description}" class="weather-icon">
                <p class="temperature">${temperature}°${isCelsius ? 'C' : 'F'}</p>
                <p class="weather-description">${forecast.weather[0].description}</p>
                <p>${date}</p>
                
            `;

            forecastDiv.appendChild(forecastCard);
        }
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



