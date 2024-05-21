import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import '../styles/Admin.scss';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Admin = () => {
    const [pendingEntries, setPendingEntries] = useState([]);
    const [userVideoData, setUserVideoData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingEntries = async () => {
            try {
                let { data, error } = await supabase
                    .from('pending')
                    .select('*');

                if (error) throw error;
                setPendingEntries(data);
            } catch (error) {
                setError('Failed to fetch data from the database.');
                console.error('Error:', error);
            }
        };

        const fetchUserVideoData = async () => {
            try {
                let { data: users, error: userError } = await supabase
                    .from('users')
                    .select('*');

                if (userError) throw userError;

                let { data: videoViews, error: videoError } = await supabase
                    .from('video_views')
                    .select('*');

                if (videoError) throw videoError;

                const response = await fetch('/data/video.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const videos = await response.json();

                // Aggregate data
                const aggregatedData = users.map(user => {
                    const userViews = videoViews.filter(view => view.user_id === user.id);
                    const videosWatched = userViews.map(view => {
                        const video = videos.find(v => v.fileName === view.video_id);
                        const duration = video ? video.duration : 0;
                        const watchedPercentage = (view.time_watched / duration) * 100;
                        const finished = watchedPercentage >= 85;
                        return {
                            videoName: video ? video.customName : view.video_id,
                            timeWatched: view.time_watched,
                            finished
                        };
                    });
                    return {
                        ...user,
                        videosWatched
                    };
                });

                setUserVideoData(aggregatedData);
            } catch (error) {
                setError('Failed to fetch user video data from the database.');
                console.error('Error:', error);
            }
        };

        fetchPendingEntries();
        fetchUserVideoData();
    }, []);

    const handleRemove = async (id) => {
        try {
            // Delete the entry from the "pending" table
            const { data, error } = await supabase
                .from('pending')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update the state to remove the deleted entry
            setPendingEntries(pendingEntries.filter(entry => entry.id !== id));
        } catch (error) {
            setError('Failed to remove the entry.');
            console.error('Error:', error);
        }
    };

    const handleAccept = async (entry) => {
        try {
            console.log(`Accepting entry with ID: ${entry.id}`);

            // Insert the accepted entry into the "users" table
            const { data, error } = await supabase
                .from('users')
                .insert([{ doctor_id: entry.doctor_id, email: entry.email }]);

            if (error) throw error;

            // Remove the entry from the "pending" table
            await handleRemove(entry.id);
        } catch (error) {
            setError('Failed to accept the entry.');
            console.error('Error:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            console.log(`Rejecting entry with ID: ${id}`);
            await handleRemove(id);
        } catch (error) {
            setError('Failed to reject the entry.');
            console.error('Error:', error);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="admin-container">
            <h1>Tabulka uživatelů, čekajících na schválení</h1>
            {error && <div className="error">{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Identifikační číslo lékaře</th>
                        <th>E-mailová adresa</th>
                        <th>Čas vytvoření</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingEntries.map(entry => (
                        <tr key={entry.id}>
                            <td>{entry.doctor_id}</td>
                            <td>{entry.email}</td>
                            <td>{new Date(entry.created_at).toLocaleString()}</td>
                            <td>
                                <div className="admin-buttons">
                                    <button className="accept-button" onClick={() => handleAccept(entry)}>Přijmout</button>
                                    <button className="reject-button" onClick={() => handleReject(entry.id)}>Odmítnout</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h1>Statistiky uživatelů</h1>
            {userVideoData.map(user => (
                <div key={user.id} className="user-stats">
                    <h2>{`Lékař ID: ${user.doctor_id} (${user.email})`}</h2>
                    {user.videosWatched.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Název videa</th>
                                    <th>Čas sledování</th>
                                    <th>Stav</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.videosWatched.map((video, index) => (
                                    <tr key={index}>
                                        <td>{video.videoName}</td>
                                        <td>{formatTime(video.timeWatched)}</td>
                                        <td>{video.finished ? 'Dokončeno' : 'Nedokončeno'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Uživatel zatím nesledoval žádné video.</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Admin;
