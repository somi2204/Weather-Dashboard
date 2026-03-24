import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function VisibilityChart({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>👁️ Hourly Visibility (km)</h3>
        <LineChart
                      width={1800}   
                      height={300}
                      data={data}
                      margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                      >

          <XAxis 
            dataKey="time" 
            interval={0}
            tick={{ fill: "#000", fontSize: 18 }}
            axisLine={false}     
            tickLine={false}
            tickMargin={12}
          />

          <YAxis tick={{ fill: "#000", fontSize: 18 }} axisLine={false}     // ❌ removes left vertical line
          tickLine={false}/>

          <Tooltip />

          <Line 
            type="monotone" 
            dataKey="visibility" 
            stroke="#f59e0b"   // orange
            strokeWidth={3}
          />
        </LineChart>
    </div>
  );
}

export default VisibilityChart;