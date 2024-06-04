import { useEffect, useState } from 'react';

function Home(){
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                fetch(`http://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=a079118662ea266c81754b94e99980ab`)
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

    let tempCelsius;
    if (weather && weather.current) {
        tempCelsius = weather.current.temp - 273.15;
    }

    return (
        <>
            {weather && weather.current && <p>Current temperature: {tempCelsius.toFixed(2)} °C</p>}
            {weather && weather.current && weather.current.weather && <p>Weather: {weather.current.weather[0].description}</p>}
        </>
    );
}

export default Home;