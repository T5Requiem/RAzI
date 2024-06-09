import React, { useContext, useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import UserContext from '../userContext';
import Home from './Home.js';

function IndexScreen({ navigation }) {
    const userContext = useContext(UserContext);
    const [refreshKey, setRefreshKey] = useState(0);
  
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setRefreshKey(prevKey => prevKey + 1);
      });
  
      return unsubscribe;
    }, [navigation]);
  
    return (
      <View>
        {userContext.user ? (
          <>
            <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
            <Button title="Logout" onPress={() => navigation.navigate('Logout')} />
            <Home key={refreshKey}/>
          </>
        ) : (
          <>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
            <Home key={refreshKey}/>
          </>
        )}
      </View>
    );
  }
  
  export default IndexScreen;