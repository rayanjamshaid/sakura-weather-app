from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from typing import Optional
import json

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Geocoding service to convert city names to coordinates
async def get_coordinates(city_name: str):
    """Get coordinates for a city name using Open-Meteo geocoding API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://geocoding-api.open-meteo.com/v1/search",
                params={"name": city_name, "count": 1, "language": "en", "format": "json"}
            )
            data = response.json()
            if data.get("results") and len(data["results"]) > 0:
                result = data["results"][0]
                return {
                    "latitude": result["latitude"],
                    "longitude": result["longitude"],
                    "name": result["name"],
                    "country": result.get("country", "")
                }
            else:
                return None
    except Exception as e:
        print(f"Error getting coordinates: {e}")
        return None

@app.get("/api/weather")
async def get_weather(lat: float, lon: float, city: Optional[str] = None):
    """Get current weather and 5-day forecast from Open-Meteo API"""
    try:
        # If city is provided, get coordinates for that city
        location_name = "Current Location"
        if city:
            coordinates = await get_coordinates(city)
            if coordinates:
                lat = coordinates["latitude"]
                lon = coordinates["longitude"]
                location_name = f"{coordinates['name']}, {coordinates['country']}"
            else:
                raise HTTPException(status_code=404, detail="City not found")

        # Get weather data from Open-Meteo API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": [
                        "temperature_2m",
                        "relative_humidity_2m",
                        "wind_speed_10m",
                        "weather_code"
                    ],
                    "daily": [
                        "weather_code",
                        "temperature_2m_max",
                        "temperature_2m_min",
                        "wind_speed_10m_max"
                    ],
                    "timezone": "auto",
                    "forecast_days": 5
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to fetch weather data")
            
            data = response.json()
            
            # Weather code mapping
            weather_codes = {
                0: {"description": "Clear sky", "icon": "☀️"},
                1: {"description": "Mainly clear", "icon": "🌤️"},
                2: {"description": "Partly cloudy", "icon": "⛅"},
                3: {"description": "Overcast", "icon": "☁️"},
                45: {"description": "Foggy", "icon": "🌫️"},
                48: {"description": "Depositing rime fog", "icon": "🌫️"},
                51: {"description": "Light drizzle", "icon": "🌦️"},
                53: {"description": "Moderate drizzle", "icon": "🌦️"},
                55: {"description": "Dense drizzle", "icon": "🌦️"},
                61: {"description": "Slight rain", "icon": "🌧️"},
                63: {"description": "Moderate rain", "icon": "🌧️"},
                65: {"description": "Heavy rain", "icon": "🌧️"},
                71: {"description": "Slight snow", "icon": "🌨️"},
                73: {"description": "Moderate snow", "icon": "❄️"},
                75: {"description": "Heavy snow", "icon": "❄️"},
                80: {"description": "Slight rain showers", "icon": "🌦️"},
                81: {"description": "Moderate rain showers", "icon": "🌧️"},
                82: {"description": "Violent rain showers", "icon": "⛈️"},
                95: {"description": "Thunderstorm", "icon": "⛈️"},
                96: {"description": "Thunderstorm with hail", "icon": "⛈️"},
                99: {"description": "Thunderstorm with heavy hail", "icon": "⛈️"}
            }
            
            # Process current weather
            current = data.get("current", {})
            current_weather_code = current.get("weather_code", 0)
            current_weather = weather_codes.get(current_weather_code, {"description": "Unknown", "icon": "❓"})
            
            # Process daily forecast
            daily = data.get("daily", {})
            forecast = []
            
            if daily.get("time") and daily.get("weather_code"):
                for i in range(min(5, len(daily["time"]))):
                    weather_code = daily["weather_code"][i]
                    weather_info = weather_codes.get(weather_code, {"description": "Unknown", "icon": "❓"})
                    
                    forecast.append({
                        "date": daily["time"][i],
                        "weather_code": weather_code,
                        "description": weather_info["description"],
                        "icon": weather_info["icon"],
                        "temperature_max": daily["temperature_2m_max"][i],
                        "temperature_min": daily["temperature_2m_min"][i],
                        "wind_speed": daily["wind_speed_10m_max"][i]
                    })
            
            return {
                "location": location_name,
                "current": {
                    "temperature": current.get("temperature_2m"),
                    "humidity": current.get("relative_humidity_2m"),
                    "wind_speed": current.get("wind_speed_10m"),
                    "weather_code": current_weather_code,
                    "description": current_weather["description"],
                    "icon": current_weather["icon"]
                },
                "forecast": forecast
            }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching weather: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "weather-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)