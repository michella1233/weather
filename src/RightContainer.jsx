import './RightContainer.css'
import position from './assets/position.png'
import search from './assets/search.png'
import veryPoor from './assets/very-poor.png'
import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";

export function RightContainer() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="right-container">
      <div className='right-header'>
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.input
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