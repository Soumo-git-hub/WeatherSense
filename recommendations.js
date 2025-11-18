// Weather Recommendations

function getHealthWellnessRecommendation(temp, conditions, uvIndex, airQuality, userPreferences = {}) {
    const isRainy = conditions.includes("Rain") || conditions.includes("Drizzle");
    const isSnowy = conditions.includes("Snow");
    const isExtremeCold = temp < -15;
    const isExtremeHeat = temp > 38;
    const isPoorAir = airQuality >= 4;
    const isHighUV = uvIndex > 7;
    const isWindy = conditions.includes("Windy") || conditions.includes("wind");
    const isHumid = conditions.includes("Humid") || conditions.includes("humidity");
    const isClear = conditions.includes("Clear");
    
    // Apply user preferences if available
    const healthConditions = userPreferences.healthConditions || [];
    const ageGroup = userPreferences.ageGroup || "adult";
    const activityLevel = userPreferences.activityLevel || "moderate";
    
    // Create an array to hold all relevant advice
    const adviceList = [];
    
    // Air quality health advice
    if (isPoorAir) {
        adviceList.push("Air quality is poor. Limit outdoor activities, especially if you have respiratory issues. Consider using an air purifier indoors.");
    }
    
    // Extreme temperature warnings
    if (isExtremeCold) {
        adviceList.push("Extreme cold warning! Risk of hypothermia and frostbite. Limit outdoor exposure, dress in multiple layers, and protect extremities.");
    }
    
    if (isExtremeHeat) {
        adviceList.push("Heat advisory! Risk of heat exhaustion or heat stroke. Stay hydrated, seek shade, and limit physical activity during peak hours.");
    }
    
    // UV health recommendations
    if (isHighUV) {
        adviceList.push("High UV index today. Wear sunscreen (SPF 30+), sunglasses, and a wide-brimmed hat. Seek shade between 10am-4pm.");
    }
    
    // Weather-specific health tips
    if (isRainy) {
        adviceList.push("Increased humidity may affect joint pain. Higher risk of slips and falls on wet surfaces. Consider indoor exercise options.");
        
        // Personalize based on user health conditions
        if (healthConditions.includes("arthritis")) {
            adviceList.push("Gentle stretching or warm baths may help with joint discomfort in humid conditions.");
        }
        
        if (healthConditions.includes("asthma")) {
            adviceList.push("Rain can increase mold spores. Keep inhaler accessible and consider staying indoors if you're sensitive.");
        }
    }
    
    if (isSnowy) {
        adviceList.push("Cold weather can strain the heart. Dress warmly in layers and be cautious during physical activities. Watch for signs of frostbite.");
        
        // Personalize based on age group
        if (ageGroup === "senior") {
            adviceList.push("Seniors should be especially cautious and limit prolonged outdoor exposure. Ensure proper heating indoors.");
        }
        
        if (activityLevel === "high") {
            adviceList.push("For outdoor activities in snow, protect extremities and take frequent breaks in warm areas.");
        }
    }
    
    if (isWindy) {
        adviceList.push("Windy conditions can increase heat loss and dry out skin/mucous membranes. Protect eyes and skin.");
        
        if (healthConditions.includes("allergies")) {
            adviceList.push("Wind can spread pollen and irritants. Consider staying indoors if you have allergies.");
        }
    }
    
    if (isHumid) {
        adviceList.push("High humidity can make it harder for the body to cool itself. Stay hydrated and take breaks in cooler areas.");
        
        if (healthConditions.includes("asthma")) {
            adviceList.push("Humid conditions can worsen respiratory issues. Use air conditioning to reduce indoor humidity if possible.");
        }
    }
    
    // Temperature-based recommendations
    if (temp > 30) {
        adviceList.push("Hot temperatures increase dehydration risk. Drink water regularly, even if you don't feel thirsty.");
        
        if (activityLevel === "high") {
            adviceList.push("Schedule outdoor activities for early morning or evening when temperatures are lower.");
        }
    } else if (temp < 0) {
        adviceList.push("Cold temperatures increase risk of hypothermia. Dress in layers and protect extremities.");
        
        if (ageGroup === "senior" || healthConditions.includes("heart")) {
            adviceList.push("Cold weather puts extra strain on the heart. Take it easy with physical activities.");
        }
    } else if (temp < 10) {
        adviceList.push("Cooler temperatures may affect sleep quality. Keep your bedroom slightly cooler for optimal rest.");
        
        if (ageGroup === "senior") {
            adviceList.push("Ensure proper heating and check on elderly family members.");
        }
    }
    
    // General wellness advice based on favorable conditions
    if (temp > 18 && temp < 28 && isClear) {
        adviceList.push("Ideal conditions for outdoor exercise and vitamin D synthesis. Consider a walk or outdoor activity to boost mood and energy.");
    }
    
    // Mental health considerations
    if (isRainy || conditions.includes("Clouds")) {
        adviceList.push("Overcast weather can affect mood. Try to get natural light exposure and maintain regular routines.");
        
        if (healthConditions.includes("depression")) {
            adviceList.push("If you're sensitive to weather changes, consider light therapy or staying connected with others.");
        }
    }
    
    // Default advice if no specific conditions apply
    if (adviceList.length === 0) {
        adviceList.push("Maintain regular hydration throughout the day. Monitor how weather changes affect your body and adjust activities accordingly.");
    }
    
    // Return all advice as a single string
    return adviceList.join(" ");
}
  
