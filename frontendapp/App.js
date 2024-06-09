import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import UserContext from './userContext.js';

import HeaderScreen from './screens/Header.js';
import ProfileScreen from './screens/Profile.js';
import LogoutScreen from './screens/Logout.js';
import LoginScreen from './screens/Login.js';
import RegisterScreen from './screens/Register.js';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  return (
      <UserContext.Provider value={{ user, setUser }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Header">
            <Stack.Screen name="Header" component={HeaderScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Logout" component={LogoutScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});