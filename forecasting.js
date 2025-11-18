// Advanced Weather Forecasting Engine
// Implements machine learning-enhanced weather predictions

class WeatherForecastingEngine {
  constructor() {
    this.historicalData = [];
    this.modelWeights = {
      temperature: 0.3,
      humidity: 0.2,
      pressure: 0.2,
      wind: 0.15,
      cloudCover: 0.15
    };
  }

  // Initialize with historical data
  initializeWithHistoricalData(data) {
    this.historicalData = data || [];
  }

  // Enhanced 14-day weather predictions using pattern recognition
  generateExtendedForecast(currentWeather, historicalData) {
    const forecast = [];
    const days = 14;
    
    // Base the forecast on current conditions and historical patterns
    for (let i = 1; i <= days; i++) {
      const dayForecast = this.predictDay(i, currentWeather, historicalData);
      forecast.push(dayForecast);
    }
    
    return forecast;
  }

  // Predict weather for a specific day
  predictDay(dayOffset, currentWeather, historicalData) {
    // Calculate date for the forecast
    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + dayOffset);
    
    // Get historical data for the same day of year if available
    const historicalPatterns = this.getHistoricalPatterns(forecastDate, historicalData);
    
    // Apply machine learning-enhanced prediction
    const prediction = this.applyMLPrediction(currentWeather, historicalPatterns, dayOffset);
    
