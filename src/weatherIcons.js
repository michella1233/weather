// weatherIcons.js
import clearSky from './assets/cards/clear-sky.png' //0
import mainlyClear from './assets/cards/mainly-clear.png' //1
import partlyCloudy from './assets/cards/partly-cloudy.png' //2
import overcast from './assets/cards/overcast.png' //3
import fog from './assets/cards/fog.png' //45
import snowFog from './assets/cards/snow-fog.png' //48
import lightRain from './assets/cards/light-rain.png' //51 61 80
import moderateRain from './assets/cards/moderate-rain.png' //53 63 81
import heavyRain from './assets/cards/heavy-rain.png' //55 65 82
import lightThunder from './assets/cards/light-thunder.png' //95
import moderateThunder from './assets/cards/moderate-thunder.png' //96
import heavyThunder from './assets/cards/heavy-thunder.png' //99
import lightSnow from './assets/cards/light-snow.png' //71
import moderateSnow from './assets/cards/moderate-snow.png' //73
import heavySnow from './assets/cards/heavy-snow.png' //75

export const weatherIcons = {
  0: clearSky,
  1: mainlyClear,
  2: partlyCloudy,
  3: overcast,
  45: fog,
  48: snowFog,
  51: lightRain,
  61: lightRain,
  80: lightRain,
  53: moderateRain,
  63: moderateRain,
  81: moderateRain,
  55: heavyRain,
  65: heavyRain,
  82: heavyRain,
  71: lightSnow,
  73: moderateSnow,
  75: heavySnow,
  95: lightThunder,
  96: moderateThunder,
  99: heavyThunder,
}