function getActivityRecommendation(temp, conditions, airQuality, userPreferences = {}) {
    const isRainy = conditions.includes("Rain") || conditions.includes("Drizzle")
    const isSnowy = conditions.includes("Snow")
    const isStormy = conditions.includes("Storm") || conditions.includes("Thunder")
    const isPoorAir = airQuality >= 4
    
    // Apply user preferences
    const activityType = userPreferences.preferredActivityType || "mixed";
    const fitnessLevel = userPreferences.fitnessLevel || "moderate";
    const ageGroup = userPreferences.ageGroup || "adult";
  
    if (isStormy) {
      return activityType === "outdoor" 
        ? "Stay indoors and avoid travel if possible. Consider indoor alternatives like yoga or reading." 
        : "Perfect time for indoor activities like cooking, reading, or home workouts.";
    }
    
    if (isPoorAir) {
      return activityType === "outdoor" 
        ? "Consider indoor activities due to poor air quality. Try gym workouts or home exercises." 
        : "Ideal for indoor activities. Consider yoga, pilates, or creative hobbies.";
    }
  
    if (isRainy) {
      if (activityType === "outdoor") {
        return fitnessLevel === "high" 
          ? "If you enjoy outdoor activities in rain, consider waterproof gear for hiking or running." 
          : "Indoor activities recommended. Visit museums, galleries, or cafes.";
      } else {
        return "Perfect for indoor activities like cooking classes, art projects, or spa day.";
      }
    }
  
    if (isSnowy) {
      if (temp < -5) {
        return activityType === "outdoor" 
          ? "Limited outdoor exposure recommended. If going out, dress warmly and limit time outside." 
          : "Great time for indoor activities. Try baking, reading, or home organization.";
      } else {
        if (activityType === "outdoor") {
          return fitnessLevel === "high" 
            ? "Perfect for winter sports enthusiasts: skiing, snowboarding, or ice skating." 
            : "Winter sports like skiing or sledding would be perfect for beginners.";
        } else {
          return "Enjoy indoor winter activities like hot chocolate making, winter crafts, or movie marathons.";
        }
      }
    }
  
    if (temp > 30) {
      if (activityType === "outdoor") {
        return fitnessLevel === "high" 
          ? "For heat-tolerant individuals: Early morning or evening outdoor workouts. Stay hydrated!" 
          : "Indoor activities or water-based activities recommended. Stay hydrated and cool.";
      } else {
        return "Ideal for indoor climate-controlled activities. Consider swimming or water aerobics.";
      }
    }
    
    if (temp < 0) {
      if (activityType === "outdoor") {
        return fitnessLevel === "high" 
          ? "For cold-weather enthusiasts: Winter jogging or snowshoeing with proper gear." 
          : "Limited outdoor exposure recommended. Indoor sports like basketball or badminton ideal.";
      } else {
        return "Perfect for cozy indoor activities like baking, crafting, or board games.";
      }
    }
    
    if (temp > 20 && temp < 30 && conditions.includes("Clear")) {
      if (activityType === "outdoor") {
        return fitnessLevel === "high" 
          ? "Optimal conditions for intense outdoor activities: hiking, cycling, or beach volleyball." 
          : "Perfect for hiking, cycling or beach activities. Great weather for outdoor fun!";
      } else {
        return "Beautiful weather for outdoor picnics, gardening, or open-air markets.";
      }
    }
  
    return activityType === "outdoor" 
      ? "Good conditions for outdoor activities. Consider walking, jogging, or outdoor sports." 
      : "Pleasant weather for either indoor or outdoor activities based on your preference.";
}
  
