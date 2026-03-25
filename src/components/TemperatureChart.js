import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function TemperatureChart({ data }) {

  // dynamic width for scroll
  const chartWidth = Math.max(data.length * 60, 300);

  return (
    <div className="chart-scroll">
      <h3 style={{ textAlign: "center" }}>
        🌡️ Hourly Temperature
      </h3>

      <div className="chart-wrapper">
        <AreaChart
          width={chartWidth}
          height={300}
          data={data}
          margin={{ top: 20, right: 50, left: 20, bottom: 40 }}
        >
          <XAxis
            dataKey="time"
            interval={0}
            tick={{ fill: "#000", fontSize: 18 }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            minTickGap={15}
          />

          <YAxis
            label={{
              value: "°C",
              angle: -90,
              position: "insideLeft",
              fill: "#000",
            }}
            tick={{ fill: "#000", fontSize: 18 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Glass Tooltip */}
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "10px",
            }}
          />

          {/* Gradient fill */}
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7e5f" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#feb47b" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="temp"
            stroke="#ff7e5f"
            fill="url(#tempGradient)"
            strokeWidth={3}
            dot={false}   
          />
        </AreaChart>
      </div>
    </div>
  );
}

export default TemperatureChart;