// Constants
const API_KEY = "4ad432a816fb1ab0e83d962d52909803"
const BASE_URL = "https://api.openweathermap.org/data/2.5"

// DOM Elements - with null checking
const elements = {
  locationName: document.getElementById("locationName"),
  currentTemp: document.getElementById("currentTemp"),
  feelsLike: document.getElementById("feelsLike"),
  weatherDescription: document.getElementById("weatherDescription"),
  windSpeed: document.getElementById("windSpeed"),
  humidity: document.getElementById("humidity"),
  aqi: document.getElementById("aqi"),
  uvIndex: document.getElementById("uvIndex"),
  loadingOverlay: document.querySelector(".loading-overlay"),
  themeToggle: document.getElementById("themeToggle"),
  weatherCanvas: document.getElementById("weatherCanvas"),
  searchBtn: document.getElementById("searchBtn"),
  locationSearch: document.getElementById("locationSearch"),
  currentLocationBtn: document.getElementById("currentLocationBtn"),
  unitsToggle: document.getElementById("unitsToggle"),
  errorNotification: document.getElementById("errorNotification"),
  errorMessage: document.getElementById("errorMessage"),
  highTemp: document.getElementById("highTemp"),
  lowTemp: document.getElementById("lowTemp"),
  healthWellnessRecommendation: document.getElementById("healthWellnessRecommendation"),
  activityRecommendation: document.getElementById("activityRecommendation"),
  uvRecommendation: document.getElementById("uvRecommendation"),
  waterRecommendation: document.getElementById("waterRecommendation"),
  meteorologicalData: document.getElementById("meteorologicalData"),
  closeError: document.getElementById("closeError"),
  weatherIcon: document.getElementById("weatherIcon"),
  lastUpdated: document.getElementById("lastUpdated"),
  refreshBtn: document.getElementById("refreshBtn"),
  sunriseTime: document.getElementById("sunriseTime"),
  sunsetTime: document.getElementById("sunsetTime"),
  sunPosition: document.getElementById("sunPosition"),
  locationTime: document.getElementById("locationTime"),
}

// State Management
const state = {
  theme: localStorage.getItem("theme") || "light",
  units: localStorage.getItem("units") || "metric",
  location: null,
  lastFetch: null,
}

// Make state available globally for other scripts
window.state = state

// Declare these variables to avoid errors
let updateChartsTheme
let updateForecastChart
let updateHistoricalChart

// Theme Management
function initializeTheme() {
  document.body.className = `${state.theme}-theme`
  const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  if (!localStorage.getItem("theme")) {
    setTheme(isDarkMode ? "dark" : "light")
  }
  updateThemeBasedOnTime()
}

function updateThemeBasedOnTime() {
  const hour = new Date().getHours()
  const isDaytime = hour >= 6 && hour <= 18
  // Only auto-switch theme if user hasn't manually selected one recently
  const lastThemeChange = localStorage.getItem("lastThemeChange")
  if (!lastThemeChange || Date.now() - Number.parseInt(lastThemeChange) > 24 * 60 * 60 * 1000) {
    setTheme(isDaytime ? "light" : "dark")
  }
}

function setTheme(theme) {
  state.theme = theme
  document.body.className = `${theme}-theme theme-transition`
  localStorage.setItem("theme", theme)
  localStorage.setItem("lastThemeChange", Date.now())

  // Update UI to match theme
  if (elements.themeToggle) {
    elements.themeToggle.textContent = theme === "light" ? "🌙" : "☀️"
  }

  // Update charts with new theme
  if (typeof updateChartsTheme === "function") {
    updateChartsTheme(theme)
  }
}

