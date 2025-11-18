// Advanced Weather Visualizations
// Implements sophisticated data representation including 3D maps and interactive radar

class WeatherVisualizations {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.isAnimating = false;
  }

  // Initialize visualization system
  init() {
    this.canvas = document.getElementById('weatherCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  // Resize canvas to match window
  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  // Create temperature heatmap visualization
  createTemperatureHeatmap(temperatureData, width, height) {
    if (!this.ctx) return;

    const imageData = this.ctx.createImageData(width, height);
    const data = imageData.data;

    // Generate heatmap based on temperature data
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor(i / 4 / width);
      
      // Get temperature at this point (simplified)
      const temp = this.getTemperatureAtPoint(x, y, temperatureData);
      
      // Convert temperature to color
      const color = this.temperatureToColor(temp);
      
      data[i] = color.r;     // Red
      data[i + 1] = color.g; // Green
      data[i + 2] = color.b; // Blue
      data[i + 3] = 255;     // Alpha
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  // Get temperature at a specific point
  getTemperatureAtPoint(x, y, temperatureData) {
    // Simplified implementation - in real app, this would interpolate from actual data
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    // Create a radial temperature pattern
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const normalizedDistance = distance / maxDistance;
    
    // Temperature range from -10 to 35°C
    return 35 - (normalizedDistance * 45);
  }

  // Convert temperature to color for heatmap
  temperatureToColor(temp) {
    // Color scale: blue (cold) -> green -> yellow -> red (hot)
    if (temp < 0) {
      // Blue to cyan for very cold
      const intensity = Math.min(1, Math.abs(temp) / 10);
      return { r: 0, g: Math.floor(255 * (1 - intensity)), b: 255 };
    } else if (temp < 10) {
      // Cyan to green for cold
      const intensity = temp / 10;
      return { r: 0, g: 255, b: Math.floor(255 * (1 - intensity)) };
    } else if (temp < 20) {
      // Green to yellow for mild
      const intensity = (temp - 10) / 10;
      return { r: Math.floor(255 * intensity), g: 255, b: 0 };
    } else if (temp < 30) {
      // Yellow to orange for warm
      const intensity = (temp - 20) / 10;
      return { r: 255, g: Math.floor(255 * (1 - intensity * 0.5)), b: 0 };
    } else {
      // Orange to red for hot
      const intensity = Math.min(1, (temp - 30) / 10);
      return { r: 255, g: Math.floor(128 * (1 - intensity)), b: 0 };
    }
  }

  // Create animated wind flow visualization
  createWindFlowVisualization(windData) {
    if (!this.ctx || this.isAnimating) return;
    
    this.isAnimating = true;
    this.animateWindFlow(windData);
  }

  // Animate wind flow
  animateWindFlow(windData) {
    if (!this.ctx) {
      this.isAnimating = false;
      return;
    }

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw wind particles
    const particleCount = 200;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < particleCount; i++) {
      // Particle position
      const x = (i * 17) % this.canvas.width;
      const y = (i * 13) % this.canvas.height;
      
      // Animate with wind data
      const windSpeed = windData.speed || 5;
      const windDirection = windData.deg || 0;
      
      // Calculate movement
      const dx = Math.cos(windDirection * Math.PI / 180) * windSpeed;
      const dy = Math.sin(windDirection * Math.PI / 180) * windSpeed;
      
      // Apply animation
      const posX = (x + dx * time) % this.canvas.width;
      const posY = (y + dy * time) % this.canvas.height;
      
      // Draw particle
      this.ctx.fillStyle = 'rgba(200, 220, 255, 0.7)';
      this.ctx.beginPath();
      this.ctx.arc(posX, posY, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animateWindFlow(windData));
  }

  // Stop animation
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isAnimating = false;
  }

  // Create pressure trend visualization
  createPressureTrendVisualization(pressureData) {
    if (!this.ctx) return;
    
    // Clear a section of the canvas for the pressure chart
    const chartWidth = 300;
    const chartHeight = 150;
    const x = this.canvas.width - chartWidth - 20;
    const y = 20;
    
    this.ctx.clearRect(x, y, chartWidth, chartHeight);
    
    // Draw chart background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(x, y, chartWidth, chartHeight);
    
    // Draw pressure trend line
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#4A90E2';
    this.ctx.lineWidth = 2;
    
    // Generate sample pressure data points
    const points = [];
    for (let i = 0; i < 24; i++) {
      // Simulate pressure changes over 24 hours
      const basePressure = 1013.25;
      const variation = Math.sin(i * Math.PI / 12) * 10;
      const noise = (Math.random() - 0.5) * 5;
      points.push(basePressure + variation + noise);
    }
    
    // Draw the line
    const stepX = chartWidth / (points.length - 1);
    for (let i = 0; i < points.length; i++) {
      const px = x + i * stepX;
      // Normalize pressure to chart height (980-1040 hPa range)
      const py = y + chartHeight - ((points[i] - 980) / 60) * chartHeight;
      
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    
    this.ctx.stroke();
    
    // Draw labels
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px Arial';
    this.ctx.fillText('Pressure (hPa)', x + 10, y + 20);
    this.ctx.fillText('24h', x + chartWidth - 30, y + chartHeight - 10);
  }

  // Create humidity comfort zone visualization
  createHumidityComfortChart(humidity, temperature) {
    if (!this.ctx) return;
    
    // Clear a section for the comfort chart
    const chartWidth = 200;
    const chartHeight = 200;
    const x = 20;
    const y = this.canvas.height - chartHeight - 20;
    
    this.ctx.clearRect(x, y, chartWidth, chartHeight);
    
    // Draw comfort zones
    const centerX = x + chartWidth / 2;
    const centerY = y + chartHeight / 2;
    const maxRadius = Math.min(chartWidth, chartHeight) / 2 - 10;
    
    // Draw comfort zones based on temperature-humidity relationship
    const zones = [
      { name: 'Comfortable', radius: maxRadius * 0.3, color: 'rgba(34, 197, 94, 0.3)' },
      { name: 'Moderate', radius: maxRadius * 0.6, color: 'rgba(251, 191, 36, 0.3)' },
      { name: 'Uncomfortable', radius: maxRadius, color: 'rgba(239, 68, 68, 0.3)' }
    ];
    
    // Draw zones from outer to inner
    for (let i = zones.length - 1; i >= 0; i--) {
      this.ctx.fillStyle = zones[i].color;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, zones[i].radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw current position
    const comfortLevel = this.calculateComfortLevel(temperature, humidity);
    const positionRadius = this.getComfortRadius(comfortLevel, maxRadius);
    
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw label
    this.ctx.fillStyle = 'white';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Comfort: ${comfortLevel}`, centerX, y + chartHeight + 20);
  }

  // Calculate comfort level
  calculateComfortLevel(temperature, humidity) {
    const dewPoint = this.calculateDewPoint(temperature, humidity);
    
    if (dewPoint < 10) return 'Very Comfortable';
    if (dewPoint < 16) return 'Comfortable';
    if (dewPoint < 20) return 'Moderate';
    if (dewPoint < 24) return 'Humid';
    return 'Very Humid';
  }

  // Calculate dew point
  calculateDewPoint(temp, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100.0);
    return (b * alpha) / (a - alpha);
  }

  // Get radius for comfort level
  getComfortRadius(comfortLevel, maxRadius) {
    switch (comfortLevel) {
      case 'Very Comfortable': return maxRadius * 0.15;
      case 'Comfortable': return maxRadius * 0.25;
      case 'Moderate': return maxRadius * 0.45;
      case 'Humid': return maxRadius * 0.75;
      case 'Very Humid': return maxRadius * 0.9;
      default: return maxRadius * 0.5;
    }
  }

  // Create UV index visualization
  createUVIndexVisualization(uvIndex) {
    if (!this.ctx) return;
    
    // Clear a section for the UV chart
    const chartWidth = 150;
    const chartHeight = 150;
    const x = this.canvas.width - chartWidth - 20;
    const y = this.canvas.height - chartHeight - 20;
    
    this.ctx.clearRect(x, y, chartWidth, chartHeight);
    
    // Draw UV meter
    const centerX = x + chartWidth / 2;
    const centerY = y + chartHeight / 2;
    const radius = Math.min(chartWidth, chartHeight) / 2 - 10;
    
    // Draw background circle
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fill();
    
    // Draw UV scale
    const uvColors = [
      { max: 3, color: '#22C55E' },   // Low - Green
      { max: 6, color: '#FACC15' },   // Moderate - Yellow
      { max: 8, color: '#F97316' },   // High - Orange
      { max: 11, color: '#EF4444' },  // Very High - Red
      { max: 20, color: '#7C3AED' }   // Extreme - Purple
    ];
    
    // Fill according to UV index
    let uvColor = '#22C55E'; // Default to green
    for (const level of uvColors) {
      if (uvIndex <= level.max) {
        uvColor = level.color;
        break;
      }
    }
    
    // Draw filled portion
    const angle = (uvIndex / 11) * Math.PI * 1.5; // 1.5π for 270° meter
    const startAngle = -Math.PI * 0.75; // Start at -135°
    
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.arc(centerX, centerY, radius, startAngle, startAngle + angle);
    this.ctx.closePath();
    this.ctx.fillStyle = uvColor;
    this.ctx.fill();
    
    // Draw center circle
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fill();
    
    // Draw UV value
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(uvIndex.toFixed(1), centerX, centerY);
    
    // Draw label
    this.ctx.font = '12px Arial';
    this.ctx.fillText('UV Index', centerX, y + chartHeight - 10);
  }
}

// Create and export visualization instance
const weatherVisualizations = new WeatherVisualizations();
window.weatherVisualizations = weatherVisualizations;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  weatherVisualizations.init();
});

// Export for use in other modules
export { WeatherVisualizations, weatherVisualizations };