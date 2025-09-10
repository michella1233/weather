import cloudy from './assets/cloudy.png'
import wind from './assets/wind.png'
import rain from './assets/rain.png'
import humidity from './assets/humidity.png'
import craining from './assets/c-raining.png'
import './LeftContainer.css'
import { fetchWeatherApi } from 'openmeteo';
import { useEffect, useState } from 'react';
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export function LeftContainer({ coordinates }) {


  const [currentTemp, setCurrentTemp] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [currentWind, setCurrentWind] = useState(null);

  useEffect(() => {
    const temperatureNow = async () => {
      const params = {
        "latitude": coordinates.latitude,
        "longitude": coordinates.longitude,
        "hourly": ["temperature_2m", "wind_speed_10m"],
        "current": ["temperature_2m", "apparent_temperature"],
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();

      const current = response.current();
      const hourly = response.hourly();

      const weatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature_2m: current.variables(0).value(),
          apparent_temperature: current.variables(1).value(),
        },
        hourly: {
          wind_speed_10m: hourly.variables(1).valuesArray(),
        }
      }

      const currentTemp = Math.round(weatherData.current.temperature_2m)
      const currentTime = weatherData.current.time
      const currentWind = weatherData.hourly.wind_speed_10m

      setCurrentTemp(currentTemp)
      setCurrentTime(currentTime)
      setCurrentWind(currentWind)
    }
    temperatureNow();
  }, [coordinates])


  // useEffect(()=>{
  //   if(!currentTime){
  //     return
  //   } else if (currentTime){
  //     const interval = setInterval(()=>{
  //      setCurrentTime(dayjs(currentTime).add(1, "minute").toDate()
  //         );
  //       }, 60000);
  //       clearInterval(interval);
  //   }
  // },[currentTime])

  // console.log(currentWind)


  return (
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
        <span className="temp">{currentTemp}</span>
        <span className="degree">°</span>
        <span className="unit">C</span>
      </div>
      <div className='date-time'>
        <div className='date'>{currentTime
          ? dayjs(currentTime).format("Do MMM 'YY") // Example: 5th Aug '21
          : "Loading..."}</div>
        <div className='day-time'>
          <span className='day'>{currentTime ? dayjs(currentTime).format("dddd") : ""}</span>
          <span className='time'>{currentTime ? dayjs(currentTime).format("hh:mm A") : ""}</span>
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
  )
}