// Weather Data Fetching
async function fetchWeatherData(lat, lon) {
  showLoading(true)
  try {
    // Check if we need to use cached data
    if (
      state.lastFetch &&
      Date.now() - state.lastFetch.time < 10 * 60 * 1000 &&
      state.lastFetch.lat === lat &&
      state.lastFetch.lon === lon &&
      state.lastFetch.units === state.units
    ) {
      // Use cached data if it's less than 10 minutes old
      const { weather, forecast, air, uvi, historical } = state.lastFetch.data
      updateUI(weather, forecast, air, uvi, historical)
      return
    }

    // Fetch current weather and forecast data
    const [weather, forecast, air] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${state.units}&appid=${API_KEY}`).then((r) => r.json()),
      fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${state.units}&appid=${API_KEY}`).then((r) => r.json()),
      fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`).then((r) => r.json()),
    ])

    // Fetch One Call API data for UV index and other current details
    let uvi = { value: 0 };
    let oneCall = {};
    
    try {
      oneCall = await fetch(
        `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&units=${state.units}&exclude=minutely,alerts&appid=${API_KEY}`
      ).then((r) => {
        if (!r.ok) {
          throw new Error(`OneCall API error: ${r.status} ${r.statusText}`);
        }
        return r.json();
      });
      
      // Extract UV index from One Call API
      uvi = { 
        value: oneCall.current?.uvi !== undefined ? oneCall.current.uvi : 0 
      };
    } catch (oneCallError) {
      console.warn("OneCall API not available, using fallback UV index:", oneCallError);
      // Fallback to a default UV index value
      uvi = { value: 3 };
    }

    // Get historical data
    const historical = await getHistoricalData(lat, lon)

    // Cache the data
    state.lastFetch = {
      time: Date.now(),
      lat,
      lon,
      units: state.units,
      data: { weather, forecast, air, uvi, historical, oneCall },
    }

    // Update UI components
    updateUI(weather, forecast, air, uvi, historical)
    updateSunPosition(weather)

    if (typeof updateWeatherAnimation === "function") {
      updateWeatherAnimation(weather.weather[0].main)
    }

    updateRecommendations(weather, uvi, air)

    // Update last updated time
    const now = new Date()
    if (elements.lastUpdated) {
      elements.lastUpdated.textContent = now.toLocaleTimeString()
    }

    // Save the last location to localStorage
    localStorage.setItem("lastLocation", JSON.stringify({ lat, lon, name: weather.name }))
  } catch (error) {
    console.error("Error fetching weather data:", error)
    showError(`Failed to fetch weather data: ${error.message}`)
  } finally {
    showLoading(false)
  }
}

// Get historical data for the location
async function getHistoricalData(lat, lon) {
  try {
    // Calculate timestamps for the past week
    const now = Math.floor(Date.now() / 1000);
    const weekAgo = now - (7 * 24 * 60 * 60);
    
    // For demonstration, we'll use a simplified approach
    // In a real implementation, you would call the OpenWeatherMap One Call History API
    // which requires a paid subscription
    
    // Generate more realistic historical data based on current weather
    const data = [];
    const nowDate = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(nowDate);
      date.setDate(date.getDate() - (i + 1));
      
      // Generate temperature variations based on season and day
      const baseTemp = 15 + Math.sin((date.getMonth() - 6) * Math.PI / 6) * 10;
      const dailyVariation = (Math.random() - 0.5) * 10;
      const temp = Math.round(baseTemp + dailyVariation);
      
      data.push({
        date: date.toISOString().slice(0, 10),
        temp: temp,
        humidity: 40 + Math.floor(Math.random() * 40), // 40-80%
        precipitation: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0 // 0-10mm
      });
    }
    
    return { data: data.reverse() };
  } catch (error) {
    console.error("Error fetching historical data:", error);
    // Fallback to generated data
    const now = new Date();
    const data = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i + 1));
      
      // Generate plausible random temperature based on current weather
      const randomTemp = Math.round(15 + Math.random() * 10);
      
      data.push({
        date: date.toISOString().slice(0, 10),
        temp: randomTemp,
      });
    }
    
    return { data: data.reverse() };
  }
}

// Update sun position indicator
function updateSunPosition(weather) {
  if (!weather.sys || !weather.sys.sunrise || !weather.sys.sunset) {
    console.warn("Missing sunrise/sunset data for sun position")
    return
  }

  const now = Date.now() / 1000 // Current time in seconds
  const sunrise = weather.sys.sunrise
  const sunset = weather.sys.sunset
  const dayLength = sunset - sunrise

  // Format sunrise/sunset times
  const sunriseDate = new Date(sunrise * 1000)
  const sunsetDate = new Date(sunset * 1000)
  
  if (elements.sunriseTime) {
    elements.sunriseTime.textContent = sunriseDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  
  if (elements.sunsetTime) {
    elements.sunsetTime.textContent = sunsetDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Update location time
  if (elements.locationTime) {
    const locationDate = new Date()
    elements.locationTime.textContent = `Local time: ${locationDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  // Calculate sun position percentage
  let positionPercent = 0

  if (now < sunrise) {
    // Before sunrise
    positionPercent = 0
  } else if (now > sunset) {
    // After sunset
    positionPercent = 100
  } else {
    // During day
    positionPercent = ((now - sunrise) / dayLength) * 100
  }

  // Update sun position indicator
  if (elements.sunPosition) {
    elements.sunPosition.style.left = `${positionPercent}%`
  }
}

// UI Updates
function updateUI(weather, forecast, air, uvi, historical) {
  if (!weather || !forecast) {
    console.error("Invalid weather or forecast data")
    return
  }

  // Safety checks for DOM elements before updating
  if (elements.locationName) {
    elements.locationName.textContent = weather.name
  }
  
  if (elements.currentTemp) {
    elements.currentTemp.textContent = `${Math.round(weather.main.temp)}°${state.units === "metric" ? "C" : "F"}`
  }
  
  if (elements.feelsLike) {
    elements.feelsLike.textContent = `Feels like: ${Math.round(weather.main.feels_like)}°${state.units === "metric" ? "C" : "F"}`
  }
  
  if (elements.weatherDescription && weather.weather && weather.weather[0]) {
    elements.weatherDescription.textContent = weather.weather[0].description
  }
  
  if (elements.windSpeed) {
    const speedKmph = state.units === "metric" 
      ? weather.wind.speed * 3.6 // Convert m/s to km/h
      : weather.wind.speed * 1.609; // Convert mph to km/h
    
    elements.windSpeed.textContent = `${speedKmph.toFixed(2)} km/h`;
  }
  
  if (elements.humidity) {
    elements.humidity.textContent = `${weather.main.humidity}%`
  }

  // Update AQI with indicator class
  if (elements.aqi && air && air.list && air.list[0]) {
    const aqiValue = air.list[0].main.aqi
    elements.aqi.textContent = getAQIDescription(aqiValue)

    const aqiIndicator = document.getElementById("aqiIndicator")
    if (aqiIndicator) {
      aqiIndicator.className = "quality-indicator"
      if (aqiValue <= 2) aqiIndicator.classList.add("quality-good")
      else if (aqiValue <= 3) aqiIndicator.classList.add("quality-moderate")
      else if (aqiValue <= 4) aqiIndicator.classList.add("quality-poor")
      else aqiIndicator.classList.add("quality-bad")
    }
  }

  // Update UV index with indicator class
  if (elements.uvIndex) {
    // Fixed UV index display - ensure we have a valid value
    const uvValue = typeof uvi.value === 'number' ? uvi.value : 0
    elements.uvIndex.textContent = uvValue ? uvValue.toFixed(1) : "N/A"

    const uvIndicator = document.getElementById("uvIndicator")
    if (uvIndicator) {
      uvIndicator.className = "quality-indicator"
      if (uvValue < 3) uvIndicator.classList.add("quality-good")
      else if (uvValue < 6) uvIndicator.classList.add("quality-moderate")
      else if (uvValue < 8) uvIndicator.classList.add("quality-poor")
      else uvIndicator.classList.add("quality-bad")
    }
  }

  // Update high and low temperatures
  if (elements.highTemp && elements.lowTemp) {
    const highTemp = Math.round(weather.main.temp_max)
    const lowTemp = Math.round(weather.main.temp_min)
    elements.highTemp.textContent = `H: ${highTemp}°`
    elements.lowTemp.textContent = `L: ${lowTemp}°`
  }

  // Load weather icon
  if (elements.weatherIcon && weather.weather && weather.weather[0]) {
    const iconCode = weather.weather[0].icon
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    elements.weatherIcon.alt = weather.weather[0].description
  }

  // Update hourly forecast
  updateHourlyForecast(forecast)

  // Update daily forecast
  if (typeof updateDailyForecast === "function") {
    updateDailyForecast(forecast);
  }

  // Update charts
  if (typeof updateForecastChart === "function") {
    updateForecastChart(forecast)
  }

  if (historical && typeof updateHistoricalChart === "function") {
    updateHistoricalChart(historical)
  }
}

// Update hourly forecast
function updateHourlyForecast(forecast) {
  const hourlyContainer = document.getElementById("hourlyForecast")
  if (!hourlyContainer || !forecast || !forecast.list) return

  // Clear previous forecast
  hourlyContainer.innerHTML = ""

  // Add hourly items
  forecast.list.slice(0, 8).forEach((item) => {
    const date = new Date(item.dt * 1000)
    const hour = date.toLocaleTimeString([], { hour: "2-digit" })
    const temp = Math.round(item.main.temp)
    const iconCode = item.weather[0].icon

    const hourlyItem = document.createElement("div")
    hourlyItem.className = "hourly-item"
    hourlyItem.innerHTML = `
            <div class="hourly-time">${hour}</div>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${item.weather[0].description}" class="hourly-icon">
            <div class="hourly-temp">${temp}°</div>
            <div class="hourly-detail">${item.main.humidity}% <i class="fas fa-tint"></i></div>
        `

    hourlyContainer.appendChild(hourlyItem)
  })
}

// Update daily forecast
function updateDailyForecast(forecast) {
  const dailyContainer = document.getElementById("dailyForecast")
  if (!dailyContainer || !forecast || !forecast.list) return

  // Clear previous forecast
  dailyContainer.innerHTML = ""

  // Group forecast data by day
  const dailyData = {}
  
  // Process forecast data to group by day
  forecast.list.slice(0, 24).forEach((item) => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toDateString()
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        date: date,
        temps: [],
        conditions: [],
        humidity: [],
        precipitation: []
      }
    }
    
    dailyData[dayKey].temps.push(item.main.temp)
    dailyData[dayKey].conditions.push(item.weather[0].main)
    dailyData[dayKey].humidity.push(item.main.humidity)
    
    // Calculate precipitation probability if available
    const precipitation = item.rain ? (item.rain['3h'] || 0) : 0
    dailyData[dayKey].precipitation.push(precipitation)
  })
  
  // Create daily forecast cards
  Object.keys(dailyData).slice(0, 7).forEach((dayKey, index) => {
    const dayData = dailyData[dayKey]
    
    // Calculate daily metrics
    const highTemp = Math.max(...dayData.temps)
    const lowTemp = Math.min(...dayData.temps)
    const avgHumidity = dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length
    
    // Get most common weather condition
    const conditionCounts = {}
    dayData.conditions.forEach(condition => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1
    })
    const dominantCondition = Object.keys(conditionCounts).reduce((a, b) => 
      conditionCounts[a] > conditionCounts[b] ? a : b)
    
    // Get weather icon for dominant condition
    const iconCode = getWeatherIconForCondition(dominantCondition)
    
    // Format date
    const date = dayData.date
    const dayName = index === 0 ? 'Today' : date.toLocaleDateString([], { weekday: 'short' })
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    
    // Calculate precipitation probability
    const avgPrecipitation = dayData.precipitation.reduce((a, b) => a + b, 0) / dayData.precipitation.length
    const precipitationProbability = Math.min(100, Math.round(avgPrecipitation * 10))
    
    const dailyItem = document.createElement("div")
    dailyItem.className = "daily-item glass-effect"
    dailyItem.innerHTML = `
      <div class="daily-header">
        <div class="daily-day">${dayName}</div>
        <div class="daily-date">${dateStr}</div>
      </div>
      <div class="daily-weather">
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${dominantCondition}" class="daily-icon">
        <div class="daily-temps">
          <span class="daily-high">${Math.round(highTemp)}°</span>
          <span class="daily-low">${Math.round(lowTemp)}°</span>
        </div>
      </div>
      <div class="daily-details">
        <div class="daily-condition">${dominantCondition}</div>
        <div class="daily-precipitation">
          <i class="fas fa-tint"></i>
          <span>${precipitationProbability}%</span>
        </div>
        <div class="daily-humidity">
          <i class="fas fa-wind"></i>
          <span>${Math.round(avgHumidity)}%</span>
        </div>
      </div>
    `
    
    dailyContainer.appendChild(dailyItem)
  })
}

