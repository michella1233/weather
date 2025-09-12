import './HomePage.css'
import './DegreeToggle.css'
import './WeatherCard.css'
import './GoldenHour.css'
import './StatusCard.css'
import { RightContainer } from './RightContainer'
import { LeftContainer } from './LeftContainer'
import { useState } from 'react'

export function HomePage() {
  const [coordinates, setCoordinates] = useState({
    latitude: -6.1818,   // ✅ default Jakarta
    longitude: 106.8223
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);

  const [sunrise, setSunrise] = useState(null)

  return (
    <div className='home-page-container'>
      <LeftContainer
        coordinates={coordinates}
        setUvIndex= {setUvIndex}
        setSunrise= {setSunrise}
      />
      <RightContainer
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        uvIndex={uvIndex}
        sunrise={sunrise}
      />
    </div>
  )
}