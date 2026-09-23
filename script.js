const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAAA4vxqmTh6AtIQ_RkERxWmt5pNsBImY40YGlrLW-JuZCX16NXjxyaYjvxMPoHYrP/exec";

const form = document.getElementById("eventForm");
const weatherBtn = document.getElementById("checkWeatherBtn");
const weatherBox = document.getElementById("weatherBox");
const weatherText = document.getElementById("weatherText");
const statusText = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

let weatherData = {
  temperature: "",
  condition: "",
  latitude: "",
  longitude: ""
};

async function getCoordinates(city) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(city) +
    "&count=1&language=en&format=json";

  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not find the city.");

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Please enter a valid city.");
  }

  return data.results[0];
}

async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const date = document.getElementById("eventDate").value;

  if (!city || !date) {
    alert("Please enter the city and event date first.");
    return;
  }

  weatherBtn.disabled = true;
  weatherBtn.textContent = "Checking weather...";

  try {
    const place = await getCoordinates(city);

    const weatherUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      place.latitude +
      "&longitude=" +
      place.longitude +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      "&timezone=auto&start_date=" +
      date +
      "&end_date=" +
      date;

    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error("Weather service error.");

    const data = await response.json();

    if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
      throw new Error("Weather data is not available for this date.");
    }

    const code = data.daily.weather_code[0];
    const condition = weatherCodes[code] || "Unknown weather";
    const maxTemp = data.daily.temperature_2m_max[0];
    const minTemp = data.daily.temperature_2m_min[0];

    weatherData = {
      temperature: `${minTemp}°C to ${maxTemp}°C`,
      condition: condition,
      latitude: place.latitude,
      longitude: place.longitude
    };

    weatherText.textContent =
      `${place.name}: ${condition}, ${minTemp}°C to ${maxTemp}°C`;

    weatherBox.classList.remove("hidden");
  } catch (error) {
    weatherBox.classList.remove("hidden");
    weatherText.textContent = error.message;
  } finally {
    weatherBtn.disabled = false;
    weatherBtn.textContent = "Check Event Weather";
  }
}

weatherBtn.addEventListener("click", getWeather);

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
    statusText.textContent = "Please add your Google Apps Script Web App URL in script.js first.";
    return;
  }

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    eventDate: document.getElementById("eventDate").value,
    city: document.getElementById("city").value.trim(),
    attendees: document.getElementById("attendees").value,
    weather: weatherData
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  statusText.textContent = "Sending your registration...";

  try {
    // text/plain avoids a browser preflight request.
    // The Apps Script backend receives the JSON in e.postData.contents.
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    statusText.textContent =
      "Registration submitted. Please check your email for the confirmation document.";
    form.reset();
    weatherBox.classList.add("hidden");

    weatherData = {
      temperature: "",
      condition: "",
      latitude: "",
      longitude: ""
    };
  } catch (error) {
    statusText.textContent =
      "There was a problem sending the registration. Please try again.";
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirm Registration";
  }
});
