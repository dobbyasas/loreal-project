import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Videos.scss';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Fetching video data from data/video.json...');
        fetch('data/video.json')
            .then(response => {
                console.log('Received response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Parsed video data:', data);
                setVideos(data);
            })
            .catch(error => console.error('Error loading the videos data:', error));
    }, []);

    const handleVideoClick = (fileName) => {
        console.log('Video clicked:', fileName);
        navigate(`/video/${encodeURIComponent(fileName)}`);
    };

    return (
        <div className="video-gallery">
            {videos.length > 0 ? (
                videos.map(video => (
                    <div className="video-item" key={video.id} onClick={() => handleVideoClick(video.fileName)}>
                        <img src={video.thumbnail} alt={`Thumbnail for ${video.customName}`} />
                        <p>{video.customName}</p>
                    </div>
                ))
            ) : (
                <p>No videos available</p>
            )}
        </div>
    );
};

export default Videos;
