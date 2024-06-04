import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../userContext';
import { Link } from 'react-router-dom';

function LikePhoto(id, userId, setPhoto) {
    fetch(`http://localhost:3001/photos/${id}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetch(`http://localhost:3001/photos/${id}`)
            .then(response => response.json())
            .then(data => setPhoto(data));
    })
    .catch((error) => console.error('Error:', error));
}

function DislikePhoto(id, userId, setPhoto) {
    fetch(`http://localhost:3001/photos/${id}/dislike`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetch(`http://localhost:3001/photos/${id}`)
            .then(response => response.json())
            .then(data => setPhoto(data));
    })
    .catch((error) => console.error('Error:', error));
}

const Style = {
    maxWidth: '300px'
};

function Photo(props){
    const currentUser = useContext(UserContext);
    const [photo, setPhoto] = useState(props.photo);

    useEffect(() => {
        setPhoto(props.photo);
    }, [props.photo]);

    return (
        <div className="card text-dark mb-2" style={Style}>
            <h5 className="card-title">{photo.name}</h5>
            <Link to={`/${photo._id}`}>
                <img className="card-img" src={"http://localhost:3001/"+photo.path} alt={photo.name} style={Style}/>
            </Link>
            <text className="card-title">{photo.description}</text>
            <button className="btn btn-primary" onClick={() => LikePhoto(photo._id, currentUser._id, setPhoto)}>Like</button>
            <button className="btn btn-primary" onClick={() => DislikePhoto(photo._id, currentUser._id, setPhoto)}>Dislike</button>
            <p>Likes: {photo.likes.length - photo.dislikes.length}</p>
        </div>
    );
}

export default Photo;