function getUVRecommendation(uvi, userPreferences = {}) {
    // Apply user preferences
    const skinType = userPreferences.skinType || 3; // Default to Type III (Medium)
    const activityLevel = userPreferences.outdoorActivityLevel || "moderate";
    
    // Adjust recommendations based on skin type
    let baseRecommendation = "";
    if (uvi < 3) {
      baseRecommendation = "Low UV risk - minimal protection needed";
    } else if (uvi < 6) {
      baseRecommendation = "Moderate UV - wear sunscreen and protective clothing";
    } else if (uvi < 8) {
      baseRecommendation = "High UV - limit sun exposure between 10am and 4pm";
    } else {
      baseRecommendation = "Very high UV - avoid sun exposure during peak hours, use SPF 50+ sunscreen";
    }
    
    // Personalize based on skin type
    let skinSpecificAdvice = "";
    switch (skinType) {
      case 1: // Very fair
      case 2: // Fair
        skinSpecificAdvice = "Your skin type burns very easily. Take extra precautions with sun protection.";
        break;
      case 3: // Medium
      case 4: // Olive
        skinSpecificAdvice = "Your skin type burns moderately. Regular sun protection is important.";
        break;
      case 5: // Brown
      case 6: // Dark brown/Black
        skinSpecificAdvice = "Your skin type rarely burns but still needs protection to prevent long-term damage.";
        break;
      default:
        skinSpecificAdvice = "";
    }
    
    // Adjust for activity level
    let activityAdvice = "";
    if (activityLevel === "high" && uvi >= 3) {
      activityAdvice = "Since you're highly active outdoors, reapply sunscreen every 2 hours and consider UV-blocking clothing.";
    } else if (activityLevel === "low" && uvi >= 6) {
      activityAdvice = "With limited outdoor activity, you can still enjoy outdoor time with proper protection.";
    }
    
    // Combine recommendations
    let finalRecommendation = baseRecommendation;
    if (skinSpecificAdvice) finalRecommendation += ` ${skinSpecificAdvice}`;
    if (activityAdvice) finalRecommendation += ` ${activityAdvice}`;
    
    return finalRecommendation;
}

// New function for food recommendations based on weather
function getFoodRecommendation(temp, conditions) {
    const isRainy = conditions.includes("Rain") || conditions.includes("Drizzle")
    const isSnowy = conditions.includes("Snow")
    const isHot = temp > 25
    const isCold = temp < 10

    if (isHot) {
        return "Focus on hydrating foods like watermelon, cucumber, and leafy greens. Light meals like salads and cold soups are ideal."
    } else if (isCold) {
        return "Warming foods like soups, stews, and hot cereals. Include root vegetables and warming spices like ginger and cinnamon."
    } else if (isRainy) {
        return "Comfort foods like soups and warm beverages. Include vitamin C rich foods to boost immunity."
    } else if (isSnowy) {
        return "Hearty meals with complex carbs for sustained energy. Hot beverages with cinnamon or ginger to maintain body warmth."
    } else {
        return "Balanced meals with seasonal produce. Include a mix of proteins, whole grains, and fresh vegetables."
    }
}

