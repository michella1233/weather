import './HomePage.css'
import './DegreeToggle.css'
import './WeatherCard.css'
import './GoldenHour.css'
import './StatusCard.css'
import cloudy from './assets/cloudy.png'
import wind from './assets/wind.png'
import rain from './assets/rain.png'
import humidity from './assets/humidity.png'
import craining from './assets/c-raining.png'
import position from './assets/position.png'
import search from './assets/search.png'
import veryPoor from './assets/very-poor.png'
import { useState } from 'react'

export function HomePage() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className='home-page-container'>
      <div className="left-container">
        <div className='header-weather'>
          <img src={cloudy} />
          <div className="toggle-button-cover">
            <div className="button r" id="button-3">
              <input type="checkbox" className="checkbox" />
              <div className="knobs"></div>
              <div className="layer"></div>
            </div>
          </div>
        </div>
        <div className='header-degree'>
          <span className="temp">31</span>
          <span className="degree">°</span>
          <span className="unit">C</span>
        </div>
        <div className='date-time'>
          <div className='date'>5th Aug '21</div>
          <div className='day-time'>
            <span className='day'>Thursday</span>
            <span className='time'>07:29 pm</span>
          </div>
        </div>
        <div className='weather-condition'>
          <div className='wind'>
            <img src={wind} />wind 5.5 km/h</div>
          <div className='humidity'>
            <img src={humidity} />humidity 74 %</div>
          <div className='rain'>
            <img src={rain} />rain 0.27 %</div>
        </div>
        <div className='weather-conclusion'>
          <div className='card'>
            <img src={craining} className='card-img' />
            <p className="temp">31°C</p>
            <div className="minmaxContainer">
              <div className="min">
                <p className="minHeading">Min</p>
                <p className="minTemp">26°C</p>
              </div>
              <div className="max">
                <p className="maxHeading">Max</p>
                <p className="maxTemp">34°C</p>
              </div>
            </div>
            <p className="day">Thursday</p>
          </div>
          <div className='card'>
            <img src={craining} className='card-img' />
            <p className="temp">31°C</p>
            <div className="minmaxContainer">
              <div className="min">
                <p className="minHeading">Min</p>
                <p className="minTemp">26°C</p>
              </div>
              <div className="max">
                <p className="maxHeading">Max</p>
                <p className="maxTemp">34°C</p>
              </div>
            </div>
            <p className="day">Thursday</p>
          </div>
          <div className='card'>
            <img src={craining} className='card-img' />
            <p className="temp">31°C</p>
            <div className="minmaxContainer">
              <div className="min">
                <p className="minHeading">Min</p>
                <p className="minTemp">26°C</p>
              </div>
              <div className="max">
                <p className="maxHeading">Max</p>
                <p className="maxTemp">34°C</p>
              </div>
            </div>
            <p className="day">Thursday</p>
          </div>
          <div className='card'>
            <img src={craining} className='card-img' />
            <p className="temp">31°C</p>
            <div className="minmaxContainer">
              <div className="min">
                <p className="minHeading">Min</p>
                <p className="minTemp">26°C</p>
              </div>
              <div className="max">
                <p className="maxHeading">Max</p>
                <p className="maxTemp">34°C</p>
              </div>
            </div>
            <p className="day">Thursday</p>
          </div>
          <div className='card'>
            <img src={craining} className='card-img' />
            <p className="temp">31°C</p>
            <div className="minmaxContainer">
              <div className="min">
                <p className="minHeading">Min</p>
                <p className="minTemp">26°C</p>
              </div>
              <div className="max">
                <p className="maxHeading">Max</p>
                <p className="maxTemp">34°C</p>
              </div>
            </div>
            <p className="day">Thursday</p>
          </div>
          <div className='card'>
            <img src={craining} className='card-img' />
            <p className="temp">31°C</p>
            <div className="minmaxContainer">
              <div className="min">
                <p className="minHeading">Min</p>
                <p className="minTemp">26°C</p>
              </div>
              <div className="max">
                <p className="maxHeading">Max</p>
                <p className="maxTemp">34°C</p>
              </div>
            </div>
            <p className="day">Thursday</p>
          </div>
          <div className='card'>
            <img src={craining} className='card-img' />
            <p className="temp">31°C</p>
            <div className="minmaxContainer">
              <div className="min">
                <p className="minHeading">Min</p>
                <p className="minTemp">26°C</p>
              </div>
              <div className="max">
                <p className="maxHeading">Max</p>
                <p className="maxTemp">34°C</p>
              </div>
            </div>
            <p className="day">Thursday</p>
          </div>
        </div>
      </div>
      <div className="right-container">
        <div className='right-header'>
          <img className='position' src={position} />
          <span>Delhi, India</span>
          {showSearch && (
            <input
              type="text"
              placeholder="Search city..."
              className="search-input"
            />
          )}
          <button className='search-button'
            onClick={() => setShowSearch(!showSearch)}
          ><img src={search} /></button>
        </div>

        <div className='right-hours'>
          <span>Sunrise</span>
          <div className="clock-card clock-card13">
            <div className="clock">
              <div className="hand hour"></div>
              <div className="hand minute"></div>
            </div>
            <p className="time">5:45 AM</p>
            <p className="label">Sunrise</p>
          </div>

<span>Golden Hour</span>
          <div className="clock-card clock-card2">
            <div className="clock">
              <div className="hand hour"></div>
              <div className="hand minute"></div>
            </div>
            <p className="time">6:38 PM</p>
            <p className="label">Golden Hour</p>
          </div>

          <div className="clock-card clock-card13">
            <div className="clock">
              <div className="hand hour"></div>
              <div className="hand minute"></div>
            </div>
            <p className="time">7:10 PM</p>
            <p className="label">Sunset</p>
          </div>
        </div>

        <div className='status-cards'>
          <div className='air-quality'>
            <p>Air Quality</p>
          <img src={veryPoor} />
          </div>
          <div className='uv-index'>
            <p>Uv Index</p>
            <img src={veryPoor} />
          </div>
        </div>
      </div>
    </div>
  )
}