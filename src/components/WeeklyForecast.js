import { useNavigate } from "react-router-dom";

const WeeklyForecast = ({ daily, selectedDayIndex, setSelectedDayIndex }) => {
  const navigate = useNavigate();

  return (
    <div className="weekly-container">

      <div className="weekly-row">
        {daily.time.slice(0, 7).map((day, i) => (
          <div
            key={i}
            className={`day-card ${selectedDayIndex === i ? "active" : ""}`}
            onClick={() => setSelectedDayIndex(i)}
          >
            <p>
              {new Date(day).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </p>

            <p>{Math.round(daily.temperature_2m_max[i])}°</p>
          </div>
        ))}
      </div>

      <button className="view-more" onClick={() => navigate("/history")}>
        View More →
      </button>
    </div>
  );
};

export default WeeklyForecast;