// Enhanced function for water intake recommendations
function getWaterRecommendation(temp, conditions, activityLevel = "moderate", userPreferences = {}) {
    // Base recommendation (in liters) - 2.5L for men, 2L for women on average
    let baseRecommendation = userPreferences.gender === "male" ? 2.5 : 2.0;
    
    // Adjust for temperature
    if (temp > 35) {
        baseRecommendation += 1.5 // Add 1.5L for extremely hot weather
    } else if (temp > 30) {
        baseRecommendation += 1.0 // Add 1L for very hot weather
    } else if (temp > 25) {
        baseRecommendation += 0.5 // Add 500ml for hot weather
    } else if (temp < 0) {
        baseRecommendation -= 0.3 // Slightly less in very cold weather (but still important)
    }
    
    // Adjust for humidity and conditions
    if (conditions.includes("Humid") || conditions.includes("Mist")) {
        baseRecommendation += 0.4 // Add 400ml for humid conditions
    }
    
    if (conditions.includes("Rain") || conditions.includes("Drizzle")) {
        baseRecommendation += 0.2 // Add 200ml for rainy conditions
    }
    
    // Adjust for activity level
    if (activityLevel === "high") {
        baseRecommendation += 1.2 // Add 1.2L for high activity
    } else if (activityLevel === "low") {
        baseRecommendation -= 0.3 // Reduce by 300ml for low activity
    }
    
    // Adjust for user age
    const age = userPreferences.age || 30;
    if (age > 65) {
        baseRecommendation += 0.3; // Slightly more for seniors
    } else if (age < 18) {
        baseRecommendation += 0.2; // Slightly more for teens
    }
    
    // Adjust for health conditions
    const healthConditions = userPreferences.healthConditions || [];
    if (healthConditions.includes("diabetes")) {
        baseRecommendation += 0.3; // More water for diabetics
    }
    
    if (healthConditions.includes("kidney")) {
        // For kidney conditions, consult doctor but provide general advice
        baseRecommendation = Math.min(baseRecommendation, 2.5); // Cap at 2.5L unless specified
    }
    
    // Format the recommendation
    const liters = Math.max(1.0, baseRecommendation).toFixed(1); // Minimum 1L
    const cups = Math.round(parseFloat(liters) * 4); // Approximate cups (250ml per cup)
    
    // Personalized advice based on conditions
    const adviceItems = [];
    
    if (temp > 30) {
        adviceItems.push("Drink water before you feel thirsty, as dehydration can happen quickly in extreme heat.");
        adviceItems.push("Consider electrolyte replacement if you're sweating heavily.");
    } else if (temp < 5) {
        adviceItems.push("Stay hydrated even in cold weather. Warm beverages like herbal tea count toward your intake.");
        adviceItems.push("Eat water-rich foods like soups and fruits.");
    }
    
    if (conditions.includes("Humid")) {
        adviceItems.push("High humidity can mask dehydration. Monitor your urine color as a hydration indicator.");
    }
    
    if (conditions.includes("Windy")) {
        adviceItems.push("Windy conditions can increase dehydration. Drink regularly even if you don't feel thirsty.");
    }
    
    if (activityLevel === "high") {
        adviceItems.push("For intense activity, sip water regularly rather than drinking large amounts at once.");
        adviceItems.push("Consider a sports drink for activities longer than an hour.");
    }
    
    // Health condition specific advice
    if (healthConditions.includes("heart")) {
        adviceItems.push("Heart conditions may require fluid restrictions. Consult your doctor about appropriate intake.");
    }
    
    if (healthConditions.includes("kidney")) {
        adviceItems.push("Kidney conditions may require fluid restrictions. Follow your doctor's specific guidance.");
    }
    
    // Default advice if no specific conditions
    if (adviceItems.length === 0) {
        adviceItems.push("Drink when thirsty and monitor your urine color. Pale yellow indicates good hydration.");
        adviceItems.push("Include water-rich foods like fruits and vegetables in your diet.");
    }
    
    // Combine all advice
    const advice = adviceItems.join(" ");
    
    return `Aim for about ${liters} liters (${cups} cups) of fluids today. ${advice}`;
}

