const getWeatherEmoji = (temp, precip) => {
  if (precip > 0) return "🌧️";
  if (temp <= 15) return "❄️";
  if (temp <= 25) return "🌤️";
  return "☀️";
};

const TodayTimeline = ({ hourly, currentDate }) => {
  const now = new Date();

  const todayData =
    hourly?.time
      ?.map((time, index) => ({
        fullTime: time,
        hour: new Date(time).getHours(),
        temp: hourly.temperature_2m[index],
        precip: hourly.precipitation[index],
      }))
      .filter((item) => {
        const itemDate = item.fullTime.split("T")[0];
        return itemDate === currentDate;
      }) || [];

  const currentHour = new Date().getHours();

  return (
    <div className="timeline-container">
      <div className="timeline-row">
        {todayData.map((item, i) => (
          <div
            key={i}
            className={`timeline-card ${item.hour === currentHour ? "active" : ""}`}
          >
            <p className="time">{item.hour}:00</p>

            <p className="emoji">{getWeatherEmoji(item.temp, item.precip)}</p>

            <p className="temp">{Math.round(item.temp)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayTimeline;