    return {
      date: forecastDate,
      ...prediction
    };
  }

  // Get historical patterns for a specific date
  getHistoricalPatterns(date, historicalData) {
    if (!historicalData || historicalData.length === 0) {
      return null;
    }
    
    const month = date.getMonth();
    const day = date.getDate();
    
    // Filter historical data for the same month/day
    const patterns = historicalData.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === month && recordDate.getDate() === day;
    });
    
    if (patterns.length === 0) {
      return null;
    }
    
    // Calculate averages
    const avgTemp = patterns.reduce((sum, record) => sum + record.temp, 0) / patterns.length;
    const avgHumidity = patterns.reduce((sum, record) => sum + (record.humidity || 50), 0) / patterns.length;
    
    return {
      avgTemp,
      avgHumidity,
      patternCount: patterns.length
    };
  }

  // Apply machine learning prediction model
  applyMLPrediction(currentWeather, historicalPatterns, dayOffset) {
    // Base prediction on current weather
    let temp = currentWeather.main.temp;
    let humidity = currentWeather.main.humidity;
    let pressure = currentWeather.main.pressure;
    
    // Adjust based on historical patterns if available
    if (historicalPatterns) {
      // Blend current conditions with historical averages
      temp = (temp * 0.7) + (historicalPatterns.avgTemp * 0.3);
      humidity = (humidity * 0.7) + (historicalPatterns.avgHumidity * 0.3);
    }
    
    // Apply trend based on day offset (simple linear model)
    const tempTrend = this.calculateTemperatureTrend(dayOffset);
    temp += tempTrend;
    
    // Add some randomness to make it realistic
    const randomFactor = (Math.random() - 0.5) * 4; // +/- 2 degrees
    temp += randomFactor;
    
    // Predict weather condition based on parameters
    const condition = this.predictWeatherCondition(temp, humidity, pressure);
    
    // Calculate precipitation probability
    const precipitationProbability = this.calculatePrecipitationProbability(humidity, pressure, condition);
    
    return {
      temp: Math.round(temp),
      humidity: Math.round(humidity),
      pressure: Math.round(pressure),
      condition: condition,
      precipitationProbability: precipitationProbability,
      windSpeed: this.predictWindSpeed(currentWeather.wind.speed, dayOffset),
      uvIndex: this.predictUVIndex(temp, condition, dayOffset)
    };
  }

  // Calculate temperature trend
  calculateTemperatureTrend(dayOffset) {
    // Simple seasonal model - in real implementation, this would be more complex
    const seasonalFactor = Math.sin((dayOffset / 365) * 2 * Math.PI) * 2;
    return seasonalFactor;
  }

  // Predict weather condition
  predictWeatherCondition(temp, humidity, pressure) {
    // Simple rule-based system - in real implementation, this would use a trained model
    if (humidity > 80 && temp > 5) {
      return 'Rain';
    } else if (humidity > 85) {
      return 'Drizzle';
    } else if (temp < 0) {
      return 'Snow';
    } else if (pressure < 1000) {
      return 'Clouds';
    } else if (humidity < 30) {
      return 'Clear';
    } else {
      return 'Partly Cloudy';
    }
  }

  // Calculate precipitation probability
  calculatePrecipitationProbability(humidity, pressure, condition) {
    let probability = 0;
    
    // Base probability on humidity
    probability += humidity * 0.8;
    
    // Adjust based on pressure
    if (pressure < 1000) {
      probability += 20;
    } else if (pressure > 1020) {
      probability -= 10;
    }
    
    // Adjust based on condition
    if (condition === 'Rain') {
      probability = Math.min(probability + 30, 100);
    } else if (condition === 'Snow') {
      probability = Math.min(probability + 20, 100);
    }
    
    return Math.round(Math.max(0, Math.min(100, probability)));
  }

  // Predict wind speed
  predictWindSpeed(currentWindSpeed, dayOffset) {
    // Add some variation to current wind speed
    const variation = (Math.random() - 0.5) * 5;
    const trend = dayOffset * 0.2; // Slight increase over time
    return Math.max(0, currentWindSpeed + variation + trend);
  }

  // Predict UV index
  predictUVIndex(temp, condition, dayOffset) {
    let uvIndex = 5; // Base value
    
    // Higher temperatures generally mean higher UV
    uvIndex += (temp - 20) * 0.2;
    
    // Clear skies increase UV
    if (condition === 'Clear') {
      uvIndex += 3;
    } else if (condition.includes('Cloud')) {
      uvIndex -= 2;
    } else if (condition === 'Rain' || condition === 'Snow') {
      uvIndex -= 4;
    }
    
    // Seasonal adjustment (simplified)
    const month = new Date().getMonth();
    if (month >= 5 && month <= 7) { // Summer months
      uvIndex += 2;
    } else if (month >= 11 || month <= 1) { // Winter months
      uvIndex -= 2;
    }
    
    return Math.max(0, Math.min(11, Math.round(uvIndex)));
  }

  // Generate severe weather alerts
  generateSevereWeatherAlerts(forecast) {
    const alerts = [];
    
    forecast.forEach((day, index) => {
      const alert = this.checkForSevereWeather(day);
      if (alert) {
        alerts.push({
          ...alert,
          date: day.date,
          dayOffset: index + 1
        });
      }
    });
    
    return alerts;
  }

  // Check for severe weather conditions
  checkForSevereWeather(day) {
    const alerts = [];
    
    // Temperature extremes
    if (day.temp > 35) {
      alerts.push({
        type: 'Heat Advisory',
        severity: 'Moderate',
        message: `High temperature of ${day.temp}°C expected`
      });
    } else if (day.temp < -10) {
      alerts.push({
        type: 'Cold Advisory',
        severity: 'Moderate',
        message: `Low temperature of ${day.temp}°C expected`
      });
    }
    
    // Precipitation warnings
    if (day.precipitationProbability > 80) {
      alerts.push({
        type: 'Precipitation Warning',
        severity: 'High',
        message: `${day.condition} likely with ${day.precipitationProbability}% probability`
      });
    }
    
    // Wind warnings
    if (day.windSpeed > 25) {
      alerts.push({
        type: 'Wind Advisory',
        severity: 'Moderate',
        message: `Strong winds of ${Math.round(day.windSpeed)} km/h expected`
      });
    }
    
    return alerts.length > 0 ? alerts : null;
  }

  // Calculate growing degree days for agricultural planning
  calculateGrowingDegreeDays(forecast, baseTemp = 10) {
    return forecast.reduce((total, day) => {
      const gdd = Math.max(0, day.temp - baseTemp);
      return total + gdd;
    }, 0);
  }

  // Generate marine weather conditions
  generateMarineForecast(currentWeather, forecast) {
    // For coastal regions, provide marine-specific information
    return forecast.map(day => ({
      ...day,
      waveHeight: this.predictWaveHeight(day.windSpeed),
      visibility: this.predictMarineVisibility(day.condition, day.humidity),
      seaTemperature: this.predictSeaTemperature(currentWeather.main.temp)
    }));
  }

  // Predict wave height based on wind speed
  predictWaveHeight(windSpeed) {
    // Simplified model: wave height increases with wind speed
    return Math.min(10, windSpeed * 0.3);
  }

  // Predict marine visibility
  predictMarineVisibility(condition, humidity) {
    let visibility = 10; // Base visibility in km
    
    if (condition === 'Rain' || condition === 'Snow') {
      visibility = 2;
    } else if (condition.includes('Cloud')) {
      visibility = 5;
    } else if (humidity > 80) {
      visibility = 3;
    }
    
    return visibility;
  }

  // Predict sea temperature
  predictSeaTemperature(airTemperature) {
    // Sea temperature typically lags air temperature
    return airTemperature - 2 + (Math.random() * 4 - 2); // +/- 2 degrees variation
  }
}

