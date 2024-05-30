import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/Header';
import { useAuth } from '../contexts/AuthContext';
import '../styles/VideoPlayer.scss';

const VideoPlayer = () => {
    const { fileName } = useParams();
    const { user, supabase } = useAuth();
    const [videoUrl, setVideoUrl] = useState('');
    const [initialTime, setInitialTime] = useState(0);
    const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
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

    useEffect(() => {
        const fetchWatchHistory = async () => {
            try {
                const { data: existingRecord, error } = await supabase
                    .from('video_views')
                    .select('time_watched')
                    .eq('user_id', user.id)
                    .eq('video_id', fileName)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    throw error;
                }

                if (existingRecord) {
                    console.log(`Found existing watch time: ${existingRecord.time_watched} seconds`);
                    setInitialTime(existingRecord.time_watched);
                }
            } catch (error) {
                console.error('Error fetching watch history:', error);
            }
        };

        if (user) {
            fetchWatchHistory();
        }
    }, [user, fileName, supabase]);

    useEffect(() => {
        const handleLoadedMetadata = () => {
            if (videoRef.current && initialTime > 0) {
                console.log(`Setting video currentTime to: ${initialTime} seconds`);
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
            const roundedTime = Math.round(currentTime);
            try {
                const { data: existingRecord, error } = await supabase
                    .from('video_views')
                    .select('time_watched')
                    .eq('user_id', user.id)
                    .eq('video_id', fileName)
                    .single();

                if (error && error.code !== 'PGRST116') { // Ignore no rows found error
                    throw error;
                }

                if (existingRecord) {
                    const { data, error: updateError } = await supabase
                        .from('video_views')
                        .update({ time_watched: roundedTime })
                        .eq('user_id', user.id)
                        .eq('video_id', fileName);

                    if (updateError) {
                        console.error('Error updating time watched:', updateError.message);
                    } else {
                        console.log(`Updated time watched: ${roundedTime} seconds`);
                    }
                } else {
                    const { data, error: insertError } = await supabase
                        .from('video_views')
                        .insert({ user_id: user.id, video_id: fileName, time_watched: roundedTime });

                    if (insertError) {
                        console.error('Error inserting time watched:', insertError.message);
                    } else {
                        console.log(`Inserted new watch record: ${roundedTime} seconds`);
                    }
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
            if (videoRef.current) {
                const finalTime = videoRef.current.currentTime;
                if (user && finalTime > 0) {
                    logTimeWatched(finalTime);
                }
            }
        };
    }, [videoUrl, user, fileName, supabase, isMetadataLoaded]);

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