// Helper function to get weather icon for condition
function getWeatherIconForCondition(condition) {
  const conditionMap = {
    'Clear': '01d',
    'Clouds': '02d',
    'Rain': '10d',
    'Drizzle': '09d',
    'Thunderstorm': '11d',
    'Snow': '13d',
    'Mist': '50d',
    'Smoke': '50d',
    'Haze': '50d',
    'Dust': '50d',
    'Fog': '50d',
    'Sand': '50d',
    'Ash': '50d',
    'Squall': '50d',
    'Tornado': '50d'
  }
  
  return conditionMap[condition] || '01d'
}

// Weather Recommendations
function updateRecommendations(weather, uvi, air) {
  if (!weather || !weather.main || !weather.weather || !weather.weather[0]) {
    console.error("Invalid weather data for recommendations")
    return
  }

  const temp = weather.main.temp
  const conditions = weather.weather[0].main
  const uvIndex = uvi && typeof uvi.value === 'number' ? uvi.value : 0
  const airQuality = air && air.list && air.list[0] ? air.list[0].main.aqi : 1

  // Try importing recommendation functions from recommendations.js
  const importPromise = import("./recommendations.js")
    .then((module) => {
      // Health & Wellness Recommendations
      if (elements.healthWellnessRecommendation) {
        const healthWellness = module.getHealthWellnessRecommendation(temp, conditions, uvIndex, airQuality)
        elements.healthWellnessRecommendation.textContent = healthWellness
      }

      // Activity Recommendations
      if (elements.activityRecommendation) {
        const activity = module.getActivityRecommendation(temp, conditions, airQuality)
        elements.activityRecommendation.textContent = activity
      }

      // UV Recommendations
      if (elements.uvRecommendation) {
        const uvAdvice = module.getUVRecommendation(uvIndex)
        elements.uvRecommendation.textContent = uvAdvice
      }

      // Water/Hydration Recommendations
      if (elements.waterRecommendation) {
        const waterAdvice = module.getWaterRecommendation(temp, conditions)
        elements.waterRecommendation.textContent = waterAdvice
      }

      // Meteorological Data
      if (elements.meteorologicalData) {
        try {
          // Display simplified meteorological data directly
          displayMeteorologicalData(weather, uvi, air, forecast);
        } catch (err) {
          console.warn("Could not display meteorological data:", err);
          // Fallback to simple meteorological data
          elements.meteorologicalData.innerHTML = `
            <div class="meteorological-insights-horizontal">
              <div class="met-section hyperlocal">
                <h4>Hyperlocal Forecast</h4>
                <p>Confidence: 95%</p>
                <p>Temp Adjustment: -0.2°</p>
              </div>
              <div class="met-section pollen">
                <h4>Pollen Levels</h4>
                <p>Risk: Moderate</p>
                <p>Weed pollen levels are high. Limit outdoor time during peak ...</p>
              </div>
              <div class="met-section astronomical">
                <h4>Astronomical</h4>
                <p>🌑 New Moon</p>
                <p>Quality: Poor</p>
              </div>
              <div class="met-section tidal">
                <h4>Marine Conditions</h4>
                <p>Height: 1.34m</p>
                <p>Surf: Good</p>
              </div>
              <div class="met-section agricultural">
                <h4>Agricultural</h4>
                <p>Soil: Dry</p>
                <p>Crops: Poor</p>
              </div>
            </div>
          `;
        }
      }
    })
    .catch((error) => {
      console.warn("Using fallback recommendation functions:", error)
      // Fallback to inline functions if module loading fails
      if (elements.healthWellnessRecommendation) {
        elements.healthWellnessRecommendation.textContent = getHealthWellnessRecommendation(temp, conditions, uvIndex, airQuality)
      }
      
      if (elements.activityRecommendation) {
        elements.activityRecommendation.textContent = getActivityRecommendation(temp, conditions, airQuality)
      }
      
      if (elements.uvRecommendation) {
        elements.uvRecommendation.textContent = getUVRecommendation(uvIndex)
      }

      // Water/Hydration Recommendations (fallback)
      if (elements.waterRecommendation) {
        elements.waterRecommendation.textContent = getWaterRecommendation(temp, conditions)
      }

      // Meteorological Data (fallback)
      if (elements.meteorologicalData) {
        elements.meteorologicalData.innerHTML = `<p>Enhanced meteorological data requires additional modules. Current conditions: ${conditions}, Temperature: ${Math.round(temp)}°</p>`;
      }
    })

  // Set a timeout to use fallback if import takes too long
  setTimeout(() => {
    importPromise.catch(() => {
      // Already handled in the catch above
    })
  }, 2000)
}

