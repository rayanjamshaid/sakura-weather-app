# 🌸 Sakura Weather App

A beautiful cherry blossom-themed weather application that displays current weather conditions and forecasts with stunning anime-style animations. Built with React frontend and FastAPI backend.

![Sakura Weather App](https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&h=400&fit=crop)

## ✨ Features

### 🌤️ **Weather Display**
- **Current Weather**: Real-time temperature, humidity, wind speed, and weather conditions
- **5-Day Forecast**: Detailed weather forecast with temperature ranges and conditions
- **Location-Based**: Automatically detects your location or falls back to Tokyo
- **6-Hour Caching**: Intelligent caching system to reduce API calls

### 🎨 **Visual Features**
- **Cherry Blossom Theme**: Beautiful soft pink gradient with floating cherry blossoms
- **Weather-Based Animations**: Dynamic backgrounds and animations based on current weather:
  - ☀️ **Sunny**: Golden background with animated sun and rotating rays
  - ☁️ **Cloudy**: Gray background with floating clouds
  - 🌧️ **Rainy**: Blue background with animated falling raindrops
  - ❄️ **Snowy**: White background with falling snowflakes
  - ⛈️ **Stormy**: Dark background with lightning effects
- **Anime-Style Aesthetics**: Beautiful Japanese-inspired design elements

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layout**: 2x2 grid on desktop, stacked layout on mobile
- **Touch-Friendly**: Accessible buttons and touch targets
- **Cross-Device**: Works perfectly on desktop, tablet, and mobile

## 📸 Screenshots

### Desktop View
![Desktop View](https://raw.githubusercontent.com/your-username/sakura-weather-app/main/screenshots/desktop.png)
*Desktop view showing the 2x2 grid layout with sunny weather animation*

### Mobile View
![Mobile View](https://raw.githubusercontent.com/your-username/sakura-weather-app/main/screenshots/mobile.png)
*Mobile view with responsive stacked layout*

## 🛠️ Tech Stack

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **JavaScript ES6+**: Modern JavaScript features
- **HTML5 Geolocation API**: For location detection

### Backend
- **FastAPI**: High-performance Python web framework
- **Python 3.8+**: Backend programming language
- **httpx**: Async HTTP client for API calls
- **Uvicorn**: ASGI server for FastAPI

### Database
- **MongoDB**: NoSQL database for data storage
- **Local Storage**: Browser storage for caching weather data

## 🌐 API Sources

### Weather Data
- **Primary API**: [Open-Meteo API](https://open-meteo.com/)
  - Free weather API with no authentication required
  - Provides current weather and forecast data
  - Includes geocoding for city name to coordinates conversion
  - Endpoint: `https://api.open-meteo.com/v1/forecast`

### Image Sources
- **Background Image**: [Unsplash](https://unsplash.com/)
  - Cherry blossom image by photographer
  - URL: `https://images.unsplash.com/photo-1522748906645-95d8adfd52c7`
  - License: Free to use under Unsplash License

## 📁 Project Structure

```
sakura-weather-app/
├── 📂 backend/                 # FastAPI backend
│   ├── 📄 server.py           # Main FastAPI application
│   ├── 📄 requirements.txt    # Python dependencies
│   └── 📄 .env               # Environment variables
├── 📂 frontend/               # React frontend
│   ├── 📂 public/            # Static assets
│   ├── 📂 src/               # React source code
│   │   ├── 📄 App.js         # Main React component
│   │   ├── 📄 App.css        # Styling and animations
│   │   ├── 📄 index.js       # React entry point
│   │   └── 📄 index.css      # Global styles
│   ├── 📄 package.json       # Node.js dependencies
│   ├── 📄 tailwind.config.js # Tailwind CSS configuration
│   ├── 📄 postcss.config.js  # PostCSS configuration
│   └── 📄 .env              # Environment variables
├── 📂 tests/                 # Test files
├── 📂 scripts/               # Utility scripts
├── 📄 README.md              # This file
└── 📄 test_result.md         # Testing documentation
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (for database)
- **Git** (for cloning)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sakura-weather-app.git
cd sakura-weather-app
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env file with your MongoDB connection string
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install
# or using yarn
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env file with your backend URL
```

### 4. Environment Variables

#### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017/weather_app
```

#### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
python server.py
```
The backend will run on `http://localhost:8001`

#### Start Frontend Server
```bash
cd frontend
npm start
# or
yarn start
```
The frontend will run on `http://localhost:3000`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Deploy
- Backend: Deploy FastAPI app to your preferred hosting service
- Frontend: Deploy built files to static hosting service
- Database: Set up MongoDB instance

## 🎯 How It Works

### 1. **Location Detection**
- App attempts to get user's current location using HTML5 Geolocation API
- If location access is denied, falls back to Tokyo coordinates
- Coordinates are sent to backend for weather data retrieval

### 2. **Weather Data Fetching**
- Backend receives coordinates and makes API call to Open-Meteo
- Weather data includes current conditions and 5-day forecast
- Data is processed and formatted before sending to frontend

### 3. **Caching System**
- Weather data is cached in browser's localStorage
- Cache expires after 6 hours to balance freshness and API usage
- Manual refresh button allows users to update data immediately

### 4. **Dynamic Animations**
- Weather condition codes determine which animation to display
- CSS animations create smooth, beautiful effects
- Responsive design ensures animations work on all devices

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Browser Support

- **Chrome**: ✅ Fully supported
- **Firefox**: ✅ Fully supported
- **Safari**: ✅ Fully supported
- **Edge**: ✅ Fully supported
- **Mobile Browsers**: ✅ Fully supported

## 🔧 Configuration

### Weather Data Customization
- Modify `server.py` to change default fallback location
- Update weather code mappings in backend for different icons
- Adjust cache duration in `App.js` (CACHE_DURATION constant)

### Animation Customization
- Edit `App.css` to modify animation speeds and styles
- Add new weather conditions in `getWeatherAnimation()` function
- Customize cherry blossom colors and floating patterns

## 📊 Performance Features

- **Lazy Loading**: Components load only when needed
- **Efficient Caching**: Reduces API calls with smart caching
- **Optimized Images**: Images are optimized for web delivery
- **Responsive Assets**: Different image sizes for different devices

## 🛡️ Security Features

- **No API Keys Required**: Uses free Open-Meteo API
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: All inputs are validated on backend
- **Error Handling**: Graceful error handling throughout the app

## 🌟 Future Enhancements

- [ ] **Weather Alerts**: Push notifications for severe weather
- [ ] **Multiple Locations**: Save and switch between locations
- [ ] **Themes**: Additional color themes beyond cherry blossom
- [ ] **Historical Data**: View past weather data
- [ ] **Weather Map**: Interactive weather map integration
- [ ] **Social Sharing**: Share weather conditions on social media

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open-Meteo**: For providing free weather API
- **Unsplash**: For beautiful cherry blossom images
- **Tailwind CSS**: For utility-first CSS framework
- **React**: For the amazing frontend framework
- **FastAPI**: For the high-performance backend framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/sakura-weather-app/issues) page
2. Create a new issue if your problem isn't listed
3. Provide detailed information about the issue
4. Include screenshots if applicable

## 🎨 Design Philosophy

The Sakura Weather App embodies the Japanese aesthetic of finding beauty in simplicity and natural elements. The cherry blossom theme represents the fleeting beauty of nature, while the weather animations bring the data to life with gentle, anime-inspired movements.

---

**Made with 🌸 and ❤️ by Rayan Jamshaid (vibe coding and wasting my 6 hours)**

*"Beautiful weather, beautiful moments"* 
