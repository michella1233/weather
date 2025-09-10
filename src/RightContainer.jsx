import './RightContainer.css'
import position from './assets/position.png'
import search from './assets/search.png'
import veryPoor from './assets/very-poor.png'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, time } from "framer-motion";
import axios from 'axios'

export function RightContainer() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([])

  function saveQueryChange(event) {
    setQuery(event.target.value);
    console.log(event.target.value)
  }

  function handleKeyDown(event) {
    if (event.key === "enter") {
      saveQueryChange()
    }
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

  (async () => {
    const results = await searchCity(query);
    console.log(results);
  })();


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


  // const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
  // async function getCoordinates(query) {
  //   try {
  //     const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
  //       params: { q: query, key: apiKey },
  //     });

  //     console.log(response.data.results[0].geometry);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  // getCoordinates("Greater Manchester, England, United Kingdom");

  // async function searchPlace(query) {
  //   const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=5`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (data.results.length > 0) {
  //       return data.results.map(result => ({
  //         city: result.components.city || result.components.town || result.components.village,
  //         country: result.components.country
  //       }));
  //     } else {
  //       return [];
  //     }
  //   } catch (error) {
  //     console.error("Error fetching place:", error);
  //     return [];
  //   }
  // }
  // // Example usage
  // searchPlace("Manchester, United Kingdom").then(suggestions => console.log(suggestions));



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
                onKeyDown={handleKeyDown}
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
                    <div key={i} className="suggestion-item">
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
              <span className='position-city'>Delhi, India</span>
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
            <span className='rating'>5/5</span>
            <span className='status'>Very Poor</span>
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