import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function PrecipitationChart({ data }) {
  return (
  <div style={{ width: 1800, height: 300 }}>
    <h3>🌧️ Hourly Precipitation</h3>

      <LineChart
                    width={1800}   
                    height={300}
                    data={data}
                    margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                    >
        <XAxis dataKey="time" interval={0}  tick={{ fill: "#000", fontSize: 18 }} axisLine={false}     
            tickLine={false} tickMargin={12} />
        <YAxis tick={{ fill: "#000", fontSize: 18 }} axisLine={false}     
            tickLine={false}/>
        <Tooltip />

        <Line 
          type="monotone" 
          dataKey="precip" 
          stroke="#4a4cc2"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>

  </div>
);
}

export default PrecipitationChart;