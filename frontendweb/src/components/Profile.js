import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Profile(){
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});

    useEffect(function(){
        const getProfile = async function(){
            const res = await fetch("http://164.8.222.5:3000/users/profile", {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userID: userContext.user
                })
            });
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, [userContext.user]);

    return (
        <>
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            <h1>User profile</h1>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
        </>
    );
}

export default Profile;