// New function for health and wellness advice
function getHealthWellnessAdvice(temp, conditions, humidity, airQuality, userPreferences = {}) {
    const advice = [];
    
    // Temperature-related health advice
    if (temp > 30) {
        advice.push("Heat-related illness risk: Stay hydrated, wear light clothing, and avoid prolonged sun exposure.");
    } else if (temp < 0) {
        advice.push("Cold-related health risk: Dress warmly in layers, protect extremities, and limit outdoor time.");
    }
    
    // Humidity-related advice
    if (humidity > 80) {
        advice.push("High humidity: May exacerbate respiratory conditions. Use a dehumidifier if indoors.");
    } else if (humidity < 30) {
        advice.push("Low humidity: Can dry out skin and mucous membranes. Use a humidifier and moisturize regularly.");
    }
    
    // Air quality advice
    if (airQuality >= 4) {
        advice.push("Poor air quality: Limit outdoor activities, especially if you have respiratory conditions.");
    }
    
    // Weather-sensitive condition advice
    const healthConditions = userPreferences.healthConditions || [];
    if (healthConditions.includes("arthritis") && (temp < 10 || humidity > 80)) {
        advice.push("Weather changes may affect joint pain. Consider gentle stretching or warm baths.");
    }
    
    if (healthConditions.includes("asthma") && (airQuality >= 3 || humidity > 70)) {
        advice.push("Respiratory irritants may be elevated. Keep inhaler accessible and avoid outdoor exertion.");
    }
    
    if (healthConditions.includes("migraine") && (humidity > 70 || pressure < 1000)) {
        advice.push("Weather changes may trigger headaches. Stay hydrated and maintain regular sleep patterns.");
    }
    
    // General wellness advice
    if (conditions.includes("Clear")) {
        advice.push("Clear skies are perfect for vitamin D synthesis. Consider 10-15 minutes of sun exposure.");
    }
    
    if (conditions.includes("Rain")) {
        advice.push("Rainy weather can affect mood. Consider indoor exercise or light therapy if you feel down.");
    }
    
    return advice.length > 0 
        ? advice.join(" ") 
        : "Weather conditions are favorable for most activities. Maintain your regular health routine."
}

// New function for travel planning assistance
function getTravelRecommendations(temp, conditions, uvIndex, userPreferences = {}) {
    const recommendations = [];
    
    // Route-specific weather considerations
    const travelPurpose = userPreferences.travelPurpose || "leisure";
    const travelDuration = userPreferences.travelDuration || "day";
    
    if (conditions.includes("Rain") || conditions.includes("Snow")) {
        recommendations.push("Pack appropriate waterproof gear and allow extra time for travel delays.");
    }
    
    if (uvIndex > 6) {
        recommendations.push("High UV levels: Pack sunscreen, sunglasses, and a hat for outdoor activities.");
    }
    
    if (temp > 30) {
        recommendations.push("Hot weather: Travel during cooler parts of the day and stay hydrated during transit.");
    } else if (temp < 0) {
        recommendations.push("Cold weather: Dress in layers and protect electronics from extreme cold.");
    }
    
    // Travel duration specific advice
    if (travelDuration === "week" || travelDuration === "month") {
        recommendations.push("Extended travel: Pack for variable conditions and check long-range forecasts.");
    }
    
    // Purpose-specific recommendations
    if (travelPurpose === "business") {
        recommendations.push("Business travel: Ensure backup plans for important meetings in case of weather disruptions.");
    } else if (travelPurpose === "outdoor") {
        recommendations.push("Outdoor adventure: Check trail conditions and weather forecasts for your specific activities.");
    }
    
    return recommendations.length > 0 
        ? recommendations.join(" ") 
        : "Weather conditions are favorable for travel. Check local forecasts before departure."
}

