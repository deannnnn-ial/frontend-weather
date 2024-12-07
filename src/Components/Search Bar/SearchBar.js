import './SearchBar.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export function SearchBar() {
    const [locations, setLocations] = useState(null);
    const Navigate = useNavigate();
    //handle data input 
    const handleInput = (value) => {
        //find locations using the input
        fetch(`/api?input=${value}`)
            .then((response) => {
                if (!response.ok) throw new Error('Error fetching data');
                return response.json();
            })
            .then((response) => { //use the data //
                if (Object.values(response) !== 0) {
                    setLocations(Object.values(response));
                }
            })

    };

    //when the search bar text value is changed
    const onInput = (value) => {
        if (value.trim() !== "") { // Changed to trim whitespace from the input
            handleInput(value);
        }
    }

    function cityClicked(location) {
        fetch(`/weatherCall?lat=${location.lat}&lon=${location.lon}`)
            .then((response) => {
                if (!response.ok) throw new Error('Error fetching data');
                return response.json();
            })
            .then((response) => {
                sessionStorage.setItem("name", response.name);
                sessionStorage.setItem("temperature", response.main.temp);
                sessionStorage.setItem("feels-like", response.main.feels_like);
                sessionStorage.setItem("desc", response.weather[0].description);
                sessionStorage.setItem("humidity", response.main.humidity);
                sessionStorage.setItem("wind-speed", response.wind.speed);
                sessionStorage.setItem("sunrise", response.sys.sunrise);
                sessionStorage.setItem("sunset", response.sys.sunset);
                sessionStorage.setItem("lat", location.lat);
                sessionStorage.setItem("lon", location.lon);
                
                Navigate('/weather-details');
            });
    }

    return (
        <div className="SearchBarDiv">
            <h1 className="Header">Search for weather details in your area!</h1>
            <p id="Header"></p>
            <input
                type="text"
                id="SearchBar"
                onInput={() => onInput(document.getElementById("SearchBar").value)}
            /> <br />

            {locations && (
                <div>
                    {locations.map((location, index) => ( // Changed "locations" to "location" in map function
                        <div key={index}> {/* Added key prop */}
                            <p onClick={() => cityClicked(location)}>
                                {location.name + ", " + location.state + ", " + location.country}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
