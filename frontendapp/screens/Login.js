import React, { useContext, useState } from 'react';
import UserContext from '../userContext';
import { Button, TextInput, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);
    const navigation = useNavigation();

    async function handleLogin() {
        const res = await fetch("http://164.8.222.5:3000/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if (data._id !== undefined) {
            userContext.setUser(data);
            navigation.navigate('Header');
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
        <View>
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
            <Button title="Log in" onPress={handleLogin} />
            {error ? <Text>{error}</Text> : null}
        </View>
    );
}

export default Login;