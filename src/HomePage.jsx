import './HomePage.css'
import './DegreeToggle.css'
import './WeatherCard.css'
import './GoldenHour.css'
import './StatusCard.css'
import { RightContainer } from './RightContainer'
import {LeftContainer} from './LeftContainer'

export function HomePage() {
  

  return (
    <div className='home-page-container'>
      <LeftContainer />
      <RightContainer />
    </div>
  )
}