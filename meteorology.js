// Advanced Meteorological Features
// Implements hyperlocal forecasting, pollen tracking, astronomical conditions, and more

class MeteorologicalInnovations {
  constructor() {
    this.pollenData = null;
    this.astronomicalData = null;
    this.tidalData = null;
    this.soilMoistureData = null;
  }

  // Hyperlocal Forecasting (500m resolution)
  async getHyperlocalForecast(lat, lon) {
    // In a real implementation, this would call a high-resolution weather API
    // For demonstration, we'll simulate hyperlocal data based on the main forecast
    try {
      // Simulate hyperlocal variations based on terrain, urban heat islands, etc.
      const hyperlocalAdjustments = {
        temperature: (Math.random() - 0.5) * 2, // +/- 1°C variation
        humidity: (Math.random() - 0.5) * 10,   // +/- 5% variation
        windSpeed: (Math.random() - 0.5) * 3    // +/- 1.5 m/s variation
      };

      return {
        lat: lat + (Math.random() - 0.5) * 0.005, // Small positional variation
        lon: lon + (Math.random() - 0.5) * 0.005,
        adjustments: hyperlocalAdjustments,
        confidence: 0.85 + Math.random() * 0.1 // 85-95% confidence
      };
    } catch (error) {
      console.warn('Hyperlocal forecasting unavailable:', error);
      return null;
    }
  }

  // Pollen and Allergen Tracking
  async getPollenData(lat, lon, date = new Date()) {
    // In a real implementation, this would call a pollen API
    // For demonstration, we'll simulate pollen data
    try {
      // Common allergens
      const allergens = [
        { name: 'Tree Pollen', level: this.getRandomPollenLevel(), season: 'spring' },
        { name: 'Grass Pollen', level: this.getRandomPollenLevel(), season: 'summer' },
        { name: 'Weed Pollen', level: this.getRandomPollenLevel(), season: 'fall' },
        { name: 'Mold Spores', level: this.getRandomPollenLevel(), season: 'year-round' }
      ];

      // Get current season
      const season = this.getSeason(date);
      
      // Filter relevant allergens for current season
      const relevantAllergens = allergens.filter(a => 
        a.season === 'year-round' || a.season === season
      );

      return {
        date: date.toISOString().split('T')[0],
        location: { lat, lon },
        allergens: relevantAllergens,
        overallRisk: this.calculateOverallRisk(relevantAllergens),
        recommendations: this.getPollenRecommendations(relevantAllergens)
      };
    } catch (error) {
      console.warn('Pollen data unavailable:', error);
      return null;
    }
  }

