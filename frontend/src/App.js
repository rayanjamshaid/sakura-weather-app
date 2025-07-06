import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Cache management
  const CACHE_KEY = 'weather_data';
  const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  // Get cached data
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedData = JSON.parse(cached);
        const now = new Date().getTime();
        if (now - parsedData.timestamp < CACHE_DURATION) {
          return parsedData.data;
        }
      }
    } catch (error) {
      console.error('Error reading cached data:', error);
    }
    return null;
  };

  // Set cached data
  const setCachedData = (data) => {
    try {
      const cacheData = {
        timestamp: new Date().getTime(),
        data: data
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  // Get user's location and fetch weather data
  useEffect(() => {
    const cachedWeather = getCachedData();
    if (cachedWeather) {
      setWeather(cachedWeather);
      setLoading(false);
      return;
    }
    
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
          // Fallback to default location (Tokyo) to show weather data
          setError('Unable to get your location. Showing weather for Tokyo as default.');
          fetchWeather(35.6762, 139.6503); // Tokyo coordinates
        }
      );
    } else {
      setError('Geolocation is not supported by this browser. Showing weather for Tokyo as default.');
      fetchWeather(35.6762, 139.6503); // Tokyo coordinates
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWeather(data);
      setCachedData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
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

  // Get weather-based background animation
  const getWeatherAnimation = (weatherCode) => {
    if ([0, 1].includes(weatherCode)) {
      return 'sunny-bg';
    } else if ([2, 3].includes(weatherCode)) {
      return 'cloudy-bg';
    } else if ([45, 48].includes(weatherCode)) {
      return 'foggy-bg';
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      return 'rainy-bg';
    } else if ([71, 73, 75].includes(weatherCode)) {
      return 'snowy-bg';
    } else if ([95, 96, 99].includes(weatherCode)) {
      return 'stormy-bg';
    }
    return 'default-bg';
  };

  const refreshWeather = () => {
    localStorage.removeItem(CACHE_KEY);
    getCurrentLocationWeather();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-800 font-medium text-sm sm:text-base">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center px-4">
        <div className="text-center bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium mb-6 text-sm sm:text-base">{error}</p>
          <button 
            onClick={getCurrentLocationWeather}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-100 to-rose-200 relative overflow-hidden ${weather ? getWeatherAnimation(weather.current.weather_code) : ''}`}>
      {/* Cherry Blossom Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522748906645-95d8adfd52c7')`
        }}
      ></div>
      
      {/* Weather-based Background Animations */}
      <div className="weather-animation-layer absolute inset-0 pointer-events-none">
        {weather && (
          <>
            {/* Sunny Animation */}
            {[0, 1].includes(weather.current.weather_code) && (
              <div className="sun-animation">
                <div className="sun"></div>
                <div className="sun-rays"></div>
              </div>
            )}
            
            {/* Cloudy Animation */}
            {[2, 3].includes(weather.current.weather_code) && (
              <div className="cloud-animation">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`cloud cloud-${i + 1}`}>☁️</div>
                ))}
              </div>
            )}
            
            {/* Rainy Animation */}
            {[51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weather.current.weather_code) && (
              <div className="rain-animation">
                {[...Array(50)].map((_, i) => (
                  <div key={i} className="raindrop" style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                  }}>💧</div>
                ))}
              </div>
            )}
            
            {/* Snowy Animation */}
            {[71, 73, 75].includes(weather.current.weather_code) && (
              <div className="snow-animation">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="snowflake" style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}>❄️</div>
                ))}
              </div>
            )}
            
            {/* Stormy Animation */}
            {[95, 96, 99].includes(weather.current.weather_code) && (
              <div className="storm-animation">
                <div className="lightning"></div>
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="storm-rain" style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1}s`
                  }}>⚡</div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Cherry Blossoms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-pink-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              fontSize: window.innerWidth < 768 ? '1rem' : '1.5rem'
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-800 mb-2">
            🌸 Sakura Weather
          </h1>
          <p className="text-pink-600 text-base sm:text-lg font-medium">
            Beautiful weather, beautiful moments
          </p>
        </div>

        {weather && (
          <div className="max-w-4xl mx-auto">
            {/* Current Weather - Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Main Temperature */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-200 weather-card">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl mb-2">{weather.current.icon}</div>
                  <div className="text-3xl sm:text-5xl font-bold text-pink-800 mb-2">
                    {Math.round(weather.current.temperature)}°C
                  </div>
                  <div className="text-pink-600 font-medium mb-1 text-sm sm:text-base">
                    {weather.current.description}
                  </div>
                  <div className="text-xs sm:text-sm text-pink-500">
                    📍 {weather.location}
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-200 weather-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-pink-800">Details</h3>
                  <button 
                    onClick={refreshWeather}
                    className="text-pink-600 hover:text-pink-800 transition-colors text-sm"
                    title="Refresh weather data"
                  >
                    🔄
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-medium text-sm sm:text-base">💧 Humidity</span>
                    <span className="text-pink-800 font-semibold text-sm sm:text-base">{weather.current.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-medium text-sm sm:text-base">🌬️ Wind Speed</span>
                    <span className="text-pink-800 font-semibold text-sm sm:text-base">{weather.current.wind_speed} km/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-medium text-sm sm:text-base">🌡️ Feels Like</span>
                    <span className="text-pink-800 font-semibold text-sm sm:text-base">{Math.round(weather.current.temperature)}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-200 weather-card">
              <h3 className="text-lg sm:text-xl font-bold text-pink-800 mb-4">5-Day Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center p-3 sm:p-4 bg-pink-50 rounded-xl">
                    <div className="text-xs sm:text-sm font-medium text-pink-600 mb-2">
                      {formatDate(day.date)}
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2">{day.icon}</div>
                    <div className="text-xs sm:text-sm text-pink-700 mb-2 hidden sm:block">
                      {day.description}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-pink-800">
                      {Math.round(day.temperature_max)}° / {Math.round(day.temperature_min)}°
                    </div>
                    <div className="text-xs text-pink-500 mt-1 hidden sm:block">
                      🌬️ {day.wind_speed} km/h
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cache Info */}
            <div className="text-center mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm text-pink-500">
                Data cached for 6 hours • Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;