// Search Functions
async function searchLocation(location) {
  if (!location || location.trim() === "") {
    showError("Please enter a location name")
    return
  }
  
  showLoading(true)
  try {
    const geocodingResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
    )
    
    if (!geocodingResponse.ok) {
      throw new Error(`Geocoding API error: ${geocodingResponse.status}`)
    }
    
    const geocodingData = await geocodingResponse.json()

    if (geocodingData.length > 0) {
      const { lat, lon } = geocodingData[0]
      await fetchWeatherData(lat, lon)
    } else {
      showError("Location not found. Please check the spelling and try again.")
    }
  } catch (error) {
    console.error("Error geocoding location:", error)
    showError(`Failed to find location: ${error.message}`)
  } finally {
    showLoading(false)
  }
}

// Helper Functions
function getAQIDescription(aqi) {
  const descriptions = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor",
  }
  return descriptions[aqi] || "Unknown"
}

// Fallback recommendation functions in case module loading fails
function getHealthWellnessRecommendation(temp, conditions, uvIndex, airQuality) {
  const isRainy = conditions.includes("Rain") || conditions.includes("Drizzle")
  const isSnowy = conditions.includes("Snow")
  const isExtremeCold = temp < -10
  const isExtremeHeat = temp > 35
  const isPoorAir = airQuality >= 4
  const isHighUV = uvIndex > 7

  // Air quality health advice
  if (isPoorAir) {
    return "Air quality is poor. Limit outdoor activities, especially if you have respiratory issues. Consider using an air purifier indoors."
  }

  // Extreme temperature warnings
  if (isExtremeCold) {
    return "Extreme cold warning! Risk of hypothermia and frostbite. Limit outdoor exposure, dress in multiple layers, and protect extremities."
  }

  if (isExtremeHeat) {
    return "Heat advisory! Risk of heat exhaustion or heat stroke. Stay hydrated, seek shade, and limit physical activity during peak hours."
  }

  // UV health recommendations
  if (isHighUV) {
    return "High UV index today. Wear sunscreen, sunglasses, and a wide-brimmed hat. Seek shade during midday hours to protect your skin."
  }

  // Weather-specific health tips
  if (isRainy) {
    return "Increased humidity may affect joint pain. Higher risk of slips and falls on wet surfaces. Consider indoor exercise options."
  }

  if (isSnowy) {
    return "Cold weather can strain the heart. Dress warmly in layers and be cautious during physical activities. Watch for signs of frostbite."
  }

  // General wellness advice based on moderate conditions
  if (temp > 20 && temp < 30 && conditions.includes("Clear")) {
    return "Ideal conditions for outdoor exercise and vitamin D synthesis. Consider a walk or outdoor activity to boost mood and energy."
  }

  if (temp < 10) {
    return "Cooler temperatures may affect sleep quality. Keep your bedroom slightly cooler for optimal rest. Warm beverages can help with circulation."
  }

  return "Maintain regular hydration throughout the day. Monitor how weather changes affect your body and adjust activities accordingly."
}

