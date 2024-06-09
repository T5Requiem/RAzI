import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../userContext';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Profile() {
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const getProfile = async () => {
            const res = await fetch("http://164.8.222.5:3000/users/profile", {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userID: userContext.user
                })
            });
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    if (!userContext.user) {
        navigation.navigate('Login');
        return null;
    }

    return (
        <View>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>User profile</Text>
            <Text>Username: {profile.username}</Text>
            <Text>Email: {profile.email}</Text>
        </View>
    );
}

export default Profile;