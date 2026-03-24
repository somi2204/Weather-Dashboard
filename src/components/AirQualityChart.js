import React from "react";
import { useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function AirQualityChart({ data }) {
  const scrollRef = useRef();
    useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / 2;
    }
  }, [data]);

  return (
    <div ref={scrollRef}>
    <div style={{ width: 1800, height: 300 }}>
      <h3 style={{ textAlign: "center" }}>🌫️ Air Quality (PM10 v/s PM2.5)</h3>

        <LineChart
              width={1800}   // 🔥 this creates horizontal scroll
              height={300}
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
              >

          <XAxis dataKey="time" interval={0} tick={{ fill: "#000", fontSize: 18 }} axisLine={false}     
            tickLine={false} tickMargin={12} />

          <YAxis tick={{ fill: "#000", fontSize: 18 }} axisLine={false}     
            tickLine={false}/>

          <Tooltip />
          <Legend />

          {/* PM10 */}
          <Line 
            type="monotone" 
            dataKey="pm10" 
            stroke="#ef4444"   // red
            strokeWidth={3}
            dot={{ r: 3 }}
          />

          {/* PM2.5 */}
          <Line 
            type="monotone" 
            dataKey="pm25" 
            stroke="#22c55e"   // green
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>

      {data.length === 0 && (
        <p style={{ textAlign: "center" }}>
          No air quality data available 🌫️
        </p>
      )}
    </div>
    </div>
  );
}

export default AirQualityChart;