// New function for agricultural planning tools
function getAgriculturalAdvice(temp, conditions, humidity, userPreferences = {}) {
    const advice = [];
    
    // Crop-specific recommendations
    const crops = userPreferences.crops || ["general"];
    
    if (crops.includes("general") || crops.includes("vegetables")) {
        if (temp > 25 && conditions.includes("Clear")) {
            advice.push("Ideal growing conditions for warm-season vegetables. Ensure adequate watering.");
        } else if (temp < 5) {
            advice.push("Cold temperatures may slow growth. Consider cold frames or greenhouse protection.");
        }
    }
    
    if (crops.includes("fruit") && temp > 15 && temp < 25) {
        advice.push("Optimal fruit development temperatures. Monitor for pests and diseases.");
    }
    
    // Soil moisture considerations
    if (conditions.includes("Rain")) {
        advice.push("Natural irrigation received. Check soil drainage to prevent waterlogging.");
    } else if (humidity < 40) {
        advice.push("Low humidity increases water needs. Irrigate deeply but less frequently.");
    }
    
    // Seasonal planning
    const season = userPreferences.season || "spring";
    if (season === "planting" && temp > 10 && !conditions.includes("Snow")) {
        advice.push("Suitable planting conditions. Work with soil when it's moist but not waterlogged.");
    } else if (season === "harvest" && conditions.includes("Clear")) {
        advice.push("Favorable harvest weather. Plan picking schedule for early morning or evening.");
    }
    
    return advice.length > 0 
        ? advice.join(" ") 
        : "Current conditions are generally favorable for agricultural activities. Monitor local forecasts for changes."
}

// New function for energy consumption optimization
function getEnergyOptimizationAdvice(temp, conditions, userPreferences = {}) {
    const advice = [];
    
    // Heating and cooling optimization
    if (temp > 25) {
        advice.push("Cooling demand high: Set thermostat to 78°F (26°C) and use fans to improve comfort.");
    } else if (temp < 10) {
        advice.push("Heating demand high: Set thermostat to 68°F (20°C) and seal drafts to reduce energy use.");
    }
    
    // Natural lighting optimization
    if (conditions.includes("Clear")) {
        advice.push("Take advantage of natural light to reduce electric lighting needs during daytime.");
    } else if (conditions.includes("Clouds") || conditions.includes("Rain")) {
        advice.push("Limited natural light: Consider full-spectrum bulbs for better indoor illumination.");
    }
    
    // Renewable energy considerations
    if (conditions.includes("Clear") && userPreferences.hasSolar) {
        advice.push("Optimal solar energy generation conditions. Monitor battery storage levels.");
    }
    
    if (conditions.includes("Windy") && userPreferences.hasWind) {
        advice.push("Wind energy generation favorable. Check turbine performance and battery charging status.");
    }
    
    // Appliance usage timing
    if (temp > 30) {
        advice.push("Run heat-generating appliances (oven, dryer) during cooler evening hours to reduce cooling load.");
    } else if (temp < 0) {
        advice.push("Run energy-intensive appliances during peak heating hours to utilize waste heat.");
    }
    
    return advice.length > 0 
        ? advice.join(" ") 
        : "Energy consumption patterns are typical for current weather conditions. No special adjustments needed."
}

// Export functions for use in other scripts
export { 
    getHealthWellnessRecommendation, 
    getActivityRecommendation, 
    getUVRecommendation,
    getFoodRecommendation,
    getWaterRecommendation,
    getHealthWellnessAdvice,
    getTravelRecommendations,
    getAgriculturalAdvice,
    getEnergyOptimizationAdvice
}