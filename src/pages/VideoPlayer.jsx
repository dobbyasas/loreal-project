import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/Header';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import '../styles/VideoPlayer.scss';

const VideoPlayer = () => {
    const { fileName } = useParams();
    const { user } = useAuth();
    const [videoUrl, setVideoUrl] = useState('');
    const [initialTime, setInitialTime] = useState(0);
    const videoRef = useRef(null);
    const lastLoggedTime = useRef(0);
    const intervalRef = useRef(null);  // Ref to store the interval ID

    useEffect(() => {
        // Fetch video URL from a JSON file or another source
        fetch('/data/video.json')
            .then(response => response.json())
            .then(data => {
                const video = data.find(v => v.fileName === fileName);
                if (video && video.url) {
                    setVideoUrl(video.url);
                }
            })
            .catch(error => console.error('Error loading video data:', error));
    }, [fileName]);

    useEffect(() => {
        const fetchWatchHistory = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from('video_views')
                .select('time_watched')
                .eq('user_id', user.id)
                .eq('video_id', fileName)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching watch history:', error);
            } else if (data) {
                setInitialTime(data.time_watched);
                lastLoggedTime.current = data.time_watched;
            }
        };

        if (user) {
            fetchWatchHistory();
        }
    }, [user, fileName]);

    useEffect(() => {
        const handleLoadedMetadata = () => {
            if (videoRef.current && initialTime > 0) {
                videoRef.current.currentTime = initialTime;
            }
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [initialTime]);

    useEffect(() => {
        const logTimeWatched = async (currentTime) => {
            if (!user) return;

            const roundedTime = Math.round(currentTime);
            lastLoggedTime.current = roundedTime;

            const { data, error } = await supabase
                .from('video_views')
                .upsert({
                    user_id: user.id,
                    video_id: fileName,
                    time_watched: roundedTime,
                    updated_at: new Date().toISOString(),
                }, { onConflict: ['user_id', 'video_id'] });

            if (error) {
                console.error('Error logging time watched:', error);
            } else {
                console.log('Time watched record upserted successfully:', data);
            }
        };

        if (videoUrl && user) {
            // Clear any existing interval before setting a new one
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            intervalRef.current = setInterval(() => {
                if (videoRef.current) {
                    logTimeWatched(videoRef.current.currentTime);
                }
            }, 10000);
        }

        // Cleanup interval on component unmount or when video changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            const videoElement = videoRef.current;
            if (videoElement && videoElement.currentTime > 0) {
                logTimeWatched(videoElement.currentTime);
            }
        };
    }, [videoUrl, user, fileName]);

    return (
        <div className="video-player-container">
            <Header />
            {videoUrl ? (
                <video
                    ref={videoRef}
                    controls
                    src={videoUrl}
                    controlsList="nodownload"
                    preload="metadata"
                    style={{ width: '100%' }}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>Loading video...</p>
            )}
        </div>
    );
};

export default VideoPlayer;
