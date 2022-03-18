import React, { useEffect, useState } from "react";
import CityList from "./data/city.list.json";

const App = () => {

  const open_weather_map_api_key = 'fb408b9eb91def338e8eddc478ad73bf';

  const [cities, setCities] = useState();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState();
  const [weatherVisuals, setWeatherVisuals] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    console.log(e.target.value);
    setCity(e.target.value)
  }

  const getCurrentWeather = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${open_weather_map_api_key}`)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        exctractVisualDetails(data)
        setWeather(data)
      })
      .catch(err => console.log(err));
  }

  const exctractVisualDetails = (weatherData) => {
    const weatherVisuals = weatherData.weather[0];
    setWeatherVisuals(weatherVisuals);
  }

  useEffect(() => {
    if (city) {
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${open_weather_map_api_key}`)
        .then(response => response.json())
        .then(data => {
          // console.log(data)
          setCities(data)
        })
        .catch(err => console.log(err));
    } else {
      setCities();
    }
  }, [city]);

  return (
    <React.Fragment>
      <Header />
      <section>
        <nav>
          {/* <input type="text" value={city} placeholder="Enter City Name" onChange={handleChange} /> */}

          <input type="text" placeholder="seach..." onChange={e => setSearchTerm(e.target.value)} />

          {CityList.stream().filter((val) => {
            if (searchTerm == "") {
              return val
            }
            else if (val.first_name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return val;
            }
          }).map((val, key) => {
            return <div>{val.first_name} </div>
          })}
          {/* <ul>
            {cities && cities.map((city, index) => (
              <li key={index}>
                <button type="button" onClick={() => getCurrentWeather(city.lat, city.lon)}>{city.name}, {city.state}, {city.country}</button>
              </li>
            ))}
          </ul> */}
        </nav>
        <article>
          <h1>{weather && `${weather.name}, ${weather.sys.country}`}</h1>
          {weatherVisuals && <img alt="weather icon" title={weatherVisuals.description} src={`https://openweathermap.org/img/wn/${weatherVisuals.icon}.png`}></img>}
          <p>{weather && `The temperature in ${weather.name} is ${weather.main.temp}°C  but feels like ${weather.main.feels_like}°C`}</p>
          {weather && <table>
            <thead>
              <tr>
                <th>Wind Speed</th>
                <th>Humidity</th>
                <th>Min Temp</th>
                <th>Max Temp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{weather && `${weather.wind.speed} m/s`}</td>
                <td>{weather && `${weather.main.humidity} %`}</td>
                <td>{weather && `${weather.main.temp_min} °C`}</td>
                <td>{weather && `${weather.main.temp_max} °C`}</td>
              </tr>
            </tbody>
          </table>}
        </article>
      </section>
      <Footer />
    </React.Fragment>
  );
}

const Header = () => {
  return (
    <header>
      <h1>Weather App</h1>
    </header>
  )
}

const Footer = () => {
  return (
    <footer>
      <p>Next Gen HQ &copy; 2020</p>
    </footer>
  )
}

export default App;