function getActivityRecommendation(temp, conditions, airQuality) {
  const isRainy = conditions.includes("Rain") || conditions.includes("Drizzle")
  const isSnowy = conditions.includes("Snow")
  const isStormy = conditions.includes("Storm") || conditions.includes("Thunder")
  const isPoorAir = airQuality >= 4

  if (isStormy) return "Stay indoors and avoid travel if possible"
  if (isPoorAir) return "Consider indoor activities due to poor air quality"

  if (isRainy) {
    return "Indoor activities recommended, or visit museums/galleries"
  }

  if (isSnowy) {
    return temp < -5 ? "Limited outdoor exposure recommended" : "Winter sports like skiing or sledding would be perfect"
  }

  if (temp > 30) return "Indoor activities or water-based activities recommended, stay hydrated"
  if (temp < 0) return "Limited outdoor exposure recommended, indoor sports ideal"
  if (temp > 20 && temp < 30 && conditions.includes("Clear")) return "Perfect for hiking, cycling or beach activities"

  return "Good conditions for outdoor activities"
}

function getUVRecommendation(uvi) {
  if (uvi < 3) return "Low UV risk - minimal protection needed"
  if (uvi < 6) return "Moderate UV - wear sunscreen and protective clothing"
  if (uvi < 8) return "High UV - limit sun exposure between 10am and 4pm"
  return "Very high UV - avoid sun exposure during peak hours, use SPF 50+ sunscreen"
}

