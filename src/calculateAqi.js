export function calculateAQI(pm25, pm10) {
  let aqiPM25, aqiPM10;

  // PM2.5 classification
  if (pm25 <= 12) aqiPM25 = 1;
  else if (pm25 <= 35) aqiPM25 = 2;
  else if (pm25 <= 55) aqiPM25 = 3;
  else if (pm25 <= 150) aqiPM25 = 4;
  else aqiPM25 = 5;

  // PM10 classification
  if (pm10 <= 20) aqiPM10 = 1;
  else if (pm10 <= 50) aqiPM10 = 2;
  else if (pm10 <= 100) aqiPM10 = 3;
  else if (pm10 <= 200) aqiPM10 = 4;
  else aqiPM10 = 5;

  // Final AQI = worst of the two
  return Math.max(aqiPM25, aqiPM10);
}

export function uvCategory(uv) {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very High";
  return "Extreme";
}

export const airCondition = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "very Poor"
}