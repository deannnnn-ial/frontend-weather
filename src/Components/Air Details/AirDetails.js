export function AirDetails() {
  const humidity = sessionStorage.getItem("humidity");
  const windSpeed = sessionStorage.getItem("wind-speed");

  return (
    <div id="AirDetails">
      <h2>Air Details</h2>
      <p>Humidity: {humidity}%</p>
      <p>Wind Speed: {windSpeed} m/s</p>
    </div>
  );
}
