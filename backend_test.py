#!/usr/bin/env python3
import unittest
import requests
import json
import os
from typing import Dict, Any, Optional

# Get the backend URL from the frontend .env file
def get_backend_url() -> str:
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1].strip('"\'')
    raise ValueError("Could not find REACT_APP_BACKEND_URL in frontend/.env")

BACKEND_URL = get_backend_url()
API_BASE_URL = f"{BACKEND_URL}/api"

class WeatherAPITest(unittest.TestCase):
    """Test cases for the Weather API backend"""

    def test_health_check(self):
        """Test the /api/health endpoint to ensure the server is running"""
        response = requests.get(f"{API_BASE_URL}/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "weather-api")
        print("✅ Health check endpoint is working")

    def test_weather_by_coordinates(self):
        """Test /api/weather with sample coordinates (New York)"""
        # New York coordinates
        lat = 40.7128
        lon = -74.0060
        
        response = requests.get(f"{API_BASE_URL}/weather", params={"lat": lat, "lon": lon})
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self._validate_weather_response(data)
        print(f"✅ Weather by coordinates endpoint is working (location: {data['location']})")

    def test_weather_by_city(self):
        """Test /api/weather with a city parameter (Tokyo)"""
        city = "Tokyo"
        
        response = requests.get(f"{API_BASE_URL}/weather", params={"lat": 0, "lon": 0, "city": city})
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self._validate_weather_response(data)
        self.assertIn("Tokyo", data["location"], f"Expected Tokyo in location name, got: {data['location']}")
        print(f"✅ Weather by city endpoint is working (location: {data['location']})")

    def test_invalid_city(self):
        """Test with invalid city name to ensure proper error response"""
        invalid_city = "NonExistentCityXYZ123"
        
        response = requests.get(f"{API_BASE_URL}/weather", params={"lat": 0, "lon": 0, "city": invalid_city})
        self.assertEqual(response.status_code, 404)
        
        data = response.json()
        self.assertIn("detail", data)
        self.assertEqual(data["detail"], "City not found")
        print("✅ Invalid city error handling is working")

    def _validate_weather_response(self, data: Dict[str, Any]):
        """Helper method to validate the structure of weather response"""
        # Check top-level fields
        self.assertIn("location", data)
        self.assertIn("current", data)
        self.assertIn("forecast", data)
        
        # Check current weather fields
        current = data["current"]
        self.assertIn("temperature", current)
        self.assertIn("humidity", current)
        self.assertIn("wind_speed", current)
        self.assertIn("weather_code", current)
        self.assertIn("description", current)
        self.assertIn("icon", current)
        
        # Check forecast array
        forecast = data["forecast"]
        self.assertIsInstance(forecast, list)
        self.assertGreaterEqual(len(forecast), 1)  # Should have at least one day
        
        # Check first forecast day structure
        if forecast:
            first_day = forecast[0]
            self.assertIn("date", first_day)
            self.assertIn("weather_code", first_day)
            self.assertIn("description", first_day)
            self.assertIn("icon", first_day)
            self.assertIn("temperature_max", first_day)
            self.assertIn("temperature_min", first_day)
            self.assertIn("wind_speed", first_day)

if __name__ == "__main__":
    print(f"Testing Weather API at: {API_BASE_URL}")
    unittest.main(verbosity=2)