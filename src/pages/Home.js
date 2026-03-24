import React, { useEffect, useState } from "react";
import useGeolocation from "../hooks/useGeolocation";
import { fetchWeatherData } from "../services/weatherApi";
import "../styles/Home.css";
import TemperatureChart from "../components/TemperatureChart";
import HumidityChart from "../components/HumidityChart";
import WindChart from "../components/WindChart";
import PrecipitationChart from "../components/PrecipitationChart";
import VisibilityChart from "../components/VisibilityChart";
import AirQualityChart from "../components/AirQualityChart";
import TodayTimeline from "../components/TodayTimeline";
import { useNavigate } from "react-router-dom";
import day from "../images/hot_day.jpg";
import sunset from "../images/hot_mild.jpg";
import night from "../images/night_sky.jpg";
import rain from "../images/rain.jpg";
import nightRain from "../images/night_rain.jpg";
import cold from "../images/cold.jpg";

function Home() {
  const { latitude, longitude } = useGeolocation();
  const [weather, setWeather] = useState(null);
  const [air, setAir] = useState(null);
  const [city, setCity] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const pm25Value = air?.hourly?.pm2_5?.[0] || 0;
  const navigate = useNavigate();

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date().toLocaleTimeString());
  }, 1000);

  return () => clearInterval(interval);
}, []);

  // 🌐 Fetch weather data
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude).then((data) => {
        setWeather(data.weather);
        setAir(data.air);
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
  if (latitude && longitude) {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    )
      .then(res => res.json())
      .then(data => {
        setCity(data.address.city || data.address.town || data.address.village);
      });
  }
}, [latitude, longitude]);

  // 📊 Prepare chart data (ONLY today's data)
  const chartData =
    weather?.hourly?.time
      ?.map((time, index) => ({
        fullTime: time,
        time: time.split("T")[1],
        temp: weather.hourly.temperature_2m[index],
      }))
      .filter((item) =>
        item.fullTime.includes(weather?.current?.time?.split("T")[0])
      ) || [];

  const humidityData =
  weather?.hourly?.time
    ?.map((time, index) => ({
      fullTime: time,
      time: time.split("T")[1],
      humidity: weather.hourly.relative_humidity_2m[index],
    }))
    .filter((item) =>
      item.fullTime.includes(weather?.current?.time?.split("T")[0])
    ) || [];

    const windData =
  weather?.hourly?.time
    ?.map((time, index) => ({
      fullTime: time,
      time: time.split("T")[1],
      wind: weather.hourly.wind_speed_10m[index],
    }))
    .filter((item) =>
      item.fullTime.includes(weather?.current?.time?.split("T")[0])
    ) || [];

    const precipitationData =
  weather?.hourly?.time
    ?.map((time, index) => ({
      fullTime: time,
      time: time.split("T")[1],
      precip: weather.hourly.precipitation[index],
    }))
    .filter((item) =>
      item.fullTime.includes(weather?.current?.time?.split("T")[0])
    ) || [];

    const visibilityData =
  weather?.hourly?.time
    ?.map((time, index) => ({
      fullTime: time,
      time: time.split("T")[1],
      visibility: weather.hourly.visibility[index] / 1000,
    }))
    .filter((item) =>
      item.fullTime.includes(weather?.current?.time?.split("T")[0])
    ) || [];

    const airData =
  air?.hourly?.time
    ?.map((time, index) => ({
      fullTime: time,
      time: time.split("T")[1],
      pm10: air.hourly.pm10[index],
      pm25: air.hourly.pm2_5[index],
    }))
    .filter((item) =>
      item.fullTime.includes(
        air?.hourly?.time?.[0]?.split("T")[0]
      )
    ) || [];

 const getAQILevel = (pm25) => {
    if (!pm25) return { label: "Unknown", color: "" };

    if (pm25 <= 12) return { label: "Good 🟢", color: "good" };
    if (pm25 <= 35) return { label: "Moderate 🟡", color: "moderate" };
    if (pm25 <= 55) return { label: "Unhealthy for Sensitive 🟠", color: "unhealthy" };
    if (pm25 <= 150) return { label: "Unhealthy 🔴", color: "danger" };

    return { label: "Hazardous ☠️", color: "hazard" };
  };

const getBackground = () => {
  const temp = weather?.current?.temperature_2m;
  const hour = new Date().getHours();

  const isNight = hour > 19 || hour < 6;
  const isEvening = hour >= 17 && hour <= 19;

  const precip = weather?.current?.precipitation;
  const isRain = precip > 0;

  // 🌙 Night + Rain
  if (isNight && isRain) return "night-rain";

  // 🌙 Night
  if (isNight) return "night";

  // 🌅 Sunset
  if (isEvening) return "sunset";

  // 🌧️ Rain
  if (isRain) return "rain";

  // ❄️ Cold (only during day)
  if (temp <= 12) return "cold";

  return "day";
};

const getBgImage = () => {
  const type = getBackground();

  if (type === "night-rain") return nightRain;
  if (type === "night") return night;
  if (type === "rain") return rain;
  if (type === "sunset") return sunset;
  if (type === "cold") return cold;

  return day;
};

