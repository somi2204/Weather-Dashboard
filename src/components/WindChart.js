import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function WindChart({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>💨 Hourly Wind Speed</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
        >
          <XAxis 
            dataKey="time" 
            interval={2}
            tick={{ fill: "#000", fontSize: 18 }}
            axisLine={false}     
            tickLine={false}
            tickMargin={12} 
          />

          <YAxis label={{ value: "km/h", fill: "#000" , angle: -90, position: "insideLeft" }} tick={{ fill: "#000", fontSize: 18   }} axisLine={false}
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