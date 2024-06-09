import { useEffect, useContext } from 'react';
import UserContext from '../userContext';
import { useNavigation } from '@react-navigation/native';

function Logout() {
    const userContext = useContext(UserContext);
    const navigation = useNavigation();

    useEffect(function () {
        const logout = async function () {
            userContext.setUser(null);
            await fetch("http://164.8.222.5:3000/users/logout");
            navigation.reset({
                index: 0,
                routes: [{ name: 'Weather App' }],
            });
        }
        logout();
    }, [userContext, navigation]);

    return null;
}

export default Logout;