const getFeelsLikeText = () => {
  const temp = weather?.current?.temperature_2m;
  const humidity = weather?.current?.relative_humidity_2m;
  const wind = weather?.current?.wind_speed_10m;

  if (!temp) return "";

  // 💧 Humid override
  if (humidity > 75) return "Feels humid 💧";

  // 💨 Windy override
  if (wind > 20) return "Feels windy 💨";

  // ❄️ Cold
  if (temp <= 10) return "Feels cold ❄️";

  // 🧊 Chilly
  if (temp <= 18) return "Feels chilly 🧥";

  // ☀️ Warm
  if (temp <= 28) return "Feels pleasant 🌤️";

  // 🔥 Hot
  if (temp <= 35) return "Feels warm ☀️";

  // 🥵 Very hot
  if (temp > 35) return "Feels hot 🔥";

  return "Feels normal";
};

const aqi = getAQILevel(pm25Value);

  return (
      <div
        className="container"
        style={{ backgroundImage: `url(${getBgImage()})` }}
      >
      
      <button
      className="next-page-btn"
      onClick={() => navigate("/history")}
      >
        history ➡️
      </button>

      <div className="hero">
      <p className="time">{currentTime}</p>

      <h2 className="city">📍 {city}</h2>

      <h1 className="main-temp">
        {weather?.current?.temperature_2m}°C
      </h1>

      <p className="feels">{getFeelsLikeText()}</p>

      <p className="condition">
        {weather?.current?.precipitation > 0 ? "Rainy" : "Clear"}
      </p>

      </div>
      {weather && (
        <>
          {/* 🧱 Weather Cards */}
          <div className="grid">
            <div className="card">
              <h3>🌡️ Temperature</h3>
              <p>{weather.current.temperature_2m}°C</p>
            </div>

            <div className="card">
              <h3>💧 Humidity</h3>
              <p>{weather.current.relative_humidity_2m}%</p>
            </div>

            <div className="card">
              <h3>💨 Wind Speed</h3>
              <p>{weather.current.wind_speed_10m} km/h</p>
            </div>

            <div className="card">
            <h3>🌧️ Precipitation</h3>
            <p>{weather.current.precipitation ?? 0} mm</p>
          </div>

          <div className="card">
            <h3>🌦️ Rain Chance</h3>
            <p>{weather.hourly.precipitation_probability?.[0] ?? 0}%</p>
          </div>

          <div className="card">
            <h3>☀️ UV Index</h3>
            <p>{weather.daily?.uv_index_max?.[0] ?? "--"}</p>
          </div>

          <div className="card">
            <h3>🌅 Sunrise</h3>
            <p>
              {weather.daily?.sunrise?.[0]
                ? new Date(weather.daily.sunrise[0]).toLocaleTimeString()
                : "--"}
            </p>
          </div>

          <div className="card">
            <h3>🌇 Sunset</h3>
            <p>
              {weather.daily?.sunset?.[0]
                ? new Date(weather.daily.sunset[0]).toLocaleTimeString()
                : "--"}
            </p>
          </div>

          <div className="card">
            <h3>👁️ Visibility</h3>
            <p>
              {weather.current.visibility
              ? weather.current.visibility / 1000 + " km"
              : "--"}
            </p>
          </div>

          {/* AIR QUALITY */}

          <div className="card">
            <h3>🌫️ PM10</h3>
            <p>{air?.hourly?.pm10?.[0] ?? "--"}</p>
          </div>

          <div className={`card ${aqi?.color || ""}`}>
          <h3>🫁 PM2.5</h3>
          <p>{pm25Value ?? "--"}</p>
          <small className="aqi-label">{aqi.label}</small>
          </div>

          <div className="card">
            <h3>💨 CO</h3>
            <p>{air?.hourly?.carbon_monoxide?.[0] ?? "--"}</p>
          </div>
           </div>

          <div className="last-row">
          <div className="card">
            <h3>💨 NO2</h3>
            <p>{air?.hourly?.nitrogen_dioxide?.[0] ?? "--"}</p>
          </div>

          <div className="card">
            <h3>💨 SO2</h3>
            <p>{air?.hourly?.sulphur_dioxide?.[0] ?? "--"}</p>
          </div>
          </div>

          <TodayTimeline
          hourly={weather.hourly}
          currentDate={weather.current.time.split("T")[0]}
          />

          <h2 className="section-title">📊 Hourly Trends</h2>

          <div className="charts">

          {/* 📊 Temperature Chart */}
          <div className="card chart-scroll" style={{ marginTop: "20px" }}>
            <TemperatureChart data={chartData} />
          </div>
          
          {/* 💧 Humidity Chart */}
          <div className="card chart-scroll" style={{ marginTop: "20px" }}>
          <HumidityChart data={humidityData} />
          </div>

          {/* 💨 Wind Speed Chart */}
           <div className="card">
          <WindChart data={windData} />
          </div>

          {/* 🌧️ Precipitation Chart */}
          <div className="card chart-scroll" style={{ marginTop: "20px" }}>
          <PrecipitationChart data={precipitationData} />
          </div>

          {/* 👁️ Visibility Chart */}
          <div className="card chart-scroll" style={{ marginTop: "20px" }}>
            <VisibilityChart data={visibilityData} />
          </div>

          {/* 🌫️ Air Quality Chart */}
          <div className="card chart-scroll">
          <AirQualityChart data={airData} />
          </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;