import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Photo from './Photo';

function PhotoPage() {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const getPhoto = async () => {
            try {
                const res = await fetch(`http://localhost:3001/photos/${id}`);
                const data = await res.json();
                setPhoto(data);
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        }
        getPhoto();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            return;
        }
        try {
            const res = await fetch(`http://localhost:3001/photos/${id}/comments`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: comment }),
            });
            const data = await res.json();
            setPhoto(data);
            setComment('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h3>Photo:</h3>
            {photo ? <Photo photo={photo} /> : <div>Loading...</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" value={comment} onChange={e => setComment(e.target.value)} />
                <button type="submit">Add Comment</button>
            </form>
            {photo && photo.comments && photo.comments.map((comment, index) => (
                <div key={index}>
                    <strong><p>{comment.username}</p></strong>
                    <p>{comment.text}</p>
                </div>
            ))}
        </div>
    );
}

export default PhotoPage;