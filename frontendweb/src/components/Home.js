import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';

function Home(){
    const userContext = useContext(UserContext);

    return (
        <>
            <h1>Oblačno</h1>
            <p>16 stopinj celzij</p>
            <p>20% možnost dežja</p>
        </>
    );
}

export default Home;