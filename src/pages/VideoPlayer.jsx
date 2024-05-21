import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/Header';
import { useAuth } from '../contexts/AuthContext';
import '../styles/VideoPlayer.scss';

const VideoPlayer = () => {
    const { fileName } = useParams();
    const { user, supabase } = useAuth();
    const [videoUrl, setVideoUrl] = useState('');
    const [timeWatched, setTimeWatched] = useState(0);

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
        let interval;
        let totalSecondsWatched = 0;

        const logTimeWatched = async (additionalTime) => {
            try {
                // Check if there's already a row for this user and video
                const { data: existingRecord, error } = await supabase
                    .from('video_views')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('video_id', fileName)
                    .single();

                if (error && error.code !== 'PGRST116') { // Ignore no rows found error
                    throw error;
                }

                if (existingRecord) {
                    // Update the existing record
                    const newTimeWatched = existingRecord.time_watched + additionalTime;
                    await supabase
                        .from('video_views')
                        .update({ time_watched: newTimeWatched })
                        .eq('user_id', user.id)
                        .eq('video_id', fileName);
                } else {
                    // Insert a new record
                    await supabase
                        .from('video_views')
                        .insert({ user_id: user.id, video_id: fileName, time_watched: additionalTime });
                }
            } catch (error) {
                console.error('Error logging time watched:', error);
            }
        };

        if (videoUrl && user) {
            interval = setInterval(() => {
                totalSecondsWatched += 10;
                setTimeWatched(totalSecondsWatched);
                logTimeWatched(10);
            }, 10000);
        }

        return () => {
            clearInterval(interval);
            if (user && totalSecondsWatched > 0) {
                logTimeWatched(totalSecondsWatched - timeWatched);
            }
        };
    }, [videoUrl, user, fileName, supabase]);

    return (
        <div className="video-player-container">
            <Header />
            {videoUrl ? (
                <video
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