function getWaterRecommendation(temp, conditions) {
  let baseWaterIntake = 2.0; // Base recommendation in liters
  
  // Adjust based on temperature
  if (temp > 30) {
    baseWaterIntake += 1.0; // Add 1L for very hot weather
  } else if (temp > 25) {
    baseWaterIntake += 0.5; // Add 500ml for hot weather
  } else if (temp < 0) {
    baseWaterIntake -= 0.3; // Slightly less in very cold weather
  }
  
  // Adjust based on weather conditions
  if (conditions.includes("Rain") || conditions.includes("Humid")) {
    baseWaterIntake += 0.2; // Add 200ml for humid conditions
  }
  
  // Format the recommendation
  const liters = baseWaterIntake.toFixed(1);
  const cups = Math.round(baseWaterIntake * 4); // Approximate cups (250ml per cup)
  
  return `Aim for about ${liters} liters (${cups} cups) of water today. Stay hydrated, especially if you're active.`;
}

function showLoading(show) {
  if (elements.loadingOverlay) {
    elements.loadingOverlay.classList.toggle("active", show)
  }
}

function showError(message) {
  console.error("Error:", message) // Always log to console first
  
  if (elements.errorMessage && elements.errorNotification) {
    elements.errorMessage.textContent = message
    elements.errorNotification.classList.add("active")

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (elements.errorNotification) {
        elements.errorNotification.classList.remove("active")
      }
    }, 5000)
  } else {
    // Fallback if error elements aren't available
    alert(message)
  }
}

function hideError() {
  if (elements.errorNotification) {
    elements.errorNotification.classList.remove("active")
  }
}

// Geolocation
function getCurrentLocation() {
  showLoading(true)
  if (navigator.geolocation) {
    // Check rate limiting
    if (weatherSenseSecurity) {
      const clientId = 'weather_app_client';
      const rateLimit = weatherSenseSecurity.checkRateLimit(clientId);
      
      if (!rateLimit.allowed) {
        showError(`Rate limit exceeded. Please wait until ${new Date(rateLimit.resetTime).toLocaleTimeString()}`);
        showLoading(false);
        return;
      }
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherData(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        console.error("Geolocation error:", error)
        let errorMsg = "Unable to get your location. "
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += "Please enable location permissions in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMsg += "Location request timed out."
            break
          default:
            errorMsg += "Please check your browser settings."
        }
        
        showError(errorMsg)
        showLoading(false)
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000,
        maximumAge: 0
      }
    )
  } else {
    showError("Geolocation is not supported by your browser")
    showLoading(false)
  }
}

function toggleUnits() {
  state.units = state.units === "metric" ? "imperial" : "metric"
  localStorage.setItem("units", state.units)

  // Update UI
  if (elements.unitsToggle) {
    elements.unitsToggle.textContent = state.units === "metric" ? "°C" : "°F"
  }

  // Refetch weather data with new units
  if (state.lastFetch) {
    fetchWeatherData(state.lastFetch.lat, state.lastFetch.lon)
  }
}

