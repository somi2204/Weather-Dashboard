import React, { useState } from "react";
import "../styles/Page2.css";
import { fetchHistoricalData } from "../services/weatherApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar, 
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

function Page2({ lat, lon }) {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    if (!startDate || !endDate || !lat || !lon) {
      alert("Missing data");
      return;
    }

    const diff =
      (new Date(endDate) - new Date(startDate)) /
      (1000 * 60 * 60 * 24);

    if (diff > 730) {
      alert("Max range is 2 years");
      return;
    }

    const res = await fetchHistoricalData(lat, lon, startDate, endDate);
    console.log(res);

    setData(res?.daily || null);
  };

  // 🧠 Transform data for charts
  const chartData =
    data?.time?.map((t, i) => ({
      date: t.slice(5), // cleaner date
      min: data.temperature_2m_min[i],
      max: data.temperature_2m_max[i],
      mean: data.temperature_2m_mean[i],
      precip: data.precipitation_sum[i],
      wind: data.windspeed_10m_max[i],
      sunrise: data.sunrise[i],
      sunset: data.sunset[i],
    })) || [];

  return (
    <div className="page2">

      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2>📊 Historical Weather</h2>

      {/* 📅 Date Picker */}
      <div className="date-picker">
        <input type="date" onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={handleFetch}>Analyze</button>
      </div>

      {/* 📊 Charts */}
      {data && (
        <div className="charts">

          {/* 🌡️ Temperature */}
          <div className="card chart-scroll">
            <h3> 🌡️ Temperature Trends</h3>
            <LineChart width={chartData.length * 60} height={300} data={chartData}>
              <XAxis dataKey="date" tick={{ fill: "#000"}} axisLine={false} tickLine={false} fontSize={18} tickMargin={15}/>
              <YAxis tick={{ fill: "#000" }} axisLine={false} fontSize={18} tickLine={false}/>
              <Legend />
              <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e2f",
                border: "none",
                borderRadius: "10px",
                color: "#fff"
              }}
            />
              <Line dataKey="min" stroke="blue" strokeWidth={2} dot={{ r: 4 }}
              activeDot={{ r: 6 }}/>
              <Line dataKey="mean" stroke="orange" strokeWidth={2} dot={{ r: 4 }}
              activeDot={{ r: 6 }} />
              <Line dataKey="max" stroke="red" strokeWidth={2} dot={{ r: 4 }}
              activeDot={{ r: 6 }}/>
            </LineChart>
          </div>

          {/* 🌧️ Precipitation */}
          <div className="card chart-scroll">
            <h3> 🌧️ Precipitation</h3>
            <BarChart width={chartData.length * 60} height={300} data={chartData}>
              <XAxis dataKey="date" tick={{ fill: "#000" }} axisLine={false} tickLine={false} fontSize={18} tickMargin={15}/>
              <YAxis tick={{ fill: "#000" }} axisLine={false} fontSize={18} tickLine={false}/>
              <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e2f",
                border: "none",
                borderRadius: "10px",
                color: "#fff"
              }}
            />
              <Bar dataKey="precip" fill="#2c6a93" />
            </BarChart>
          </div>

          {/* 💨 Wind */}
          <div className="card chart-scroll">
            <h3> 💨 Max Wind Speed</h3>
            <LineChart width={chartData.length * 60} height={300} data={chartData}>
              <XAxis dataKey="date" tick={{ fill: "#000" }} axisLine={false} tickLine={false} fontSize={18} tickMargin={15}/>
              <YAxis tick={{ fill: "#000" }} axisLine={false} fontSize={18} tickLine={false}/>
              <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e2f",
                border: "none",
                borderRadius: "10px",
                color: "#fff"
              }}
            />
              <Line dataKey="wind" stroke="#9b59b6" strokeWidth={3} dot={{ r: 4 }}
              activeDot={{ r: 6 }} />
            </LineChart>
          </div>
        
        {/* 🌅 Sun Cycle */}
          <div className="card chart-scroll">
        <h3>🌅 Sun Cycle (Sunrise & Sunset)</h3>

        <LineChart
        width={chartData.length * 60}
        height={300}
        data={data.time.map((t, i) => {
      const sunrise = new Date(data.sunrise[i]);
      const sunset = new Date(data.sunset[i]);

      return {
        date: t.slice(5),

        // convert time to decimal hours
        sunrise:
          sunrise.getHours() + sunrise.getMinutes() / 60,

        sunset:
          sunset.getHours() + sunset.getMinutes() / 60,
      };
    })}
  >
    <XAxis dataKey="date" tick={{ fill: "#000" }} axisLine={false} tickLine={false} fontSize={18} tickMargin={15}/>
    <YAxis domain={[0, 24]} tick={{ fill: "#000" }} axisLine={false} fontSize={18} tickLine={false} />
    <Legend />
    <Tooltip
      contentStyle={{
        backgroundColor: "#1e1e2f",
        border: "none",
        borderRadius: "10px",
        color: "#fff"
      }}
      formatter={(value) => {
        const hours = Math.floor(value);
        const minutes = Math.round((value - hours) * 60);
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
      }}
    />
    <Line dataKey="sunrise" stroke="#f1c40f" name="Sunrise 🌅" strokeWidth={2} dot={{ r: 4 }}
  activeDot={{ r: 6 }}/>
    <Line dataKey="sunset" stroke="#e67e22" name="Sunset 🌇" strokeWidth={2} dot={{ r: 4 }}
  activeDot={{ r: 6 }} />
  </LineChart>
</div>

        </div>
      )}
    </div>
  );
}

export default Page2;