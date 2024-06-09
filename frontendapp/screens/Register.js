import React, { useState } from 'react';
import { Button, TextInput, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigation = useNavigation();

    async function handleRegister() {
        const res = await fetch("http://164.8.222.5:3000/users/", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            navigation.navigate('Weather App');
        }
        else{
            setUsername("");
            setPassword("");
            setEmail("");
            setError("Registration failed");
        }
    }

    return(
        <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Register" onPress={handleRegister} />
            {error ? <Text>{error}</Text> : null}
        </View>
    );
}

export default Register;