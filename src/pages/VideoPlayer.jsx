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
        if (user) {
            console.log('User object:', user);
        } else {
            console.log('No user logged in');
        }
    }, [user]);

    useEffect(() => {
        fetch('/data/video.json')
            .then(response => response.json())
            .then(data => {
                const video = data.find(v => v.fileName === fileName);
                if (video && video.url) {
                    setVideoUrl(video.url);
                    console.log("Video URL set:", video.url);
                } else {
                    console.log("Video not found or no URL available");
                }
            })
            .catch(error => console.error('Error loading video data:', error));
    }, [fileName]);

    useEffect(() => {
        const fetchWatchHistory = async () => {
            if (!user) return;
    
            try {
                console.log(`Fetching watch history for user: ${user.id}, video: ${fileName}`);
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
                    console.log(`Found existing watch time: ${existingRecord.time_watched} seconds`);
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
                console.log(`Setting video currentTime to: ${initialTime} seconds`);
                videoRef.current.currentTime = initialTime;
            }
            setIsMetadataLoaded(true);
            console.log('Video metadata loaded');
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            console.log('Adding loadedmetadata event listener');
            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        return () => {
            if (videoElement) {
                console.log('Removing loadedmetadata event listener');
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
            lastLoggedTime.current = roundedTime; // Update last logged time
    
            try {
                console.log(`Logging time watched: ${timeDifference} seconds for user: ${user.id} and video: ${fileName}`);
                
                const { data: existingRecord, error: selectError } = await supabase
                    .from('video_views')
                    .select('time_watched')
                    .eq('user_id', user.id)
                    .eq('video_id', fileName)
                    .single();
    
                if (selectError && selectError.code !== 'PGRST116') { // Ignore no rows found error
                    console.error('Error selecting existing record:', selectError);
                    return;
                }
    
                if (existingRecord) {
                    console.log(`Existing record found, current time watched: ${existingRecord.time_watched}`);
                    const newTimeWatched = existingRecord.time_watched + timeDifference;
                    console.log(`Updating time watched to: ${newTimeWatched} seconds`);
                    const { error: updateError } = await supabase
                        .from('video_views')
                        .update({ time_watched: newTimeWatched })
                        .eq('user_id', user.id)
                        .eq('video_id', fileName);
    
                    if (updateError) {
                        console.error('Error updating time watched:', updateError.message);
                    } else {
                        console.log(`Time watched updated successfully: ${newTimeWatched} seconds`);
                    }
                } else {
                    console.log('No existing record found, inserting new record');
                    const { error: insertError } = await supabase
                        .from('video_views')
                        .insert({ user_id: user.id, video_id: fileName, time_watched: timeDifference });
    
                    if (insertError) {
                        console.error('Error inserting new record:', insertError.message);
                    } else {
                        console.log(`New watch record inserted: ${timeDifference} seconds`);
                    }
                }
            } catch (error) {
                console.error('Error logging time watched:', error);
            }
        };
    
        if (videoUrl && user && isMetadataLoaded) {
            console.log('Starting interval to log time watched');
            interval = setInterval(() => {
                if (videoRef.current) {
                    const currentTime = videoRef.current.currentTime;
                    console.log(`Current video time: ${currentTime} seconds`);
                    logTimeWatched(currentTime);
                }
            }, 10000);
        }
    
        return () => {
            clearInterval(interval);
            if (videoRef.current) {
                const finalTime = videoRef.current.currentTime;
                if (user && finalTime > 0) {
                    console.log(`Logging final time watched: ${finalTime} seconds`);
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