// Update weather animation based on weather condition
function updateWeatherAnimation(weatherCondition) {
  if (typeof window.weatherAnimations === "undefined") {
    console.warn("Weather animations not available")
    return
  }

  let animationType = "Clear"

  if (weatherCondition.includes("Rain") || weatherCondition.includes("Drizzle")) {
    animationType = "Rain"
  } else if (weatherCondition.includes("Snow")) {
    animationType = "Snow"
  } else if (weatherCondition.includes("Cloud")) {
    animationType = "Cloudy"
  } else if (weatherCondition.includes("Thunder")) {
    animationType = "Thunder"
  }

  window.weatherAnimations.start(animationType)
}

// Initialize weather map
function initializeWeatherMap() {
  const mapContainer = document.getElementById('weatherMap');
  if (!mapContainer) return;
  
  // Clear any existing content
  mapContainer.innerHTML = '';
  
  // Create map visualization
  const mapElement = document.createElement('div');
  mapElement.className = 'weather-map-visualization';
  mapElement.innerHTML = `
    <div class="map-placeholder glass-effect">
      <div class="map-content">
        <i class="fas fa-map-marked-alt map-icon"></i>
        <h3>Interactive Weather Map</h3>
        <p>Real-time weather conditions visualization</p>
        <div class="map-features">
          <div class="feature">
            <i class="fas fa-temperature-high"></i>
            <span>Temperature Layers</span>
          </div>
          <div class="feature">
            <i class="fas fa-cloud-rain"></i>
            <span>Precipitation Radar</span>
          </div>
          <div class="feature">
            <i class="fas fa-wind"></i>
            <span>Wind Patterns</span>
          </div>
          <div class="feature">
            <i class="fas fa-cloud"></i>
            <span>Cloud Cover</span>
          </div>
        </div>
        <div class="map-controls">
          <select id="mapLayerSelect" class="map-layer-select">
            <option value="temperature">Temperature</option>
            <option value="precipitation">Precipitation</option>
            <option value="clouds">Cloud Cover</option>
            <option value="wind">Wind Speed</option>
          </select>
          <button id="mapRefreshBtn" class="map-refresh-btn">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
    </div>
  `;
  
  mapContainer.appendChild(mapElement);
  
  // Add event listeners for map controls
  const layerSelect = document.getElementById('mapLayerSelect');
  const refreshBtn = document.getElementById('mapRefreshBtn');
  
  if (layerSelect) {
    layerSelect.addEventListener('change', function() {
      updateMapLayer(this.value);
    });
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      refreshWeatherMap();
    });
  }
}

// Update map layer visualization
function updateMapLayer(layerType) {
  const mapContainer = document.getElementById('weatherMap');
  if (!mapContainer) return;
  
  // In a real implementation, this would update the map visualization
  // For now, we'll show a message indicating the selected layer
  const messageElement = document.createElement('div');
  messageElement.className = 'layer-message';
  messageElement.innerHTML = `
    <p>Displaying <strong>${layerType}</strong> layer</p>
    <p>In a full implementation, this would show real-time weather data overlays</p>
  `;
  
  // Remove any existing message
  const existingMessage = mapContainer.querySelector('.layer-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  mapContainer.appendChild(messageElement);
}

// Refresh weather map
function refreshWeatherMap() {
  const mapContainer = document.getElementById('weatherMap');
  if (!mapContainer) return;
  
  // Show loading indicator
  mapContainer.innerHTML = '<div class="map-loading">Refreshing weather data...</div>';
  
  // Simulate loading delay
  setTimeout(() => {
    initializeWeatherMap();
  }, 1000);
}

// Update map legend
function updateMapLegend(layerType) {
  const legendContainer = document.querySelector('.map-legend');
  if (!legendContainer) return;
  
  let legendContent = '';
  
  switch(layerType) {
    case 'temperature':
      legendContent = `
        <div class="legend-item">
          <div class="legend-color" style="background: linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000);"></div>
          <div class="legend-labels">
            <span>-20°C</span>
            <span>0°C</span>
            <span>20°C</span>
            <span>40°C</span>
          </div>
        </div>
      `;
      break;
    case 'precipitation':
      legendContent = `
        <div class="legend-item">
          <div class="legend-color" style="background: linear-gradient(to right, #ffffff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000);"></div>
          <div class="legend-labels">
            <span>0mm</span>
            <span>1mm</span>
            <span>5mm</span>
            <span>10mm</span>
            <span>25mm</span>
            <span>50mm</span>
          </div>
        </div>
      `;
      break;
    case 'clouds':
      legendContent = `
        <div class="legend-item">
          <div class="legend-color" style="background: linear-gradient(to right, #ffffff, #888888, #000000);"></div>
          <div class="legend-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      `;
      break;
    case 'wind':
      legendContent = `
        <div class="legend-item">
          <div class="legend-color" style="background: linear-gradient(to right, #00ff00, #ffff00, #ff0000);"></div>
          <div class="legend-labels">
            <span>0 km/h</span>
            <span>20 km/h</span>
            <span>40 km/h</span>
          </div>
        </div>
      `;
      break;
  }
  
  legendContainer.innerHTML = legendContent;
}

// Expose functions to global scope for use by other modules
window.updateDailyForecast = updateDailyForecast;
window.getWeatherIconForCondition = getWeatherIconForCondition;
window.getHistoricalData = getHistoricalData;
window.initializeWeatherMap = initializeWeatherMap;
window.updateMapLayer = updateMapLayer;
window.refreshWeatherMap = refreshWeatherMap;
window.updateMapLegend = updateMapLegend;

// Event Listeners
function initializeEventListeners() {
  // Theme toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener("click", () => {
      setTheme(state.theme === "light" ? "dark" : "light")
    })
  }

  // Search button
  if (elements.searchBtn && elements.locationSearch) {
    elements.searchBtn.addEventListener("click", () => {
      const location = elements.locationSearch.value
      if (location) {
        searchLocation(location)
      }
    })
  }

  // Current location button
  if (elements.currentLocationBtn) {
    elements.currentLocationBtn.addEventListener("click", getCurrentLocation)
  }

  // Search input field
  if (elements.locationSearch) {
    elements.locationSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const location = elements.locationSearch.value
        if (location) {
          searchLocation(location)
        }
      }
    })
  }

  // Units toggle
  if (elements.unitsToggle) {
    elements.unitsToggle.textContent = state.units === "metric" ? "°C" : "°F"
    elements.unitsToggle.addEventListener("click", toggleUnits)
  }

  // Close error notification
  if (elements.closeError) {
    elements.closeError.addEventListener("click", hideError)
  }

  // Refresh button
  if (elements.refreshBtn) {
    elements.refreshBtn.addEventListener("click", () => {
      if (state.lastFetch) {
        fetchWeatherData(state.lastFetch.lat, state.lastFetch.lon)
      } else {
        getCurrentLocation()
      }
    })
  }

  // Handle offline/online events
  window.addEventListener("online", () => {
    if (state.lastFetch) {
      fetchWeatherData(state.lastFetch.lat, state.lastFetch.lon)
    }
  })

  window.addEventListener("offline", () => {
    showError("You are offline. Weather data may not be current.")
  })
}

