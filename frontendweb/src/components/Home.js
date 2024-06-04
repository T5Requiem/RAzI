import { useEffect, useState } from 'react';

function Home(){
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                fetch(`http://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=a079118662ea266c81754b94e99980ab`)
                .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
                })
                .then(data => {
                    console.log(data);
                    setWeather(data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation: ', error);
                });
            }, (error) => {
                console.error("Error Code = " + error.code + " - " + error.message);
            });
        }
    }, []);

    let tempCelsius = 0;
    let tempCelsiusDay = 0;
    let tempCelsiusNight = 0;
    let tempCelsiusMin = 0;
    let tempCelsiusMax = 0;
    let sunriseDate, sunriseHours, sunriseMinutes, sunriseStr;
    let sunsetDate, sunsetHours, sunsetMinutes, sunsetStr;
    let iconUrlCurrent, iconUrlDaily;

    if (weather && weather.current && weather.daily) {
        tempCelsius = weather.current.temp - 273.15;
        tempCelsiusDay = weather.daily[0].temp.day - 273.15;
        tempCelsiusNight = weather.daily[0].temp.night - 273.15;
        tempCelsiusMin = weather.daily[0].temp.min - 273.15;
        tempCelsiusMax = weather.daily[0].temp.max - 273.15;

        sunriseDate = new Date(weather.daily[0].sunrise * 1000);
        sunriseHours = sunriseDate.getHours();
        sunriseMinutes = "0" + sunriseDate.getMinutes();

        sunsetDate = new Date(weather.daily[0].sunset * 1000);
        sunsetHours = sunsetDate.getHours();
        sunsetMinutes = "0" + sunsetDate.getMinutes();

        sunriseStr = sunriseHours + ':' + sunriseMinutes.substr(-2);
        sunsetStr = sunsetHours + ':' + sunsetMinutes.substr(-2);

        iconUrlCurrent = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`;
        iconUrlDaily = `http://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}.png`;
    }

    return (
        <>
            <h1>Current weather</h1>
            {weather && weather.current && (
            <>
                <img src={iconUrlCurrent} alt="Weather icon" />
                <p>Description: {weather.current.weather[0].description}</p>
                <p>Temperature: {tempCelsius.toFixed(2)} °C</p>
                <p>Pressure: {weather.current.pressure} mb</p>
                <p>Humidity: {weather.current.humidity} %</p>
                <p>Wind speed: {weather.current.wind_speed} km/h</p>
            </>
             )}
            <h1>Weather today</h1>
            {weather && weather.daily && (
            <>
                <img src={iconUrlDaily} alt="Weather icon" />
                <p>Description: {weather.daily[0].weather[0].description}</p>
                <p>Temperature day: {tempCelsiusDay.toFixed(2)} °C</p>
                <p>Temperature night: {tempCelsiusNight.toFixed(2)} °C</p>
                <p>Temperature min: {tempCelsiusMin.toFixed(2)} °C</p>
                <p>Temperature max: {tempCelsiusMax.toFixed(2)} °C</p>
                <p>Sunrise: {sunriseStr}</p>
                <p>Sunset: {sunsetStr}</p>
                <p>Humidity: {weather.daily[0].humidity} %</p>
                <p>Wind speed: {weather.daily[0].wind_speed} km/h</p>
            </>
             )}
        </>
    );
}

export default Home;