import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function PrecipitationChart({ data }) {

  // dynamic width
  const chartWidth = Math.max(data.length * 60, 300);

  return (
    <div className="chart-scroll">
      <h3 style={{ textAlign: "center" }}>
        🌧️ Hourly Precipitation
      </h3>

      <div className="chart-wrapper">
        <ComposedChart
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

          {/* Gradient for bars */}
          <defs>
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a4cc2" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#4a4cc2" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          {/* Bars */}
          <Bar
            dataKey="precip"
            fill="url(#rainGradient)"
            radius={[6, 6, 0, 0]}
          />

          {/* Smooth trend line */}
          <Line
            type="monotone"
            dataKey="precip"
            stroke="#1e3a8a"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </div>
    </div>
  );
}

export default PrecipitationChart;