  // Helper function to get random pollen level
  getRandomPollenLevel() {
    const levels = ['Low', 'Moderate', 'High', 'Very High'];
    const weights = [0.4, 0.3, 0.2, 0.1]; // Weighted towards lower levels
    
    let random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return levels[i];
      }
    }
    
    return levels[0]; // Fallback
  }

  // Helper function to get season
  getSeason(date) {
    const month = date.getMonth() + 1; // 1-12
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  // Calculate overall risk level
  calculateOverallRisk(allergens) {
    const levelValues = { 'Low': 1, 'Moderate': 2, 'High': 3, 'Very High': 4 };
    let total = 0;
    let count = 0;
    
    allergens.forEach(allergen => {
      total += levelValues[allergen.level];
      count++;
    });
    
    const average = total / count;
    
    if (average <= 1.5) return 'Low';
    if (average <= 2.5) return 'Moderate';
    if (average <= 3.5) return 'High';
    return 'Very High';
  }

  // Get pollen recommendations
  getPollenRecommendations(allergens) {
    const highRiskAllergens = allergens.filter(a => 
      a.level === 'High' || a.level === 'Very High'
    );
    
    if (highRiskAllergens.length === 0) {
      return 'Pollen levels are low. Normal outdoor activities are fine.';
    }
    
    const recommendations = [];
    
    if (highRiskAllergens.some(a => a.name.includes('Tree'))) {
      recommendations.push('Tree pollen levels are high. Keep windows closed and consider indoor exercise.');
    }
    
    if (highRiskAllergens.some(a => a.name.includes('Grass'))) {
      recommendations.push('Grass pollen levels are high. Avoid mowing lawn and wear a mask if gardening.');
    }
    
    if (highRiskAllergens.some(a => a.name.includes('Weed'))) {
      recommendations.push('Weed pollen levels are high. Limit outdoor time during peak pollen hours (5-10 AM).');
    }
    
    if (highRiskAllergens.some(a => a.name.includes('Mold'))) {
      recommendations.push('Mold spore levels are high. Keep indoor humidity below 50% and clean damp areas.');
    }
    
    recommendations.push('Consider taking antihistamines before going outdoors and shower after coming inside.');
    
    return recommendations.join(' ');
  }

  // Astronomical Conditions (Stargazing quality, moon phase)
  async getAstronomicalConditions(lat, lon, date = new Date()) {
    try {
      // Calculate moon phase
      const moonPhase = this.calculateMoonPhase(date);
      
      // Calculate stargazing quality based on weather conditions
      // In a real implementation, this would use actual cloud cover, humidity, light pollution data
      const stargazingQuality = this.calculateStargazingQuality();
      
      return {
        date: date.toISOString().split('T')[0],
        location: { lat, lon },
        moonPhase: moonPhase,
        stargazingQuality: stargazingQuality,
        nextNewMoon: this.getNextNewMoon(date),
        nextFullMoon: this.getNextFullMoon(date),
        recommendations: this.getAstronomyRecommendations(stargazingQuality, moonPhase)
      };
    } catch (error) {
      console.warn('Astronomical data unavailable:', error);
      return null;
    }
  }

  // Calculate moon phase
  calculateMoonPhase(date) {
    // Simplified moon phase calculation
    const knownNewMoon = new Date('2023-01-21'); // Known new moon date
    const lunarCycle = 29.53; // Average length of lunar cycle in days
    
    const daysSinceKnownNewMoon = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
    const cyclesSinceKnownNewMoon = daysSinceKnownNewMoon / lunarCycle;
    const phaseFraction = cyclesSinceKnownNewMoon - Math.floor(cyclesSinceKnownNewMoon);
    
    const phases = [
      { name: 'New Moon', icon: '🌑', range: [0, 0.0625] },
      { name: 'Waxing Crescent', icon: '🌒', range: [0.0625, 0.1875] },
      { name: 'First Quarter', icon: '🌓', range: [0.1875, 0.3125] },
      { name: 'Waxing Gibbous', icon: '🌔', range: [0.3125, 0.4375] },
      { name: 'Full Moon', icon: '🌕', range: [0.4375, 0.5625] },
      { name: 'Waning Gibbous', icon: '🌖', range: [0.5625, 0.6875] },
      { name: 'Last Quarter', icon: '🌗', range: [0.6875, 0.8125] },
      { name: 'Waning Crescent', icon: '🌘', range: [0.8125, 0.9375] },
      { name: 'New Moon', icon: '🌑', range: [0.9375, 1] }
    ];
    
    for (const phase of phases) {
      if (phaseFraction >= phase.range[0] && phaseFraction < phase.range[1]) {
        return {
          name: phase.name,
          icon: phase.icon,
          fraction: phaseFraction
        };
      }
    }
    
    // Fallback
    return {
      name: 'Waxing Crescent',
      icon: '🌒',
      fraction: phaseFraction
    };
  }

  // Calculate stargazing quality
  calculateStargazingQuality() {
    // In a real implementation, this would use actual weather data
    // For demonstration, we'll return a random quality level
    const qualities = [
      { level: 'Excellent', score: 90, description: 'Dark, clear skies with excellent visibility' },
      { level: 'Good', score: 75, description: 'Clear skies with good visibility' },
      { level: 'Fair', score: 60, description: 'Partly cloudy with fair visibility' },
      { level: 'Poor', score: 40, description: 'Cloudy with limited visibility' }
    ];
    
    // Weighted random selection (favoring better conditions)
    const weights = [0.3, 0.4, 0.2, 0.1];
    let random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return qualities[i];
      }
    }
    
    return qualities[1]; // Fallback to "Good"
  }

  // Get next new moon
  getNextNewMoon(date) {
    // Simplified calculation
    const nextNewMoon = new Date(date);
    nextNewMoon.setDate(date.getDate() + 15); // Approximate
    return nextNewMoon.toISOString().split('T')[0];
  }

  // Get next full moon
  getNextFullMoon(date) {
    // Simplified calculation
    const nextFullMoon = new Date(date);
    nextFullMoon.setDate(date.getDate() + 15); // Approximate
    return nextFullMoon.toISOString().split('T')[0];
  }

  // Get astronomy recommendations
  getAstronomyRecommendations(quality, moonPhase) {
    const recommendations = [];
    
    if (quality.score >= 75) {
      recommendations.push('Excellent conditions for stargazing tonight!');
      if (moonPhase.name === 'New Moon') {
        recommendations.push('New moon provides ideal dark sky conditions for deep sky objects.');
      } else if (moonPhase.name === 'Full Moon') {
        recommendations.push('Full moon is perfect for lunar observation but may wash out fainter stars.');
      }
    } else if (quality.score >= 60) {
      recommendations.push('Fair conditions for stargazing. Focus on brighter objects.');
    } else {
      recommendations.push('Poor conditions for stargazing. Consider indoor astronomy activities.');
    }
    
    recommendations.push('Allow 20-30 minutes for your eyes to adapt to darkness.');
    
    return recommendations.join(' ');
  }

  // Tidal and Marine Data
  async getTidalData(lat, lon) {
    try {
      // In a real implementation, this would call a tidal API
      // For demonstration, we'll simulate tidal data
      const now = new Date();
      
      return {
        location: { lat, lon },
        currentTime: now.toISOString(),
        nextHighTide: this.calculateNextTide(now, 'high'),
        nextLowTide: this.calculateNextTide(now, 'low'),
        tideHeight: (Math.random() * 4).toFixed(2), // 0-4 meters
        surfConditions: this.calculateSurfConditions(),
        marineRecommendations: this.getMarineRecommendations()
      };
    } catch (error) {
      console.warn('Tidal data unavailable:', error);
      return null;
    }
  }

  // Calculate next tide
  calculateNextTide(date, type) {
    // Simplified calculation - tides occur roughly every 12 hours 25 minutes
    const nextTide = new Date(date);
    nextTide.setHours(date.getHours() + 12);
    nextTide.setMinutes(date.getMinutes() + 25);
    
    return {
      time: nextTide.toISOString(),
      height: (Math.random() * 3 + (type === 'high' ? 2 : 0.5)).toFixed(2)
    };
  }

  // Calculate surf conditions
  calculateSurfConditions() {
    const heights = ['Flat', 'Small (1-2ft)', 'Moderate (3-5ft)', 'Large (6-8ft)', 'Huge (8ft+)'];
    const periods = ['Slow (8-10s)', 'Medium (10-14s)', 'Fast (14s+)'];
    const directions = ['Offshore', 'Cross-shore', 'Onshore'];
    
    return {
      waveHeight: heights[Math.floor(Math.random() * heights.length)],
      wavePeriod: periods[Math.floor(Math.random() * periods.length)],
      windDirection: directions[Math.floor(Math.random() * directions.length)],
      rating: ['Poor', 'Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 4)]
    };
  }

  // Get marine recommendations
  getMarineRecommendations() {
    const surf = this.calculateSurfConditions();
    
    if (surf.rating === 'Excellent' || surf.rating === 'Good') {
      return 'Great conditions for surfing and water activities!';
    } else if (surf.rating === 'Fair') {
      return 'Adequate conditions for experienced surfers.';
    } else {
      return 'Poor conditions for water activities. Stay on shore.';
    }
  }

  // Agricultural Intelligence (Soil moisture, crop health)
  async getAgriculturalData(lat, lon) {
    try {
      // In a real implementation, this would use satellite data and soil sensors
      // For demonstration, we'll simulate agricultural data
      return {
        location: { lat, lon },
        soilMoisture: this.calculateSoilMoisture(),
        growingDegreeDays: this.calculateGrowingDegreeDays(),
        cropHealth: this.assessCropHealth(),
        irrigationNeeds: this.calculateIrrigationNeeds(),
        pestRisk: this.assessPestRisk(),
        recommendations: this.getAgriculturalRecommendations()
      };
    } catch (error) {
      console.warn('Agricultural data unavailable:', error);
      return null;
    }
  }

  // Calculate soil moisture
  calculateSoilMoisture() {
    const levels = ['Very Dry', 'Dry', 'Optimal', 'Moist', 'Waterlogged'];
    const weights = [0.1, 0.2, 0.4, 0.2, 0.1]; // Weighted toward optimal
    
    let random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        // Return both level and percentage (0-100%)
        const percentages = [10, 25, 50, 75, 95];
        return {
          level: levels[i],
          percentage: percentages[i]
        };
      }
    }
    
    return { level: 'Optimal', percentage: 50 }; // Fallback
  }

  // Calculate growing degree days
  calculateGrowingDegreeDays() {
    // Simplified calculation
    const baseTemp = 10; // Base temperature in °C
    const currentTemp = 15 + Math.random() * 15; // 15-30°C
    const gdd = Math.max(0, currentTemp - baseTemp);
    
    return {
      value: Math.round(gdd),
      baseTemperature: baseTemp,
      accumulated: Math.round(gdd * 30) // Accumulated over 30 days
    };
  }

  // Assess crop health
  assessCropHealth() {
    const healthLevels = ['Poor', 'Fair', 'Good', 'Excellent'];
    const weights = [0.1, 0.2, 0.5, 0.2]; // Weighted toward good
    
    let random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return {
          level: healthLevels[i],
          score: 25 + i * 25 // 25, 50, 75, 100
        };
      }
    }
    
    return { level: 'Good', score: 75 }; // Fallback
  }

  // Calculate irrigation needs
  calculateIrrigationNeeds() {
    const soil = this.calculateSoilMoisture();
    
    if (soil.percentage < 30) {
      return {
        needed: true,
        urgency: 'High',
        amount: '20-30mm',
        timing: 'Immediate'
      };
    } else if (soil.percentage < 60) {
      return {
        needed: true,
        urgency: 'Medium',
        amount: '10-15mm',
        timing: 'Within 24 hours'
      };
    } else {
      return {
        needed: false,
        urgency: 'Low',
        amount: '0mm',
        timing: 'Not needed'
      };
    }
  }

  // Assess pest risk
  assessPestRisk() {
    // Simplified pest risk based on conditions
    const humidity = 40 + Math.random() * 50; // 40-90%
    const temp = 15 + Math.random() * 15; // 15-30°C
    
    let riskLevel = 'Low';
    if (humidity > 70 && temp > 20) {
      riskLevel = 'High';
    } else if (humidity > 60 || temp > 25) {
      riskLevel = 'Medium';
    }
    
    return {
      level: riskLevel,
      factors: {
        humidity: Math.round(humidity),
        temperature: Math.round(temp)
      },
      commonPests: riskLevel === 'High' ? 
        ['Aphids', 'Spider Mites', 'Whiteflies'] : 
        ['Aphids']
    };
  }

  // Get agricultural recommendations
  getAgriculturalRecommendations() {
    const soil = this.calculateSoilMoisture();
    const irrigation = this.calculateIrrigationNeeds();
    const pests = this.assessPestRisk();
    
    const recommendations = [];
    
    if (irrigation.needed) {
      recommendations.push(`Irrigation needed: ${irrigation.amount} ${irrigation.timing.toLowerCase()}`);
    }
    
    if (pests.level === 'High') {
      recommendations.push('High pest risk detected. Consider preventive treatment.');
    } else if (pests.level === 'Medium') {
      recommendations.push('Monitor for pests, especially aphids.');
    }
    
    if (soil.level === 'Very Dry' || soil.level === 'Waterlogged') {
      recommendations.push(`Soil moisture at ${soil.level.toLowerCase()} levels. Adjust watering practices.`);
    }
    
    return recommendations.length > 0 ? 
      recommendations.join(' ') : 
      'Conditions are optimal for crop growth.';
  }

  // Aviation Weather (METAR and TAF decoding)
  async getAviationWeather(icaoCode) {
    try {
      // In a real implementation, this would call an aviation weather API
      // For demonstration, we'll simulate aviation weather data
      return {
        icaoCode: icaoCode,
        metar: this.generateSampleMETAR(),
        taf: this.generateSampleTAF(),
        flightRules: this.determineFlightRules(),
        aviationRecommendations: this.getAviationRecommendations()
      };
    } catch (error) {
      console.warn('Aviation weather data unavailable:', error);
      return null;
    }
  }

  // Generate sample METAR (Meteorological Terminal Aviation Routine Weather Report)
  generateSampleMETAR() {
    const conditions = ['CLR', 'FEW', 'SCT', 'BKN', 'OVC'];
    const visibility = (0.5 + Math.random() * 9.5).toFixed(1); // 0.5-10 statute miles
    const temp = Math.round(10 + Math.random() * 20); // 10-30°C
    const dewpoint = Math.round(temp - (5 + Math.random() * 10)); // Usually lower than temp
    const windDir = Math.round(Math.random() * 360); // 0-360 degrees
    const windSpeed = Math.round(Math.random() * 20); // 0-20 knots
    const altimeter = (29.50 + Math.random() * 0.50).toFixed(2); // 29.50-30.00 inHg
    
    return `METAR ${this.getStationCode()} ${this.getCurrentTime()}Z ${windDir}${windSpeed}KT ${visibility}SM ${conditions[Math.floor(Math.random() * conditions.length)]} ${temp}/${dewpoint} A${altimeter.replace('.', '')}`;
  }

  // Generate sample TAF (Terminal Aerodrome Forecast)
  generateSampleTAF() {
    const period = `${this.getCurrentTime()}Z ${this.getFutureTime(24)}`;
    const wind = `${Math.round(Math.random() * 360)}${Math.round(Math.random() * 20)}KT`;
    const visibility = `${(0.5 + Math.random() * 9.5).toFixed(1)}SM`;
    const conditions = ['CLR', 'FEW', 'SCT', 'BKN', 'OVC'][Math.floor(Math.random() * 5)];
    
    return `TAF ${this.getStationCode()} ${period} ${wind} ${visibility} ${conditions} TX${25 + Math.round(Math.random() * 10)}/${this.getFutureTime(12)}Z TN${10 + Math.round(Math.random() * 10)}/${this.getFutureTime(6)}Z`;
  }

  // Helper to get station code
  getStationCode() {
    const codes = ['KJFK', 'KLAX', 'KEWR', 'KSFO', 'KORD'];
    return codes[Math.floor(Math.random() * codes.length)];
  }

  // Helper to get current time in METAR format
  getCurrentTime() {
    const now = new Date();
    return `${now.getUTCDate()}${now.getUTCHours().toString().padStart(2, '0')}${now.getUTCMinutes().toString().padStart(2, '0')}`;
  }

  // Helper to get future time
  getFutureTime(hoursAhead) {
    const future = new Date();
    future.setHours(future.getHours() + hoursAhead);
    return `${future.getUTCDate()}${future.getUTCHours().toString().padStart(2, '0')}${future.getUTCMinutes().toString().padStart(2, '0')}`;
  }

  // Determine flight rules
  determineFlightRules() {
    // Simplified flight rules determination
    const visibility = parseFloat(this.generateSampleMETAR().split(' ')[4]);
    const ceiling = this.generateSampleMETAR().split(' ')[5]; // Cloud condition
    
    if (visibility >= 3 && (ceiling === 'CLR' || ceiling === 'FEW' || ceiling === 'SCT')) {
      return 'VFR'; // Visual Flight Rules
    } else if (visibility >= 1 && ceiling !== 'OVC') {
      return 'MVFR'; // Marginal VFR
    } else {
      return 'IFR'; // Instrument Flight Rules
    }
  }

  // Get aviation recommendations
  getAviationRecommendations() {
    const rules = this.determineFlightRules();
    
    switch (rules) {
      case 'VFR':
        return 'Visual Flight Rules conditions. Clear skies and good visibility.';
      case 'MVFR':
        return 'Marginal Visual Flight Rules. Reduced visibility, proceed with caution.';
      case 'IFR':
        return 'Instrument Flight Rules conditions. Low visibility, flight only with proper instruments.';
      default:
        return 'Check current METAR and TAF for detailed aviation weather information.';
    }
  }

  // Display meteorological data in UI
  displayMeteorologicalData(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '<div class="meteorological-data">';
    
    // Add hyperlocal forecast data if available
    if (data.hyperlocal) {
      html += `
        <div class="hyperlocal-data">
          <h3>Hyperlocal Forecast</h3>
          <p>Confidence: <strong>${Math.round(data.hyperlocal.confidence * 100)}%</strong></p>
          <p>Temperature Adjustment: <strong>${data.hyperlocal.adjustments.temperature > 0 ? '+' : ''}${data.hyperlocal.adjustments.temperature.toFixed(1)}°</strong></p>
          <p>Humidity Adjustment: <strong>${data.hyperlocal.adjustments.humidity > 0 ? '+' : ''}${data.hyperlocal.adjustments.humidity.toFixed(1)}%</strong></p>
        </div>
      `;
    }
    
    if (data.pollen) {
      html += `
        <div class="pollen-data">
          <h3>Pollen & Allergen Levels</h3>
          <p>Overall Risk: <strong>${data.pollen.overallRisk}</strong></p>
          <ul>
            ${data.pollen.allergens.map(a => 
              `<li>${a.name}: ${a.level}</li>`
            ).join('')}
          </ul>
          <p class="recommendation">${data.pollen.recommendations}</p>
        </div>
      `;
    }
    
    if (data.astronomical) {
      html += `
        <div class="astronomical-data">
          <h3>Astronomical Conditions</h3>
          <p>Moon Phase: <strong>${data.astronomical.moonPhase.icon} ${data.astronomical.moonPhase.name}</strong></p>
          <p>Stargazing Quality: <strong>${data.astronomical.stargazingQuality.level}</strong> (${data.astronomical.stargazingQuality.score}/100)</p>
          <p>Next New Moon: <strong>${data.astronomical.nextNewMoon}</strong></p>
          <p>Next Full Moon: <strong>${data.astronomical.nextFullMoon}</strong></p>
          <p class="recommendation">${data.astronomical.recommendations}</p>
        </div>
      `;
    }
    
    if (data.tidal) {
      html += `
        <div class="tidal-data">
          <h3>Marine Conditions</h3>
          <p>Next High Tide: ${new Date(data.tidal.nextHighTide.time).toLocaleTimeString()}</p>
          <p>Next Low Tide: ${new Date(data.tidal.nextLowTide.time).toLocaleTimeString()}</p>
          <p>Current Tide Height: <strong>${data.tidal.tideHeight}m</strong></p>
          <p>Wave Height: <strong>${data.tidal.surfConditions.waveHeight}</strong></p>
          <p>Surf Conditions: <strong>${data.tidal.surfConditions.rating}</strong></p>
          <p class="recommendation">${data.tidal.marineRecommendations}</p>
        </div>
      `;
    }
    
    if (data.agricultural) {
      html += `
        <div class="agricultural-data">
          <h3>Agricultural Intelligence</h3>
          <p>Soil Moisture: <strong>${data.agricultural.soilMoisture.level}</strong> (${data.agricultural.soilMoisture.percentage}%)</p>
          <p>Crop Health: <strong>${data.agricultural.cropHealth.level}</strong> (${data.agricultural.cropHealth.score}/100)</p>
          <p>Growing Degree Days: <strong>${data.agricultural.growingDegreeDays.value}</strong></p>
          <p>Pest Risk: <strong>${data.agricultural.pestRisk.level}</strong></p>
          <p>Irrigation Needed: <strong>${data.agricultural.irrigationNeeds.needed ? 'Yes' : 'No'}</strong></p>
          <p class="recommendation">${data.agricultural.recommendations}</p>
        </div>
      `;
    }
    
    if (data.aviation) {
      html += `
        <div class="aviation-data">
          <h3>Aviation Weather</h3>
          <p>Flight Rules: <strong>${data.aviation.flightRules}</strong></p>
          <p>METAR: <strong>${data.aviation.metar}</strong></p>
          <p class="recommendation">${data.aviation.aviationRecommendations}</p>
        </div>
      `;
    }
    
    html += '</div>';
    container.innerHTML = html;
  }
}

