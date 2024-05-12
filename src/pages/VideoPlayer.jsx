import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Header from '../Components/Header';

const VideoPlayer = () => {
    const { fileName } = useParams();
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        // Fetch the video details from the JSON file
        fetch('/data/video.json')
            .then(response => response.json())
            .then(data => {
                const video = data.find(v => v.fileName === fileName);
                if (video && video.url) {
                    setVideoUrl(video.url);
                } else {
                    console.log("Video not found or no URL available");
                }
            })
            .catch(error => console.error('Error loading video data:', error));
    }, [fileName]);

    return (
        <div>
          <Header/>
            {videoUrl ? (
                <video controls src={videoUrl} style={{ width: '100%' }}>
                    Sorry, your browser does not support embedded videos.
                </video>
            ) : (
                <p>Loading video...</p>
            )}
        </div>
    );
};

export default VideoPlayer;
