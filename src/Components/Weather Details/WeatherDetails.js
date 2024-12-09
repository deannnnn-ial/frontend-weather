import { useNavigate } from "react-router-dom";
import '../../styles.css';

export function WeatherDetails() {
  const navigate = useNavigate();
  const goToAirDetails = () => {
    navigate("/airdetails");
  };
  const goToHourlyTemp = () => {
    navigate("/hourlytemperature");
  };
  let name = sessionStorage.getItem("name");
  let temp = sessionStorage.getItem("temperature");
  let feelsLike = sessionStorage.getItem("feels-like");
  let desc = sessionStorage.getItem("desc");
  let humidity = sessionStorage.getItem("humidity");
  let windSpeed = sessionStorage.getItem("wind-speed");
  let sunrise = sessionStorage.getItem("sunrise");
  let sunset = sessionStorage.getItem("sunset");

  //sunrise time
  let sunriseDate = new Date(sunrise * 1000);
  let minutesSunrise = sunriseDate.getMinutes().toString();
  if (minutesSunrise.length === 2) {
    minutesSunrise = sunriseDate.getMinutes();
  } else if (minutesSunrise.length === 1) {
    minutesSunrise = "0" + sunriseDate.getMinutes();
  }

  let hours = sunriseDate.getHours() + 5;
  if (hours > 24) {
    hours -= 24;
  } else if (hours === 24) {
    hours = 12;
  }
  sunrise = hours + ":" + minutesSunrise;
  if (hours > 12) {
    hours = hours - 12;
    sunrise = hours + ":" + minutesSunrise + " PM (UTC)";
  } else {
    sunrise += " AM (UTC)";
  }

  let sunsetDate = new Date(sunset * 1000);
  let minutesSunset = sunsetDate.getMinutes().toString();
  if (minutesSunset.length === 2) {
    minutesSunset = sunsetDate.getMinutes();
  } else if (minutesSunset.length === 1) {
    minutesSunset = "0" + sunsetDate.getMinutes();
  }
  let hoursSunset = sunsetDate.getHours() + 5;
  if (hoursSunset > 24) {
    hoursSunset -= 24;
  } else if (hoursSunset === 24) {
    hoursSunset = 12;
  }
  if (hoursSunset > 12) {
    hoursSunset = hoursSunset - 12;
    sunset = hoursSunset + ":" + minutesSunset + " PM (UTC)";
  } else {
    sunset = hoursSunset + ":" + minutesSunset + " AM (UTC)";
  }

  function convert() {
    if (document.getElementById("temp").innerHTML.includes("(F)")) {
      let tempC = (temp - 32) * (5 / 9);
      tempC = tempC.toFixed(2);
      let feelsLikeC = (feelsLike - 32) * (5 / 9);
      feelsLikeC = feelsLikeC.toFixed(2);
      document.getElementById("temp").innerHTML =
        "temperature (C): " + tempC + "°";
      document.getElementById("feelsLike").innerHTML =
        "feels like (C): " + feelsLikeC + "°";
    } else {
      document.getElementById("temp").innerHTML =
        "temperature (F): " + temp + "°";
      document.getElementById("feelsLike").innerHTML =
        "feels like (F): " + feelsLike + "°";
    }
  }

  return (
    <div id="WeatherDetails">
      <h2>Weather Details for {name}:</h2>
      <p id="temp"> temperature (F): {temp}°</p>
      <p id="feelsLike">feels like (F): {feelsLike}°</p>
      <p>description: {desc}</p>
      <p>humidity: {humidity}</p>
      <p>wind speed: {windSpeed}</p>
      <p>sunrise: {sunrise}</p>
      <p>sunset: {sunset}</p> <br />
      <input
        type="button"
        value="convert temperature unit"
        onClick={() => convert()}
      ></input>
      <button onClick={goToAirDetails} style={{ marginTop: "10px" }}>
        View Air Details {/* New button for navigating to Air Details */}
      </button>
      <button onClick={goToHourlyTemp} style={{ marginTop: "10px" }}>
        View Hourly Forecast
      </button>
    </div>
  );
}
