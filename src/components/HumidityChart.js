import React from "react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function HumidityChart({ data }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <div style={{ width:isMobile ? "100%" : 1800, height: 300 }}>
      <h3 style={{ textAlign: "center" }}>💧 Hourly Humidity</h3>

        <LineChart
              width={isMobile ? 350 : 1800}   
              height={300}
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
              >
          <XAxis 
            dataKey="time" 
            interval={0}
            tick={{ fill: "#000", fontSize:isMobile ? 10 : 18 }}
            axisLine={false}     
            tickLine={false}
            tickMargin={12} 
          />

          <YAxis label={{value: "%",fill: "#000", angle: -90, position: "insideLeft" }} tick={{ fill: "#000", fontSize: 18 }} axisLine={false}     
            tickLine={false}/>

          <Tooltip />

          <Line 
            type="monotone" 
            dataKey="humidity" 
            stroke="#1f4686" 
            strokeWidth={3} 
          />
        </LineChart>
    </div>
  );
}

export default HumidityChart;