// Create and export meteorological innovations instance
const meteorologicalInnovations = new MeteorologicalInnovations();
window.meteorologicalInnovations = meteorologicalInnovations;

// Function to display meteorological data in the UI
async function displayMeteorologicalData(weather, uvi, air, forecast) {
  try {
    // Get container element
    const container = document.getElementById('meteorologicalData');
    if (!container) {
      console.warn('Meteorological data container not found');
      return;
    }
    
    // Get location data from weather object
    const lat = weather.coord.lat;
    const lon = weather.coord.lon;
    
    // Create meteorological innovations instance
    const metInnovations = new MeteorologicalInnovations();
    
    // Collect all meteorological data
    const metData = {};
    
    // Get hyperlocal forecast
    metData.hyperlocal = await metInnovations.getHyperlocalForecast(lat, lon);
    
    // Get pollen data
    metData.pollen = await metInnovations.getPollenData(lat, lon);
    
    // Get astronomical conditions
    metData.astronomical = await metInnovations.getAstronomicalConditions(lat, lon);
    
    // Get tidal data (if near coast)
    // Simple check if location might be coastal
    if (Math.abs(lat) < 60) {
      metData.tidal = await metInnovations.getTidalData(lat, lon);
    }
    
    // Get agricultural data
    metData.agricultural = await metInnovations.getAgriculturalData(lat, lon);
    
    // Generate HTML for display in horizontal layout with exact data format requested
    let html = '<div class="meteorological-insights-horizontal">';
    
    // Add hyperlocal data
    if (metData.hyperlocal) {
      html += `
        <div class="met-section hyperlocal">
          <h4>Hyperlocal Forecast</h4>
          <p>Confidence: ${Math.round(metData.hyperlocal.confidence * 100)}%</p>
          <p>Temp Adjustment: ${metData.hyperlocal.adjustments.temperature > 0 ? '+' : ''}${metData.hyperlocal.adjustments.temperature.toFixed(1)}°</p>
        </div>
      `;
    }
    
    // Add pollen data
    if (metData.pollen) {
      // Truncate recommendations to show only the first part
      let pollenRecommendation = metData.pollen.recommendations;
      if (pollenRecommendation.includes('Limit outdoor time during peak')) {
        pollenRecommendation = 'Weed pollen levels are high. Limit outdoor time during peak ...';
      } else if (pollenRecommendation.length > 50) {
        pollenRecommendation = pollenRecommendation.substring(0, 50) + '...';
      }
      
      html += `
        <div class="met-section pollen">
          <h4>Pollen Levels</h4>
          <p>Risk: ${metData.pollen.overallRisk}</p>
          <p>${pollenRecommendation}</p>
        </div>
      `;
    }
    
    // Add astronomical data
    if (metData.astronomical) {
      html += `
        <div class="met-section astronomical">
          <h4>Astronomical</h4>
          <p>${metData.astronomical.moonPhase.icon} ${metData.astronomical.moonPhase.name}</p>
          <p>Quality: ${metData.astronomical.stargazingQuality.level}</p>
        </div>
      `;
    }
    
    // Add tidal data if available
    if (metData.tidal) {
      html += `
        <div class="met-section tidal">
          <h4>Marine Conditions</h4>
          <p>Height: ${metData.tidal.tideHeight}m</p>
          <p>Surf: ${metData.tidal.surfConditions.rating}</p>
        </div>
      `;
    }
    
    // Add agricultural data
    if (metData.agricultural) {
      html += `
        <div class="met-section agricultural">
          <h4>Agricultural</h4>
          <p>Soil: ${metData.agricultural.soilMoisture.level}</p>
          <p>Crops: ${metData.agricultural.cropHealth.level}</p>
        </div>
      `;
    }
    
    html += '</div>';
    
    // Update container
    container.innerHTML = html;
  } catch (error) {
    console.error('Error displaying meteorological data:', error);
    const container = document.getElementById('meteorologicalData');
    if (container) {
      container.innerHTML = '<p>Error loading meteorological data. Please try again later.</p>';
    }
  }
}

// Export for use in other modules
export { MeteorologicalInnovations, meteorologicalInnovations, displayMeteorologicalData };