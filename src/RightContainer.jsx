import './RightContainer.css'
import position from './assets/position.png'
import search from './assets/search.png'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'
import { fetchWeatherApi } from 'openmeteo';
import { calculateAQI } from './calculateAqi';
import { airCondition } from './calculateAqi';
import { uvCategory } from './calculateAqi';

import Fair from './assets/air-condition/Fair.png';
import Good from './assets/air-condition/Good.png';
import Moderate from './assets/air-condition/Moderate.png';
import Poor from './assets/air-condition/Poor.png';
import veryPoor from './assets/air-condition/very-poor.png';


export function RightContainer({ coordinates, setCoordinates, selectedPlace, setSelectedPlace, uvIndex, sunTimes, setSunTimes }) {
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
    };

    fetchAirQuality();
  }, [coordinates]);

useEffect(() => {
  (async () => {
    const lat = coordinates.latitude;
    const lng = coordinates.longitude;
    const res = await fetch(
      `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}`
    );
    const data = await res.json();

    const sunrise    = trimSeconds(data.results.sunrise);
    const sunset     = trimSeconds(data.results.sunset);
    const goldenHour = trimSeconds(data.results.golden_hour);

    setSunTimes({ sunrise, sunset, goldenHour });
  })();
}, [coordinates]);

function trimSeconds(timeStr) {
  return timeStr.replace(/:\d{2}(?=\s[AP]M)/, "");
}

console.log("Sun times:", sunTimes);

function parseHourMinute(timeStr) {
  const [time, meridiem] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

function anglesFromTime(timeStr) {
  const { hours, minutes } = parseHourMinute(timeStr);
  return {
    minuteAngle: minutes * 6,
    hourAngle: (hours % 12) * 30 + minutes * 0.5
  };
}

const { hourAngle: sunriseHourAngle, minuteAngle: sunriseMinuteAngle } =
  sunTimes ? anglesFromTime(sunTimes.sunrise) : { hourAngle: 0, minuteAngle: 0 };

const { hourAngle: sunsetHourAngle, minuteAngle: sunsetMinuteAngle } =
  sunTimes ? anglesFromTime(sunTimes.sunset) : { hourAngle: 0, minuteAngle: 0 };

const { hourAngle: goldenHourAngle, minuteAngle: goldenMinuteAngle } =
  sunTimes ? anglesFromTime(sunTimes.goldenHour) : { hourAngle: 0, minuteAngle: 0 };


  const airConditionImages = {
    1: Good,
    2: Fair,
    3: Moderate,
    4: Poor,
    5: veryPoor,
  };

  const uvImages = {
    "Low": Good,
    "Moderate": Fair,
    "High": Moderate,
    "Very High": Poor,
    "Extreme": veryPoor
  };


  function handleSelectSuggestion(suggestion) {
    setCoordinates({
      longitude: suggestion.longitude,
      latitude: suggestion.latitude,
    });
    setSelectedPlace(suggestion);
    setQuery(`${suggestion.city}, ${suggestion.country}`);
    setSuggestions([]);
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
        city: f.properties?.name,
        country: f.properties?.context?.country?.name,
        full: f.properties?.place_formatted,
        longitude: f.geometry?.coordinates[0],
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
              key="search-container"
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
              <div className="hand hour"
                style={{ transform: `rotate(${sunriseHourAngle}deg)` }}
              ></div>
              <div className="hand minute"
                style={{ transform: `rotate(${sunriseMinuteAngle}deg)` }}
              ></div>
            </div>
            <p className="time">{(sunTimes?.sunrise) || "Loading..."}</p>
          </div>
        </div>

        <div className='clock-card-container'>
          <span className='golden-hour-span'>Golden Hour</span>
          <div className="clock-card clock-card2">
            <div className="clock">
              <div className="hand hour"
                style={{ transform: `rotate(${goldenHourAngle}deg)` }}
              ></div>
              <div className="hand minute"
                style={{ transform: `rotate(${goldenMinuteAngle}deg)` }}
              ></div>
            </div>
            <p className="time">{(sunTimes?.goldenHour) || 'Loading..'}</p>
          </div>
        </div>

        <div className='clock-card-container'>
          <span className='sunrise-sunset-span'>Sunset</span>
          <div className="clock-card">
            <div className="clock">
              <div className="hand hour"
                style={{ transform: `rotate(${sunsetHourAngle}deg)` }}
              ></div>
              <div className="hand minute"
                style={{ transform: `rotate(${sunsetMinuteAngle}deg)` }}
              ></div>
            </div>
            <p className="time">{(sunTimes?.sunset) || "Loading..."}</p>
          </div>
        </div>
      </div>

      <div className='status-cards'>
        <div className='status-container'>
          <p>Air Quality</p>
          <div className='img-container'>
            <img src={airConditionImages[aqi]} />
            <span className='rating'>{aqi}/5</span>
            <span className='status'>{aqi !== null ? airCondition[aqi] : "Loading..."}</span>
          </div>
        </div>
        <div className='status-container'>
          <p>Uv Index</p>
          <div className='img-container'>
            <img src={uvImages[uvCategory(uvIndex)]} />
            <span className='rating'>{uvIndex}/15</span>
            <span className='status'>{uvIndex !== null ? uvCategory(uvIndex) : 'loading...'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}