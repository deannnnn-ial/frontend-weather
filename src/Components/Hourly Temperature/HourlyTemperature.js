import React, { useEffect, useState } from "react";

export function HourlyTemperature() {
  const [hourlyData, setHourlyData] = useState([]); // keeps hourly forecast data
  const [city, setCity] = useState(""); // keeps city name
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(""); // used for error message

  //fetches hourly  data
  const fetchHourlyData = async (lat, lon) => {
    try {
      const response = await fetch(`/hourlyCall?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        const errorDetails = await response.text(); // takes error response details
        console.error("Fetching data error:", errorDetails);
        throw new Error("Fetching hourly weather data");
      }

      const data = await response.json();
      console.log("Fetched Hourly Data:", data);

      if (data.hourly) {
        setHourlyData(data.hourly.slice(0, 12));//takes data passed and slices it into 12 for first 12 elements
      } else {
        throw new Error("Hourly forecast not available");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false); // loads either way
    }
  };
  useEffect(() => {
    const lat = sessionStorage.getItem("lat");
    const lon = sessionStorage.getItem("lon");
    const cityName = sessionStorage.getItem("name");

    console.log("Lat:", lat, "Lon:", lon, "City:", cityName); // used this to debug

    if (lat && lon) {
      setCity(cityName || "Unknown Location");
      fetchHourlyData(lat, lon); // fetches lattitude and longitude
    } else {
      setError("Missing latitude or longitude in session storage");
      setLoading(false); // stops the loading
    }
  }, []);

  // manually formatted the time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000); //
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;//formats the minutes
    const period = hours >= 12 ? "PM" : "AM";//if greater than/equal to 12 pm, else am

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>; // error message
  }

  return (//grid view to display
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>12-Hour Forecast for {city}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}> 
        {hourlyData.map((hour, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
              textAlign: "center",
            }}
          >
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
