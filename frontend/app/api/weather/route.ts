// ============================================================
// KisanMitra AI - Weather API Route
// ============================================================

import { NextResponse } from "next/server";

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY || "";

// Indian districts with coordinates
const DISTRICT_COORDS: Record<string, { lat: number; lon: number; state: string }> = {
  pune: { lat: 18.5204, lon: 73.8567, state: "Maharashtra" },
  nashik: { lat: 19.9975, lon: 73.7898, state: "Maharashtra" },
  nagpur: { lat: 21.1458, lon: 79.0882, state: "Maharashtra" },
  kolhapur: { lat: 16.7041, lon: 74.2433, state: "Maharashtra" },
  aurangabad: { lat: 19.8762, lon: 75.3433, state: "Maharashtra" },
  solapur: { lat: 17.6599, lon: 74.006, state: "Maharashtra" },
  jalgaon: { lat: 21.0076, lon: 75.5626, state: "Maharashtra" },
  latur: { lat: 18.4052, lon: 76.5679, state: "Maharashtra" },
  ahmednagar: { lat: 19.0946, lon: 74.748, state: "Maharashtra" },
  mumbai: { lat: 19.076, lon: 72.8777, state: "Maharashtra" },
  delhi: { lat: 28.6139, lon: 77.209, state: "Delhi" },
  lucknow: { lat: 26.8467, lon: 80.9462, state: "Uttar Pradesh" },
  kanpur: { lat: 26.4499, lon: 80.3319, state: "Uttar Pradesh" },
  varanasi: { lat: 25.3176, lon: 82.9739, state: "Uttar Pradesh" },
  patna: { lat: 25.5941, lon: 85.1376, state: "Bihar" },
  bhopal: { lat: 23.2599, lon: 77.4126, state: "Madhya Pradesh" },
  indore: { lat: 22.7196, lon: 75.8577, state: "Madhya Pradesh" },
  jaipur: { lat: 26.9124, lon: 75.7873, state: "Rajasthan" },
  ahmedabad: { lat: 23.0225, lon: 72.5714, state: "Gujarat" },
  surat: { lat: 21.1702, lon: 72.8311, state: "Gujarat" },
  rajkot: { lat: 22.3039, lon: 70.8022, state: "Gujarat" },
  vadodara: { lat: 22.3072, lon: 73.1812, state: "Gujarat" },
  ludhiana: { lat: 30.901, lon: 75.8573, state: "Punjab" },
  amritsar: { lat: 31.634, lon: 74.8723, state: "Punjab" },
  chandigarh: { lat: 30.7333, lon: 76.7794, state: "Chandigarh" },
  bangalore: { lat: 12.9716, lon: 77.5946, state: "Karnataka" },
  mysore: { lat: 12.2958, lon: 76.6394, state: "Karnataka" },
  hyderabad: { lat: 17.385, lon: 78.4867, state: "Telangana" },
  visakhapatnam: { lat: 17.6868, lon: 83.2185, state: "Andhra Pradesh" },
  chennai: { lat: 13.0827, lon: 80.2707, state: "Tamil Nadu" },
  coimbatore: { lat: 11.0168, lon: 76.9558, state: "Tamil Nadu" },
};

// Disease risk calculation
function calculateDiseaseRisk(temp: number, humidity: number, rainfall: number, weatherType: string): string {
  if (humidity > 80 && rainfall > 5) return "HIGH - Fungal diseases likely";
  if (humidity > 70 && temp > 25) return "MEDIUM - Monitor crops closely";
  if (weatherType.includes("Rain") || weatherType.includes("Thunderstorm")) return "MEDIUM - Postpone pesticide";
  return "LOW - Conditions favorable";
}

function getWeatherRecommendation(temp: number, humidity: number, rainfall: number, weatherType: string): string {
  const recommendations: string[] = [];

  if (rainfall > 10) {
    recommendations.push("Delay irrigation for 2-3 days");
  } else if (rainfall < 2 && humidity < 50) {
    recommendations.push("Irrigate crops in early morning");
  }

  if (temp > 35) {
    recommendations.push("Provide shade to sensitive crops");
    recommendations.push("Increase watering frequency");
  } else if (temp < 15) {
    recommendations.push("Protect frost-sensitive crops");
  }

  if (humidity > 80) {
    recommendations.push("Watch for fungal diseases");
    recommendations.push("Ensure good air circulation");
  }

  if (recommendations.length === 0) {
    recommendations.push("Weather conditions are favorable for farming");
  }

  return recommendations.join(". ") + ".";
}

// Mock weather data for offline/demo mode
function getMockWeather(district: string, state: string) {
  const districtLower = district.toLowerCase();
  const coords = DISTRICT_COORDS[districtLower] || { lat: 18.5, lon: 74, state: "Maharashtra" };

  const mockWeathers = [
    { temp: 28, humidity: 65, rainfall: 2.5, weatherType: "Partly Cloudy", icon: "⛅" },
    { temp: 31, humidity: 55, rainfall: 0, weatherType: "Sunny", icon: "☀️" },
    { temp: 26, humidity: 75, rainfall: 8, weatherType: "Light Rain", icon: "🌦️" },
    { temp: 24, humidity: 85, rainfall: 15, weatherType: "Heavy Rain", icon: "🌧️" },
    { temp: 30, humidity: 60, rainfall: 0, weatherType: "Clear", icon: "🌤️" },
  ];

  const dayIndex = new Date().getDate() % mockWeathers.length;
  const weather = mockWeathers[dayIndex];

  return {
    district,
    state: state || coords.state,
    date: new Date().toISOString().split("T")[0],
    temperature: weather.temp,
    humidity: weather.humidity,
    rainfall: weather.rainfall,
    wind_speed: 12 + Math.random() * 8,
    weather_type: weather.weatherType,
    icon: weather.icon,
    disease_risk: calculateDiseaseRisk(weather.temp, weather.humidity, weather.rainfall, weather.weatherType),
    recommendation: getWeatherRecommendation(weather.temp, weather.humidity, weather.rainfall, weather.weatherType),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district") || "Pune";
  const state = searchParams.get("state") || "Maharashtra";

  // Try real API first
  if (OPENWEATHERMAP_API_KEY) {
    const districtLower = district.toLowerCase();
    const coords = DISTRICT_COORDS[districtLower];

    if (coords) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
        );

        if (response.ok) {
          const data = await response.json();

          return NextResponse.json({
            district,
            state: state || coords.state,
            date: new Date().toISOString().split("T")[0],
            temperature: data.main.temp,
            humidity: data.main.humidity,
            rainfall: data.rain?.["1h"] || data.rain?.["3h"] || 0,
            wind_speed: data.wind.speed,
            weather_type: data.weather[0].main,
            icon: data.weather[0].main.includes("Cloud") ? "⛅" : data.weather[0].main.includes("Rain") ? "🌧️" : data.weather[0].main.includes("Clear") ? "☀️" : "🌤️",
            disease_risk: calculateDiseaseRisk(
              data.main.temp,
              data.main.humidity,
              data.rain?.["1h"] || 0,
              data.weather[0].main
            ),
            recommendation: getWeatherRecommendation(
              data.main.temp,
              data.main.humidity,
              data.rain?.["1h"] || 0,
              data.weather[0].main
            ),
            source: "openweathermap",
          });
        }
      } catch (error) {
        console.log("Weather API error:", error);
      }
    }
  }

  // Fallback to mock data
  const mockWeather = getMockWeather(district, state);
  return NextResponse.json({
    ...mockWeather,
    source: "mock_data",
    note: "Free demo mode - set OPENWEATHERMAP_API_KEY for real data",
  });
}
