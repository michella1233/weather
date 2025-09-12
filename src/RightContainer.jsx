import './RightContainer.css'
import position from './assets/position.png'
import search from './assets/search.png'
import veryPoor from './assets/very-poor.png'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'
import { fetchWeatherApi } from 'openmeteo';
import { calculateAQI } from './calculateAqi';
import { airCondition } from './exportCondition'


export function RightContainer({ coordinates, setCoordinates, selectedPlace, setSelectedPlace }) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    const fetchAirQuality = async () => {
      const params = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        current: ["pm10", "pm2_5"],
        "forecast_days": 1,
      };
      const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];
      const current = response.current();
      const weatherData = {
        current: {
          pm10: current.variables(0).value(),
          pm2_5: current.variables(1).value(),
        },
      };

      setAqi(calculateAQI(weatherData.current.pm2_5, weatherData.current.pm10));

      console.log(
        `\nCurrent pm10: ${weatherData.current.pm10}`,
        `\nCurrent pm2_5: ${weatherData.current.pm2_5}`,
      );
      console.log(calculateAQI(weatherData.current.pm2_5, weatherData.current.pm10))
    };

    fetchAirQuality(); // call the async function
  }, [coordinates]);



  function handleSelectSuggestion(suggestion) {
    setCoordinates({
      longitude: suggestion.longitude,
      latitude: suggestion.latitude,
    });
    setSelectedPlace(suggestion);
    setQuery(`${suggestion.city}, ${suggestion.country}`);
    setSuggestions([]); // clear dropdown
    setShowSearch(false)
  }

  const apiKeyAutoCompletion = import.meta.env.VITE_MAPBOX_TOKEN;

  async function searchCity(q) {
    const url = "https://api.mapbox.com/search/geocode/v6/forward";

    try {
      const response = await axios.get(url, {
        params: {
          q,
          access_token: apiKeyAutoCompletion,
          autocomplete: true,
          limit: 10,
          types: "place,country"
        }
      });

      return response.data.features.map(f => ({
        city: f.properties?.name, // ✅ city name
        country: f.properties?.context?.country?.name, // ✅ country name
        full: f.properties?.place_formatted, // ✅ "Jakarta, Indonesia"
        longitude: f.geometry?.coordinates[0], // ✅
        latitude: f.geometry?.coordinates[1]
      }));
    } catch (error) {
      console.error("Error fetching from Mapbox:", error.response?.data || error.message);
      return [];
    }
  }

  async function handleChange(event) {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const results = await searchCity(value);
    setSuggestions(results);
  }


  return (
    <div className="right-container">
      <div className={showSearch ? "right-header-show-search" : 'right-header'}>
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.div
              key="search-container"  // ✅ branch 1
              className="input-suggestion-cont"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <input
                value={query}
                onChange={handleChange}
                type="text"
                placeholder=" Search a city..."
                className="search-input"
                style={{
                  transformOrigin: "left center",
                  width: "72%",
                }}
              />
              <div className='suggestion-dropdown'>
                {query && suggestions.length > 0 ? (
                  suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onClick={() => handleSelectSuggestion(s)}
                    >
                      {s.city}, {s.country}
                    </div>
                  ))
                ) : ""}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="location"
              className="location"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img className="position" src={position} />
              <span className='position-city'>
                {selectedPlace
                  ? `${selectedPlace.city}, ${selectedPlace.country}`
                  : "Jakarta, Indonesia"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button className='search-button'
          onClick={() => setShowSearch(!showSearch)}
        ><img src={search} /></button>
      </div>

      <div className='right-hours'>
        <div className='clock-card-container'>
          <span className='sunrise-sunset-span'>Sunrise</span>
          <div className="clock-card">
            <div className="clock">
              <div className="hand hour"></div>
              <div className="hand minute"></div>
            </div>
            <p className="time">5:45 AM</p>
            <p className="label">6:00 AM</p>
          </div>
        </div>

        <div className='clock-card-container'>
          <span className='golden-hour-span'>Golden Hour</span>
          <div className="clock-card clock-card2">
            <div className="clock">
              <div className="hand hour"></div>
              <div className="hand minute"></div>
            </div>
            <p className="time">6:38 PM</p>
            <p className="label">6:52 PM</p>
          </div>
        </div>

        <div className='clock-card-container'>
          <span className='sunrise-sunset-span'>Sunset</span>
          <div className="clock-card">
            <div className="clock">
              <div className="hand hour"></div>
              <div className="hand minute"></div>
            </div>
            <p className="time">7:10 PM</p>
            <p className="label">7:15 PM</p>
          </div>
        </div>
      </div>

      <div className='status-cards'>
        <div className='status-container'>
          <p>Air Quality</p>
          <div className='img-container'>
            <img src={veryPoor} />
            <span className='rating'>{aqi}/5</span>
            <span className='status'>{aqi !== null ? airCondition[aqi] : "Loading..."}</span>
          </div>
        </div>
        <div className='status-container'>
          <p>Uv Index</p>
          <div className='img-container'>
            <img src={veryPoor} />
            <span className='rating'>11/15</span>
            <span className='status'>Extreme</span>
          </div>
        </div>
      </div>
    </div>
  )
}