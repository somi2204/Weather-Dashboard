import React, { useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function AirQualityChart({ data }) {
  const scrollRef = useRef();

  // auto-center scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        (scrollRef.current.scrollWidth -
          scrollRef.current.clientWidth) / 2;
    }
  }, [data]);

  // dynamic width
  const chartWidth = Math.max(data.length * 60, 400);

  return (
    <div className="chart-scroll" ref={scrollRef}>
      <h3 style={{ textAlign: "center" }}>
        🌫️ Air Quality (PM10 vs PM2.5)
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

          {/* Gradients */}
          <defs>
            <linearGradient id="pm10Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>

            <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* PM10 */}
          <Area
            type="monotone"
            dataKey="pm10"
            stroke="#ef4444"
            fill="url(#pm10Gradient)"
            strokeWidth={2.5}
            dot={false}
          />

          {/* PM2.5 */}
          <Area
            type="monotone"
            dataKey="pm25"
            stroke="#22c55e"
            fill="url(#pm25Gradient)"
            strokeWidth={2.5}
            dot={false}
          />
        </AreaChart>
      </div>

      {/* Custom Legend (clean UI like your screenshot) */}
      <div className="custom-legend">
        <span style={{ color: "#ef4444" }}>• pm10</span>
        <span style={{ color: "#22c55e" }}>• pm25</span>
      </div>
    </div>
  );
}

export default AirQualityChart;