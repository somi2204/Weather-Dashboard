import React, { useState } from "react";
import "../styles/Page2.css";
import { fetchHistoricalData } from "../services/weatherApi";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  Bar,
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
    setData(res?.daily || null);
  };

  // Transform data
  const chartData =
    data?.time?.map((t, i) => ({
      date: t.slice(5),
      min: data.temperature_2m_min[i],
      max: data.temperature_2m_max[i],
      mean: data.temperature_2m_mean[i],
      precip: data.precipitation_sum[i],
      wind: data.windspeed_10m_max[i],
    })) || [];

  return (
    <div className="page2">

      {/* HEADER */}
      <div className="page2-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
        </div>
        <h2>📊 Weather Trends Analysis</h2>
      </div>

      {/* CONTROL PANEL */}
      <div className="control-panel">
        <h3>📅 Select Date Range</h3>

        <div className="date-picker">
          <input type="date" onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" onChange={(e) => setEndDate(e.target.value)} />
          <button onClick={handleFetch}>Analyze</button>
        </div>
      </div>

      {/* CHARTS */}
      {data && (
        <div className="charts">

          {/* TEMPERATURE */}
          <div className="card">
            <h3 className="chart-title">🌡️ Temperature Trends</h3>

            <div className="chart-scroll">
              <div className="chart-wrapper">
                <AreaChart
                  width={Math.max(chartData.length * 70, 600)}
                  height={300}
                  data={chartData}
                >
                  <XAxis dataKey="date" interval={0} />
                  <YAxis />
                  <Tooltip contentStyle={{
                    background: "rgba(255,255,255,0.35)",  
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    borderRadius: "10px",
                  }}/>

                  <defs>
                    <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="blue" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="blue" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="meanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="orange" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="orange" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="red" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="red" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <Area type="monotone" dataKey="min" stroke="blue" fill="url(#minGrad)" dot={false}/>
                  <Area type="monotone" dataKey="mean" stroke="orange" fill="url(#meanGrad)" dot={false}/>
                  <Area type="monotone" dataKey="max" stroke="red" fill="url(#maxGrad)" dot={false}/>
                </AreaChart>
              </div>
            </div>

            <div className="custom-legend">
              <span style={{ color: "blue" }}>• min</span>
              <span style={{ color: "orange" }}>• mean</span>
              <span style={{ color: "red" }}>• max</span>
            </div>
          </div>

          {/* PRECIPITATION */}
          <div className="card">
            <h3 className="chart-title">🌧️ Precipitation</h3>

            <div className="chart-scroll">
              <div className="chart-wrapper">
                <ComposedChart
                  width={Math.max(chartData.length * 70, 600)}
                  height={300}
                  data={chartData}
                >
                  <XAxis dataKey="date" interval={0} />
                  <YAxis />
                  <Tooltip contentStyle={{
                    background: "rgba(255,255,255,0.35)",  
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    borderRadius: "10px",
                  }}/>

                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a4cc2" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#4a4cc2" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>

                  <Bar dataKey="precip" fill="url(#rainGrad)" radius={[6,6,0,0]} />
                  <Line type="monotone" dataKey="precip" stroke="#1e3a8a" dot={false}/>
                </ComposedChart>
              </div>
            </div>
          </div>

          {/* WIND */}
          <div className="card">
            <h3 className="chart-title">💨 Max Wind Speed</h3>

            <div className="chart-scroll">
              <div className="chart-wrapper">
                <AreaChart
                  width={Math.max(chartData.length * 70, 600)}
                  height={300}
                  data={chartData}
                >
                  <XAxis dataKey="date" interval={0} />
                  <YAxis />
                  <Tooltip contentStyle={{
                    background: "rgba(255,255,255,0.35)",  
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    borderRadius: "10px",
                  }}/>

                  <defs>
                    <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <Area type="monotone" dataKey="wind" stroke="#10b981" fill="url(#windGrad)" dot={false}/>
                </AreaChart>
              </div>
            </div>
          </div>

          {/* SUNRISE SUNSET */}
          <div className="card">
            <h3 className="chart-title">🌅 Sunrise & Sunset</h3>

            <div className="chart-scroll">
              <div className="chart-wrapper">
                <LineChart
                  width={Math.max(chartData.length * 70, 600)}
                  height={300}
                  data={data.time.map((t, i) => {
                    const sunrise = new Date(data.sunrise[i]);
                    const sunset = new Date(data.sunset[i]);

                    return {
                      date: t.slice(5),
                      sunrise: sunrise.getHours() + sunrise.getMinutes() / 60,
                      sunset: sunset.getHours() + sunset.getMinutes() / 60,
                      sunriseLabel: sunrise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      sunsetLabel: sunset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    };
                  })}
                >
                  <XAxis dataKey="date" interval={0} />
                  <YAxis domain={[0,24]} />

                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === "sunrise") return props.payload.sunriseLabel;
                      if (name === "sunset") return props.payload.sunsetLabel;
                      return value;
                    }}
                    contentStyle={{
                      background: "rgba(255,255,255,0.35)",  
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      borderRadius: "10px",
                    }}
                  />

                  <Line dataKey="sunrise" stroke="#9b8738" dot={false} strokeWidth={2}/>
                  <Line dataKey="sunset" stroke="#e67e22" dot={false} strokeWidth={2}/>
                </LineChart>
              </div>
            </div>

            <div className="custom-legend">
              <span style={{ color: "#bf9e19"}}>• sunrise </span>
              <span style={{ color: "#e67e22" }}>• sunset</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Page2;