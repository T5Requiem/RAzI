import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import UserContext from '../userContext';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

function Home(){
    const [weather, setWeather] = useState(null);
    const { user } = useContext(UserContext);

    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [city, setCity] = useState("");
    const [cityName, setCityName] = useState("");
    const [favourites, setFavourites] = useState([]);
    const [workout, setWorkout] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
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
        })();
        if (user) {
            fetch("http://164.8.222.5:3000/users/favourites", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userID: user
                })
            })
            .then(response => response.json())
            .then(data => setFavourites(data))
            .catch(error => console.error('There was a problem with the fetch operation: ', error));
        }
    }, [user]);

    let tempCelsius = 0;
    let tempCelsiusDay = 0;
    let tempCelsiusNight = 0;
    let tempCelsiusMin = 0;
    let tempCelsiusMax = 0;
    let sunriseDate, sunriseHours, sunriseMinutes, sunriseStr;
    let sunsetDate, sunsetHours, sunsetMinutes, sunsetStr;
    let iconUrlCurrent, iconUrlDaily;
    let weatherIcon, weatherDesc;

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

        weatherIcon = weather.current.weather[0].icon;
        iconUrlCurrent = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`;
        iconUrlDaily = `http://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}.png`;
    }

    useEffect(() => {
        if (weather && weather.current) {
            if(weatherIcon === "09d" || weatherIcon === "09n" || weatherIcon === "10d" || weatherIcon === "10n"){
                weatherDesc = "precipitation";
            }
            else if(weatherIcon === "11d" || weatherIcon === "11n" || weatherIcon === "13d" || weatherIcon === "13n") {
                weatherDesc = "storm or snow";
            }
            else {
                weatherDesc = "no precipitation";
            }
            fetch("http://164.8.222.5:3000/workouts/workout", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    weatherDesc: weatherDesc
                })
            })
            .then(response => response.json())
            .then(data => setWorkout(data))
            .catch(error => console.error('There was a problem with the fetch operation: ', error));
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
            setWeather(data);
            setCityName(city);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation: ', error);
        });
    };

    async function handleCityClick(cityName1) {
        fetch(`https://api.geoapify.com/v1/geocode/search?text=${cityName1}&apiKey=ce191d9d40c548219acda46a66904290`)
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
            setWeather(data);
            setCityName(cityName1);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation: ', error);
        });
    }

    async function handleFavourite(e){
        e.preventDefault();
        if (!cityName) {
            console.log('City name is not set. Cannot handle favourite.');
            return;
        }
        const resFavourites = await fetch("http://164.8.222.5:3000/users/favourites", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userID: user
            })
        });

        const favourites1 = await resFavourites.json();
        if (favourites1.some(favourite => favourite.city === cityName)) {
            console.log('User already has this location as a favourite.');
            return;
        }
        const res = await fetch("http://164.8.222.5:3000/users/favourite", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userID: user,
                lat: lat,
                long: long,
                city: cityName
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            navigation.navigate('Weather App');
        }
    }

    const canvasStyle = {
        width: '600px'
    };

    return (
        <View>
            {favourites.map((favourite, index) => (
                <Text key={index} onPress={() => setCity(favourite.city, handleCityClick(favourite.city))}>
                    {favourite.city}
                </Text>
            ))}
            {user && (
                <View>
                    <TextInput placeholder="Search city" value={city} onChangeText={setCity} />
                    <Button title="Search" onPress={handleSearch} />
                    <Button title="Favourite" onPress={handleFavourite} />
                </View>
            )}
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>Workout tips</Text>
            <Text>{workout && workout.workoutDesc}</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{cityName}</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Current weather</Text>
            {weather && weather.current && (
                <View>
                    <Image source={{ uri: iconUrlCurrent }} style={{width: 50, height: 50}}/>
                    <Text>Description: {weather.current.weather[0].description}</Text>
                    <Text>Temperature: {tempCelsius.toFixed(2)} °C</Text>
                    <Text>Pressure: {weather.current.pressure} mb</Text>
                    <Text>Humidity: {weather.current.humidity} %</Text>
                    <Text>Wind speed: {weather.current.wind_speed} km/h</Text>
                </View>
            )}
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Weather today</Text>
            {weather && weather.daily && (
            <View>
                <Image source={{ uri: iconUrlDaily }} style={{width: 50, height: 50}}/>
                <Text>Description: {weather.daily[0].weather[0].description}</Text>
                <Text>Temperature day: {tempCelsiusDay.toFixed(2)} °C</Text>
                <Text>Temperature night: {tempCelsiusNight.toFixed(2)} °C</Text>
                <Text>Temperature min: {tempCelsiusMin.toFixed(2)} °C</Text>
                <Text>Temperature max: {tempCelsiusMax.toFixed(2)} °C</Text>
                <Text>Sunrise: {sunriseStr}</Text>
                <Text>Sunset: {sunsetStr}</Text>
                <Text>Humidity: {weather.daily[0].humidity} %</Text>
                <Text>Wind speed: {weather.daily[0].wind_speed} km/h</Text>
            </View>
             )}
        </View>
    );
}

export default Home;