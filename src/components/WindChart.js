import React from "react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function WindChart({ data }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

  return (
    <div style={{ width: isMobile ? "100%" : "1800px", height: 300 }}>
      <h3>💨 Hourly Wind Speed</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
        >
          <XAxis 
            dataKey="time" 
            interval={2}
            tick={{ fill: "#000", fontSize: isMobile ? 10 : 18 }}
            axisLine={false}     
            tickLine={false}
            tickMargin={12} 
          />

          <YAxis label={{ value: "km/h", fill: "#000" , angle: -90, position: "insideLeft" }} tick={{ fill: "#000", fontSize: isMobile ? 10 : 18   }} axisLine={false}
          tickLine={false}/>

          <Tooltip />

          <Line 
            type="monotone" 
            dataKey="wind" 
            stroke="#0e7150"   // green color
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WindChart;