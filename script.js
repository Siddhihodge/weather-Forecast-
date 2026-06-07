async function searchWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;

    // Get coordinates from city name
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results) {
        alert("City not found");
        return;
    }

    const place = geoData.results[0];
    const lat = place.latitude;
    const lon = place.longitude;

    document.getElementById("cityName").textContent =
        `${place.name}, ${place.country}`;

    // Get weather data
    const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current_weather;

    document.getElementById("temp").textContent =
        current.temperature + "°C";
    document.getElementById("wind").textContent =
        current.windspeed;
    document.getElementById("condition").textContent =
        getCondition(current.weathercode).text;
    document.getElementById("icon").textContent =
        getCondition(current.weathercode).icon;

    displayForecast(weatherData.daily);
}

function displayForecast(daily) {
    const forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const day = document.createElement("div");
        day.className = "forecast-day";

        const condition = getCondition(daily.weathercode[i]);

        day.innerHTML = `
            <div>${getDayName(daily.time[i])}</div>
            <div>${condition.icon}</div>
            <div>${daily.temperature_2m_max[i]}°</div>
        `;

        forecastEl.appendChild(day);
    }
}

function getDayName(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

function getCondition(code) {
    if (code === 0) return { text: "Clear", icon: "☀️" };
    if (code <= 3) return { text: "Cloudy", icon: "☁️" };
    if (code <= 48) return { text: "Fog", icon: "🌫️" };
    if (code <= 67) return { text: "Rain", icon: "🌧️" };
    if (code <= 77) return { text: "Snow", icon: "❄️" };
    if (code <= 99) return { text: "Storm", icon: "⛈️" };
    return { text: "Unknown", icon: "❔" };
}
