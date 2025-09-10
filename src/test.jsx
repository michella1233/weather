import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import position from "./position.png";
import search from "./search.png";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔹 function to fetch from Mapbox
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

  // 🔹 fetch when query changes
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

  return (
    <div className="right-header">
      <AnimatePresence mode="wait">
        {showSearch ? (
          <motion.div
            key="search"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "left center", width: "72%" }}
          >
            <input
              type="text"
              placeholder=" Search a city..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* 🔹 Recommendation dropdown */}
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
            <span className="position-city">Delhi, India</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className="search-button"
        onClick={() => setShowSearch(!showSearch)}
      >
        <img src={search} />
      </button>
    </div>
  );
}
