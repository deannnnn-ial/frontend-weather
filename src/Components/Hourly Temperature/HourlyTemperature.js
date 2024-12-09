import React, { useEffect, useState } from "react";
import "../../styles.css";

export function HourlyTemperature() {
  const [hourlyData, setHourlyData] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHourlyData = async (lat, lon) => {
    try {
      const response = await fetch(`https://backend-weather-1zts.onrender.com/hourlyCall?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Fetching data error:", errorDetails);
        throw new Error("Fetching hourly weather data");
      }

      const data = await response.json();
      if (data.hourly) {
        setHourlyData(data.hourly.slice(0, 12));
      } else {
        throw new Error("Hourly forecast not available");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lat = sessionStorage.getItem("lat");
    const lon = sessionStorage.getItem("lon");
    const cityName = sessionStorage.getItem("name");

    if (lat && lon) {
      setCity(cityName || "Unknown Location");
      fetchHourlyData(lat, lon);
    } else {
      setError("Missing latitude or longitude in session storage");
      setLoading(false);
    }
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const period = hours >= 12 ? "PM" : "AM";
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>12-Hour Forecast for {city}</h2>
      <div className="hourly-grid">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hourly-card">
            <p>
              <strong>Time:</strong> {formatTime(hour.dt)}
            </p>
            <p>
              <strong>Temp:</strong> {hour.temp}°F
            </p>
            <p>
              <strong>Condition:</strong> {hour.weather[0].description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}