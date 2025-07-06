import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Get user's location and fetch weather data
  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please search for a city.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon, cityName = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = cityName 
        ? `${API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(cityName)}`
        : `${API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    setSearchLoading(true);
    try {
      // For city search, we pass dummy coordinates and let the backend handle geocoding
      await fetchWeather(0, 0, city.trim());
    } catch (err) {
      setError('City not found. Please try another city.');
    } finally {
      setSearchLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-800 font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium mb-6">{error}</p>
          <button 
            onClick={getCurrentLocationWeather}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-200 relative overflow-hidden">
      {/* Cherry Blossom Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522748906645-95d8adfd52c7')`
        }}
      ></div>
      
      {/* Floating Cherry Blossoms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-pink-300 opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-800 mb-2">
            🌸 Sakura Weather
          </h1>
          <p className="text-pink-600 text-lg font-medium">
            Beautiful weather, beautiful moments
          </p>
        </div>

        {/* City Search */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleCitySearch} className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search for a city..."
              className="w-full px-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              disabled={searchLoading}
            />
            <button
              type="submit"
              disabled={searchLoading || !city.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              {searchLoading ? '...' : '🔍'}
            </button>
          </form>
        </div>

        {weather && (
          <div className="max-w-4xl mx-auto">
            {/* Current Weather - 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Main Temperature */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-200">
                <div className="text-center">
                  <div className="text-6xl mb-2">{weather.current.icon}</div>
                  <div className="text-5xl font-bold text-pink-800 mb-2">
                    {Math.round(weather.current.temperature)}°C
                  </div>
                  <div className="text-pink-600 font-medium mb-1">
                    {weather.current.description}
                  </div>
                  <div className="text-sm text-pink-500">
                    📍 {weather.location}
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-800 mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-medium">💧 Humidity</span>
                    <span className="text-pink-800 font-semibold">{weather.current.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-medium">🌬️ Wind Speed</span>
                    <span className="text-pink-800 font-semibold">{weather.current.wind_speed} km/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-medium">🌡️ Feels Like</span>
                    <span className="text-pink-800 font-semibold">{Math.round(weather.current.temperature)}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-200">
              <h3 className="text-xl font-bold text-pink-800 mb-4">5-Day Forecast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 bg-pink-50 rounded-xl">
                    <div className="text-sm font-medium text-pink-600 mb-2">
                      {formatDate(day.date)}
                    </div>
                    <div className="text-3xl mb-2">{day.icon}</div>
                    <div className="text-sm text-pink-700 mb-2">
                      {day.description}
                    </div>
                    <div className="text-sm font-semibold text-pink-800">
                      {Math.round(day.temperature_max)}° / {Math.round(day.temperature_min)}°
                    </div>
                    <div className="text-xs text-pink-500 mt-1">
                      🌬️ {day.wind_speed} km/h
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;