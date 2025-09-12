import cloudy from './assets/cloudy.png'
import wind from './assets/wind.png'
import rain from './assets/rain.png'
import humidity from './assets/humidity.png'
import './LeftContainer.css'
import { fetchWeatherApi } from 'openmeteo';
import { useEffect, useState } from 'react';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { weatherIcons } from './weatherIcons';
import { celsiusToFahrenheit } from './convertDegree';

dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export function LeftContainer({ coordinates }) {

  const [degreeToggle, setDegreeToggle] = useState(true)

  const [currentTemp, setCurrentTemp] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [currentWind, setCurrentWind] = useState(null);
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [currentRain, setCurrentRain] = useState(null);
  const [cards, setCards] = useState([])

  function changeDegree() {
    setDegreeToggle(!degreeToggle)
  }

  useEffect(() => {
    const temperatureNow = async () => {
      const params = {
        "latitude": coordinates.latitude,
        "longitude": coordinates.longitude,
        "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "uv_index_max", "precipitation_probability_max", "weather_code"],
        "current": ["temperature_2m", "wind_speed_10m", "relative_humidity_2m"],
        "timezone": "auto",
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      const response = responses[0];
      const timezone = response.timezone();
      const utcOffsetSeconds = response.utcOffsetSeconds();

      const current = response.current();
      const daily = response.daily();

      const sunrise = daily.variables(2);
      const sunset = daily.variables(3);

      const weatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature_2m: current.variables(0).value(),
          wind_speed_10m: current.variables(1).value(),
          relative_humidity_2m: current.variables(2).value(),
        },
        daily: {
          card: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
              (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m_max: daily.variables(0).valuesArray(),
            temperature_2m_min: daily.variables(1).valuesArray(),
            weather_code: daily.variables(6).valuesArray(),
          },
          // Map Int64 values to according structure
          sunrise: [...Array(sunrise.valuesInt64Length())].map(
            (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
          ),
          // Map Int64 values to according structure
          sunset: [...Array(sunset.valuesInt64Length())].map(
            (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
          ),
          uv_index_max: daily.variables(4).valuesArray(),
          precipitation_probability_max: daily.variables(5).valuesArray(),
        },
      }

      const currentTemp = Math.round(weatherData.current.temperature_2m);

      const localTime = new Date().toLocaleString("en-US", { timeZone: timezone });
      const currentTime = localTime

      const windSpeedMs = weatherData.current.wind_speed_10m;
      const windSpeedKmh = (windSpeedMs * 3.6).toFixed(1);
      const currentWind = windSpeedKmh
      const currentHumidity = weatherData.current.relative_humidity_2m

      const currentRain = weatherData.daily.precipitation_probability_max[0];


      const formattedCards = weatherData.daily.card.time.map((date, i) => ({
        time: date.toLocaleDateString("en-US", { weekday: "long" }),
        min: Math.round(weatherData.daily.card.temperature_2m_min[i]),
        max: Math.round(weatherData.daily.card.temperature_2m_max[i]),
        code: weatherData.daily.card.weather_code[i],
      }));

      setCurrentTemp(currentTemp)
      setCurrentTime(currentTime)
      setCurrentWind(currentWind)
      setCurrentHumidity(currentHumidity)
      setCurrentRain(currentRain)
      setCards(formattedCards);
      // console.log(`\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`)
      console.log("\nDaily data", weatherData.daily.card)
    }
    temperatureNow();
  }, [coordinates])


  useEffect(() => {
    if (!currentTime) return;

    const interval = setInterval(() => {
      setCurrentTime(prevTime => dayjs(prevTime).add(1, "minute").toDate());
    }, 60000);

    return () => clearInterval(interval);
  }, [currentTime]);  //update the minute

  return (
    <div className="left-container">
      <div className='header-weather'>
        <img src={cloudy} />
        <div onClick={changeDegree} className={degreeToggle ? 'degree-toggle' : 'degree-toggle-f'}>
          <div className={`degree-label ${degreeToggle ? 'C1' : 'F1'}`}>
            <span className={degreeToggle ? 'C' : 'F'}>
              {degreeToggle ? '°C' : '°F'}
            </span>
          </div>
        </div>
      </div>
      <div className='header-degree'>
        <span className="temp">{degreeToggle ? currentTemp : celsiusToFahrenheit(currentTemp)}</span>
        <span className="degree">°</span>
        <span className="unit">{degreeToggle ? 'C' : 'F'}</span>
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
          <img src={wind} />wind {currentWind} km/h</div>
        <div className='humidity'>
          <img src={humidity} />humidity {currentHumidity} %</div>
        <div className='rain'>
          <img src={rain} />rain {currentRain} %</div>
      </div>
      <div className='weather-conclusion'>
        {cards.map((card, index) => {
          return (
            <div key={index} className='card'>
              <img
                src={weatherIcons[card.code]}
                alt="Weather icon"
                className='card-img' />
              <div className="minmaxContainer">
                <div className="min">
                  <p className="minHeading">Min</p>
                  <p className="minTemp">{degreeToggle ? card.min : celsiusToFahrenheit(card.min)}°{degreeToggle ? 'C' : 'F'}</p>
                </div>
                <div className="max">
                  <p className="maxHeading">Max</p>
                  <p className="maxTemp">{degreeToggle ? card.max : celsiusToFahrenheit(card.max)}°{degreeToggle ? 'C' : 'F'}</p>
                </div>
              </div>
              <p className="day">{index === 0 ? 'Today' : card.time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}