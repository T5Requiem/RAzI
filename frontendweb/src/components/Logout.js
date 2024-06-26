import { useEffect, useContext } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Logout(){
    const userContext = useContext(UserContext); 
    useEffect(function(){
        const logout = async function(){
            userContext.setUserContext(null);
            await fetch("http://164.8.222.5:3000/users/logout");
        }
        logout();
    }, [userContext]);

    return (
        <Navigate replace to="/" />
    );
}

export default Logout;