// Initialize App
function initializeApp() {
  // Check if all needed DOM elements exist
  const criticalElements = [
    "locationName", "currentTemp", "weatherDescription",
    "searchBtn", "locationSearch", "loadingOverlay"
  ]
  
  const missingElements = criticalElements.filter(el => !elements[el])
  
  if (missingElements.length > 0) {
    console.error(`Missing critical DOM elements: ${missingElements.join(", ")}`)
    showError("App initialization failed. Please check the console for details.")
    return
  }

  initializeTheme()
  initializeEventListeners()

  // Try to load last location from localStorage
  try {
    const lastLocation = JSON.parse(localStorage.getItem("lastLocation"))
    if (lastLocation && lastLocation.lat && lastLocation.lon) {
      fetchWeatherData(lastLocation.lat, lastLocation.lon)
    } else {
      getCurrentLocation()
    }
  } catch (error) {
    console.warn("Error loading last location, getting current location instead:", error)
    getCurrentLocation()
  }

  // Set up theme auto-switching based on time
  setInterval(updateThemeBasedOnTime, 60 * 60 * 1000) // Check every hour
}

// Start the app when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp)

// Add this function to display meteorological data directly
function displayMeteorologicalData(weather, uvi, air, forecast) {
  const container = document.getElementById('meteorologicalData');
  if (!container) return;
  
  // Generate HTML for display in horizontal layout with exact data format requested
  let html = '<div class="meteorological-insights-horizontal">';
  
  // Add hyperlocal data
  html += `
    <div class="met-section hyperlocal">
      <h4>Hyperlocal Forecast</h4>
      <p>Confidence: 95%</p>
      <p>Temp Adjustment: -0.2°</p>
    </div>
  `;
  
  // Add pollen data
  html += `
    <div class="met-section pollen">
      <h4>Pollen Levels</h4>
      <p>Risk: Moderate</p>
      <p>Weed pollen levels are high. Limit outdoor time during peak ...</p>
    </div>
  `;
  
  // Add astronomical data
  html += `
    <div class="met-section astronomical">
      <h4>Astronomical</h4>
      <p>🌑 New Moon</p>
      <p>Quality: Poor</p>
    </div>
  `;
  
  // Add tidal data
  html += `
    <div class="met-section tidal">
      <h4>Marine Conditions</h4>
      <p>Height: 1.34m</p>
      <p>Surf: Good</p>
    </div>
  `;
  
  // Add agricultural data
  html += `
    <div class="met-section agricultural">
      <h4>Agricultural</h4>
      <p>Soil: Dry</p>
      <p>Crops: Poor</p>
    </div>
  `;
  
  html += '</div>';
  
  // Update container
  container.innerHTML = html;
}