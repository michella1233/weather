import './RightContainer.css'
import position from './assets/position.png'
import search from './assets/search.png'
import veryPoor from './assets/very-poor.png'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'

export function RightContainer() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  async function searchCity(q) {
    if (!q) return [];
    try {
      const url = "https://api.mapbox.com/search/geocode/v6/forward";
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      const res = await axios.get(url, {
        params: {
          q,
          access_token: token,
          autocomplete: true,
          limit: 5,
          types: "place,country"
        }
      });
      return res.data.features.map(f => ({
        city: f.properties?.name,
        country: f.properties?.context?.country?.name,
        full: f.properties?.place_formatted,
        lng: f.geometry?.coordinates[0],
        lat: f.geometry?.coordinates[1]
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }

useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 1) {
        const results = await searchCity(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);


  const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

  async function getCoordinates(query) {
    try {
      const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: { q: query, key: apiKey },
      });

      console.log(response.data.results[0].geometry);
    } catch (error) {
      console.error(error);
    }
  }

  getCoordinates("Greater Manchester, England, United Kingdom");


  async function searchPlace(query) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
        return data.results.map(result => ({
          city: result.components.city || result.components.town || result.components.village,
          country: result.components.country
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching place:", error);
      return [];
    }
  }

  // Example usage
  searchPlace("Manchester, United Kingdom").then(suggestions => console.log(suggestions));



  return (
    <div className="right-container">
      <div className='right-header'>
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.div
              key="search"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: "left center", width: "100%" }}
            >
              <input
                key="search"
                type="text"
                placeholder=" Search a city..."
                className="search-input"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  transformOrigin: "left center", // 👈 scale starts from the left
                  width: "72%",
                }}
              />
              {suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onClick={() => {
                        setQuery(s.full);
                        setSuggestions([]);
                        setShowSearch(false);
                        console.log("Selected:", s);
                      }}
                    >
                      {s.full}
                    </div>
                  ))}
                </div>
              )}
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