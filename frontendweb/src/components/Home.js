import { useEffect, useState, useRef, useContext } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { UserContext } from '../userContext';

function Home(){
    const [weather, setWeather] = useState(null);
    const { user } = useContext(UserContext);
    let chartRef = useRef(null);
    let chartInstance = useRef(null);
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [city, setCity] = useState("");
    const [cityName, setCityName] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLat(latitude);
                setLong(longitude);

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
                    setCityName("");
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

    useEffect(() => {
        if (weather && weather.daily) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
            let ctx = chartRef.current.getContext('2d');
    
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: weather.hourly.slice(0, 24).map((_, i) => `${i + 1} h`),
                    datasets: [{
                        label: 'Temperature',
                        data: weather.hourly.slice(0, 24).map(d => d.temp - 273.15),
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Temperature over the next 24 hours'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: function(value, index, values) {
                                    return  value + '°C';
                                }
                            }
                        }]
                    }
                }
            });
        }
    }, [weather]);

    const handleSearch = (event) => {
        event.preventDefault();
    
        fetch(`https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=ce191d9d40c548219acda46a66904290`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const lat1 = data.features[0].geometry.coordinates[1];
            const long1 = data.features[0].geometry.coordinates[0];
            setLat(lat1);
            setLong(long1);
            return fetch(`http://api.openweathermap.org/data/3.0/onecall?lat=${lat1}&lon=${long1}&appid=a079118662ea266c81754b94e99980ab`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            setWeather(data);
            setCityName(city + ":");
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation: ', error);
        });
    };

    async function handleFavourite(e){
        e.preventDefault();
        if (!cityName) {
            console.log('City name is not set. Cannot handle favourite.');
            return;
        }
        const res = await fetch("http://164.8.222.5:3000/users/favourite", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lat: lat,
                long: long,
                city: cityName
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            window.location.href="/";
        }
    }

    const canvasStyle = {
        width: '600px'
    };

    return (
        <>
            {user && (
                <form onSubmit={handleSearch}>
                    <input type="text" placeholder="Search city" value={city} onChange={e => setCity(e.target.value)} />
                    <button type="submit">Search</button>
                    <button type="button" onClick={handleFavourite}>Favourite</button>
                </form>
            )}
            <h1>{cityName}</h1>
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
                <h1>Temperature over the next 24 hours</h1>
                <div style={canvasStyle}>
                    <canvas ref={chartRef} />
                </div>
            </>
             )}
        </>
    );
}

export default Home;