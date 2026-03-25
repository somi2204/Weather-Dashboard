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
  const [menuOpen, setMenuOpen] = useState(false);

  const pm25Value = air?.hourly?.pm2_5?.[0] || 0;
  const navigate = useNavigate();

  // ⏱ Time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Weather fetch
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude).then((data) => {
        setWeather(data.weather);
        setAir(data.air);
      });
    }
  }, [latitude, longitude]);

  // City
  useEffect(() => {
    if (latitude && longitude) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCity(
            data.address.city ||
              data.address.town ||
              data.address.village
          );
        });
    }
  }, [latitude, longitude]);

  // Chart data
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
        item.fullTime.includes(air?.hourly?.time?.[0]?.split("T")[0])
      ) || [];

  // AQI
  const getAQILevel = (pm25) => {
    if (!pm25) return { label: "Unknown", color: "" };
    if (pm25 <= 12) return { label: "Good 🟢", color: "good" };
    if (pm25 <= 35) return { label: "Moderate 🟡", color: "moderate" };
    if (pm25 <= 55)
      return { label: "Unhealthy 🟠", color: "unhealthy" };
    if (pm25 <= 150) return { label: "Unhealthy 🔴", color: "danger" };
    return { label: "Hazardous ☠️", color: "hazard" };
  };

  const aqi = getAQILevel(pm25Value);

  // 🌄 Background logic
  const getBackground = () => {
    const temp = weather?.current?.temperature_2m;
    const hour = new Date().getHours();
    const isNight = hour > 19 || hour < 6;
    const isEvening = hour >= 17 && hour <= 19;
    const isRain = weather?.current?.precipitation > 0;

    if (isNight && isRain) return "night-rain";
    if (isNight) return "night";
    if (isEvening) return "sunset";
    if (isRain) return "rain";
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

    if (humidity > 75) return "Feels humid 💧";
    if (wind > 20) return "Feels windy 💨";
    if (temp <= 10) return "Feels cold ❄️";
    if (temp <= 18) return "Feels chilly 🧥";
    if (temp <= 28) return "Feels pleasant 🌤️";
    if (temp <= 35) return "Feels warm ☀️";
    if (temp > 35) return "Feels hot 🔥";

    return "Feels normal";
  };

  return (
    <div className="container">
      {/* 🍔 Top Bar */}
      <div className="top-bar">
        <h2>Weather Dashboard</h2>

        <div
          className="burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {menuOpen && (
          <div className="dropdown">
            <p onClick={() => navigate("/")}>Home</p>
            <p onClick={() => navigate("/history")}>Trends</p>
          </div>
        )}
      </div>

      {/* CARD SECTION */}
      <div
        className="card-section"
        style={{ backgroundImage: `url(${getBgImage()})` }}
      >
        <div className="hero">
          <p className="time">{currentTime}</p>
          <h2 className="city">📍 {city}</h2>

          <h1 className="main-temp">
            {weather?.current?.temperature_2m}°C
          </h1>

          <p className="feels">{getFeelsLikeText()}</p>
          <p className="condition">
            {weather?.current?.precipitation > 0
              ? "Rainy"
              : "Clear"}
          </p>
        </div>

        {weather && (
          <>
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
                <h3>💨 Wind</h3>
                <p>{weather.current.wind_speed_10m} km/h</p>
              </div>

              <div className="card">
                <h3>🌧️ Precipitation</h3>
                <p>{weather.current.precipitation ?? 0} mm</p>
              </div>

              <div className="card">
                <h3>☀️ UV Index</h3>
                <p>{weather.daily?.uv_index_max?.[0] ?? "--"}</p>
              </div>

              <div className="card">
                <h3>🌅 Sunrise</h3>
                <p>
                  {weather.daily?.sunrise?.[0]
                    ? new Date(
                        weather.daily.sunrise[0]
                      ).toLocaleTimeString()
                    : "--"}
                </p>
              </div>
            
              <div className="card">
                <h3>🌇 Sunset</h3>
                <p>
                  {weather.daily?.sunset?.[0]
                    ? new Date(
                        weather.daily.sunset[0]
                      ).toLocaleTimeString()
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

              <div className={`card ${aqi?.color}`}>
                <h3>🫁 PM2.5</h3>
                <p>{pm25Value}</p>
                <small>{aqi.label}</small>
              </div>

              <div className="card pm10">
                <h3>🌫️ PM10</h3>
                <p>{air?.hourly?.pm10?.[0] ?? "--"}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CHART SECTION */}
      <div className={`charts-section ${getBackground()}`}>
        <TodayTimeline
          hourly={weather?.hourly}
          currentDate={weather?.current?.time?.split("T")[0]}
        />

        <h2 className="section-title">📊 Hourly Trends</h2>

        <div className="charts">
          <div className="card">
            <TemperatureChart data={chartData} />
          </div>

          <div className="card">
            <HumidityChart data={humidityData} />
          </div>

          <div className="card">
            <WindChart data={windData} />
          </div>

          <div className="card">
            <PrecipitationChart data={precipitationData} />
          </div>

          <div className="card">
            <VisibilityChart data={visibilityData} />
          </div>

          <div className="card">
            <AirQualityChart data={airData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;