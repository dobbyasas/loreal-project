import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import '../styles/VideoPlayer.scss';

const VideoPlayer = () => {
    const { fileName } = useParams();
    const { user } = useAuth();
    const [videoUrl, setVideoUrl] = useState('');
    const [initialTime, setInitialTime] = useState(0);
    const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
    const videoRef = useRef(null);
    const lastLoggedTime = useRef(0);

    useEffect(() => {
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

            try {
                const { data: existingRecord, error } = await supabase
                    .from('video_views')
                    .select('time_watched')
                    .eq('user_id', user.id)
                    .eq('video_id', fileName)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching watch history:', error);
                    return;
                }

                if (existingRecord) {
                    setInitialTime(existingRecord.time_watched);
                    lastLoggedTime.current = existingRecord.time_watched;
                }
            } catch (error) {
                console.error('Error fetching watch history:', error);
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
            setIsMetadataLoaded(true);
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
        let interval;

        const logTimeWatched = async (currentTime) => {
            if (!user) return;
            const roundedTime = Math.round(currentTime);
            const timeDifference = roundedTime - lastLoggedTime.current;
            lastLoggedTime.current = roundedTime;

            try {
                const { data: existingRecord, error: selectError } = await supabase
                    .from('video_views')
                    .select('time_watched')
                    .eq('user_id', user.id)
                    .eq('video_id', fileName)
                    .single();

                if (selectError && selectError.code !== 'PGRST116') {
                    console.error('Error selecting existing record:', selectError);
                    return;
                }

                if (existingRecord) {
                    const newTimeWatched = existingRecord.time_watched + timeDifference;
                    const { error: updateError } = await supabase
                        .from('video_views')
                        .update({ time_watched: newTimeWatched })
                        .eq('user_id', user.id)
                        .eq('video_id', fileName);

                    if (updateError) {
                        console.error('Error updating time watched:', updateError.message);
                    }
                } else {
                    await supabase
                        .from('video_views')
                        .insert({ user_id: user.id, video_id: fileName, time_watched: timeDifference });
                }
            } catch (error) {
                console.error('Error logging time watched:', error);
            }
        };

        if (videoUrl && user && isMetadataLoaded) {
            interval = setInterval(() => {
                if (videoRef.current) {
                    const currentTime = videoRef.current.currentTime;
                    logTimeWatched(currentTime);
                }
            }, 10000);
        }

        return () => {
            clearInterval(interval);
            const videoElement = videoRef.current;
            if (videoElement) {
                const finalTime = videoElement.currentTime;
                if (user && finalTime > 0) {
                    logTimeWatched(finalTime);
                }
            }
        };
    }, [videoUrl, user, fileName, isMetadataLoaded]);

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
                    Váš prohlížeč nedovoluje přehrávat vložené videa, použijte jiný prohlížeč.
                </video>
            ) : (
                <p>Načítám video...</p>
            )}
        </div>
    );
};

export default VideoPlayer;
