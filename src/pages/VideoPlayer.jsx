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
    const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
    const videoRef = useRef(null);
    const lastLoggedTime = useRef(0);

    useEffect(() => {
        console.log('Fetching video data...');
        fetch('/data/video.json')
            .then(response => {
                console.log('Received response from video.json:', response);
                return response.json();
            })
            .then(data => {
                console.log('Parsed video data:', data);
                const video = data.find(v => v.fileName === fileName);
                if (video && video.url) {
                    console.log('Video URL found:', video.url);
                    setVideoUrl(video.url);
                } else {
                    console.log('Video not found or URL is missing');
                }
            })
            .catch(error => console.error('Error loading video data:', error));
    }, [fileName]);

    useEffect(() => {
        const fetchWatchHistory = async () => {
            if (!user) {
                console.log('No user logged in, skipping watch history fetch.');
                return;
            }

            console.log('Fetching watch history for user:', user.id);
            try {
                const { data: existingRecord, error } = await supabase
                    .from('video_views')
                    .select('time_watched')
                    .eq('user_id', user.id)
                    .eq('video_id', fileName)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') {
                        console.log('No existing watch record found.');
                    } else {
                        console.error('Error fetching watch history:', error);
                    }
                    return;
                }

                if (existingRecord) {
                    console.log('Existing watch history found:', existingRecord);
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
                console.log('Setting initial video time to:', initialTime);
                videoRef.current.currentTime = initialTime;
            } else {
                console.log('Metadata loaded, but initial time is 0 or videoRef is null.');
            }
            setIsMetadataLoaded(true);
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            console.log('Adding loadedmetadata event listener to video element.');
            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        return () => {
            if (videoElement) {
                console.log('Removing loadedmetadata event listener from video element.');
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
        
            console.log('Logging time watched:', {
                user_id: user.id,
                video_id: fileName,
                time_watched: roundedTime
            });
        
            try {
                const { data: existingRecord, error: selectError } = await supabase
                    .from('video_views')
                    .select('time_watched')
                    .eq('user_id', user.id)
                    .eq('video_id', fileName)
                    .single();
        
                if (selectError) {
                    if (selectError.code === 'PGRST116') {
                        console.log('No existing record found. Creating a new record.');
                    } else {
                        console.error('Error selecting existing record:', selectError);
                        return;
                    }
                }
        
                if (existingRecord) {
                    const newTimeWatched = existingRecord.time_watched + timeDifference;
                    console.log('Updating existing record with new time:', newTimeWatched);
                    const { error: updateError } = await supabase
                        .from('video_views')
                        .update({ time_watched: newTimeWatched })
                        .eq('user_id', user.id)
                        .eq('video_id', fileName);
        
                    if (updateError) {
                        console.error('Error updating time watched:', updateError.message);
                    }
                } else {
                    console.log('Inserting new record with time watched:', timeDifference);
                    const { error: insertError } = await supabase
                        .from('video_views')
                        .insert({
                            user_id: user.id,
                            video_id: fileName,
                            time_watched: roundedTime
                        });
        
                    if (insertError) {
                        console.error('Error inserting new time watched record:', insertError.message);
                    }
                }
            } catch (error) {
                console.error('Error logging time watched:', error);
            }
        };
        

        if (videoUrl && user && isMetadataLoaded) {
            console.log('Starting interval to log time watched every 10 seconds.');
            interval = setInterval(() => {
                if (videoRef.current) {
                    const currentTime = videoRef.current.currentTime;
                    console.log('Current video time:', currentTime);
                    logTimeWatched(currentTime);
                }
            }, 10000);
        }

        return () => {
            clearInterval(interval);
            const videoElement = videoRef.current;
            if (videoElement) {
                const finalTime = videoElement.currentTime;
                console.log('Cleaning up interval. Final video time:', finalTime);
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
