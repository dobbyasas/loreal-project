import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Videos.scss';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('data/video.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setVideos(data))
            .catch(error => console.error('Error loading the videos data:', error));
    }, []);

    const handleVideoClick = (fileName) => {
        navigate(`/video/${encodeURIComponent(fileName)}`);
    };

    return (
        <div className="video-gallery">
            {videos.map(video => (
                <div className="video-item" key={video.id} onClick={() => handleVideoClick(video.fileName)}>
                    <img src={video.thumbnail} alt={`Thumbnail for ${video.customName}`} />
                    <p>{video.customName}</p>
                </div>
            ))}
        </div>
    );
};

export default Videos;