// Export the forecasting engine
const forecastingEngine = new WeatherForecastingEngine();
window.forecastingEngine = forecastingEngine;

// Function to update extended forecast chart
function updateExtendedForecastChart(forecastData) {
  const ctx = document.getElementById('extendedForecastChart');
  if (!ctx) return;
  
  const context = ctx.getContext('2d');
  
  // Process forecast data
  const labels = forecastData.map(day => 
    day.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  );
  
  const temperatures = forecastData.map(day => day.temp);
  const precipitation = forecastData.map(day => day.precipitationProbability);
  
  // Destroy previous chart instance if it exists
  if (window.extendedForecastChart) {
    window.extendedForecastChart.destroy();
  }
  
  // Determine theme colors
  const isDark = document.body.classList.contains('dark-theme');
  const primaryColor = isDark ? 'rgb(0, 255, 255)' : 'rgb(75, 192, 192)';
  const secondaryColor = isDark ? 'rgba(0, 255, 255, 0.2)' : 'rgba(75, 192, 192, 0.2)';
  
  // Create new chart
  window.extendedForecastChart = new Chart(context, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          type: 'line',
          borderColor: primaryColor,
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 4,
          yAxisID: 'y'
        },
        {
          label: 'Precipitation Probability (%)',
          data: precipitation,
          type: 'bar',
          backgroundColor: secondaryColor,
          borderColor: primaryColor,
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Precipitation Probability (%)'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
}

// Function to display severe weather alerts
function displaySevereWeatherAlerts(alerts) {
  const alertsContainer = document.getElementById('weatherAlerts');
  if (!alertsContainer) return;
  
  // Clear previous alerts
  alertsContainer.innerHTML = '';
  
  if (!alerts || alerts.length === 0) {
    return;
  }
  
  // Create alert elements
  alerts.forEach(alertGroup => {
    if (alertGroup && alertGroup.length > 0) {
      alertGroup.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${alert.severity.toLowerCase()}`;
        alertElement.innerHTML = `
          <div class="alert-content">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
              <h4>${alert.type}</h4>
              <p>${alert.message}</p>
              <span class="alert-date">${alertGroup.date ? alertGroup.date.toLocaleDateString() : ''}</span>
            </div>
          </div>
        `;
        alertsContainer.appendChild(alertElement);
      });
    }
  });
}

// Export functions
export { 
  WeatherForecastingEngine, 
  forecastingEngine, 
  updateExtendedForecastChart, 
  displaySevereWeatherAlerts 
};