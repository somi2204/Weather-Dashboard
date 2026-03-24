import axios from "axios";

export const fetchWeatherData = async (lat, lon) => {
  try {
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: lat,
          longitude: lon,
          current: [
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
            "precipitation",
            "visibility"
          ],
          hourly: [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "wind_speed_10m",
            "visibility",
            "precipitation_probability"
          ],
          daily: [
            "sunrise",
            "sunset",
            "uv_index_max",
            "temperature_2m_max",
            "temperature_2m_min",
            "weathercode"
          ],
          timezone: "auto",
        },
      }
    );

    const airResponse = await axios.get(
      "https://air-quality-api.open-meteo.com/v1/air-quality",
      {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: ["pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide"],
          timezone: "auto",
        },
      }
    );

    return {
      weather: weatherResponse.data,
      air: airResponse.data,
    };

  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

export const fetchHistoricalData = async (lat, lon, start, end) => {
  try {
    const response = await axios.get(
      "https://archive-api.open-meteo.com/v1/archive",
      {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: start,
          end_date: end,
          daily: [
            "temperature_2m_max",
            "temperature_2m_min",
            "temperature_2m_mean",
            "precipitation_sum",
            "windspeed_10m_max",
            "winddirection_10m_dominant",
            "sunrise",
            "sunset",
          ],
          timezone: "auto",
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error fetching historical data:", error);
  }
};