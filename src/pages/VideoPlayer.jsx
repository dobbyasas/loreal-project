import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Header from '../Components/Header';
import '../styles/VideoPlayer.scss';

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
        <div className="video-player-container">
            <Header />
            {videoUrl ? (
                <video
                    controls
                    src={videoUrl}
                    controlsList="nodownload"
                    style={{ width: '100%' }}
                >
                    Váš prohlížeč nedovoluje přehrávat vložené videa, použijte jiný prohlížeč.
                </video>
            ) : (
                <p>Načítám vide...</p>
            )}
        </div>
    );
};

export default VideoPlayer;
