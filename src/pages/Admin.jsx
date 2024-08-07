import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import emailjs from 'emailjs-com';
import Header from '../Components/Header';
import Sidebar from "../Components/Sidebar";
import '../styles/Admin.scss';

const Admin = () => {
    const [pendingEntries, setPendingEntries] = useState([]);
    const [userVideoData, setUserVideoData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingEntries();
        fetchUserVideoData();
    }, []);

    const fetchPendingEntries = async () => {
        try {
            console.log('Fetching pending entries...');
            let { data, error } = await supabase
                .from('pending')
                .select('*');

            if (error) throw error;
            console.log('Pending entries:', data);
            setPendingEntries(data);
        } catch (error) {
            setError('Failed to fetch data from the database.');
            console.error('Error fetching pending entries:', error);
        }
    };

    const fetchUserVideoData = async () => {
        try {
            console.log('Fetching user data...');
            let { data: users, error: userError } = await supabase
                .from('users')
                .select('*');

            if (userError) throw userError;
            console.log('Users:', users);

            console.log('Fetching video views...');
            let { data: videoViews, error: videoError } = await supabase
                .from('video_views')
                .select('*');

            if (videoError) throw videoError;
            console.log('Video views:', videoViews);

            console.log('Fetching video data from /data/video.json...');
            const response = await fetch('/data/video.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const videos = await response.json();
            console.log('Videos:', videos);

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
                        videoDuration: duration,
                        finished
                    };
                });
                return {
                    ...user,
                    videosWatched
                };
            });

            console.log('Aggregated user video data:', aggregatedData);
            setUserVideoData(aggregatedData);
        } catch (error) {
            setError('Failed to fetch user video data from the database.');
            console.error('Error fetching user video data:', error);
        }
    };

    const handleRemove = async (id) => {
        try {
            console.log(`Removing entry with id: ${id}`);
            const { data, error } = await supabase
                .from('pending')
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log('Removed entry:', data);

            setPendingEntries(pendingEntries.filter(entry => entry.id !== id));
        } catch (error) {
            setError('Failed to remove the entry.');
            console.error('Error removing entry:', error);
        }
    };

    const generatePassword = () => {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    };

    const sendEmail = async (email, password) => {
        const serviceID = 'service_taletyk';
        const templateID = 'template_rly51l3';
        const userID = '1GJguuXpZRf1ZEyRk';
    
        const templateParams = {
            email: email,
            password: password,
            odkaz: 'https://www.scalpandhairacademy.com'
        };

        try {
            const response = await emailjs.send(serviceID, templateID, templateParams, userID);
            console.log('Email successfully sent!', response.status, response.text);
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    };
    

    const handleAccept = async (entry) => {
        try {
            const password = generatePassword();
            console.log('Generated password:', password);

            const { data, error } = await supabase
                .from('users')
                .insert([{
                    doctor_id: entry.doctor_id,
                    email: entry.email,
                    name: entry.name,
                    surname: entry.surname,
                    password: password
                }]);

            if (error) throw error;
            console.log('Inserted user:', data);

            await sendEmail(entry.email, password);
            await handleRemove(entry.id);
        } catch (error) {
            setError('Failed to accept the entry.');
            console.error('Error accepting entry:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await handleRemove(id);
        } catch (error) {
            setError('Failed to reject the entry.');
            console.error('Error rejecting entry:', error);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const showPendingUsers = () => {
        setSelectedUser(null);
        setShowAll(false);
    };

    const showRegisteredUsers = (user) => {
        setSelectedUser(user);
        setShowAll(false);
    };

    const showAllUsers = () => {
        setSelectedUser(null);
        setShowAll(true);
    };

    return (
        <div className="admin-dashboard">
            <Header />
            <Sidebar 
                users={userVideoData}
                onSelectUser={showRegisteredUsers}
                showAllUsers={showAllUsers}
                showPendingUsers={showPendingUsers}
            />
            <div className="admin-content">
                <div className="admin-main">
                    {error && <div className="error">{error}</div>}
                    {showAll ? (
                        <>
                            <h1>Všichni registrovaní uživatelé</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Identifikační číslo lékaře</th>
                                        <th>Uživatel</th>
                                        <th>E-mailová adresa</th>
                                        <th>Stav</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userVideoData.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.doctor_id}</td>
                                            <td>{`${user.name} ${user.surname}`}</td>
                                            <td>{user.email}</td>
                                            <td>{user.videosWatched.length > 0 ? 'Sledoval' : 'Nesledoval'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : !selectedUser ? (
                        <>
                            <h1>Tabulka uživatelů, čekajících na schválení</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Identifikační číslo lékaře</th>
                                        <th>Uživatel</th>
                                        <th>E-mailová adresa</th>
                                        <th>Čas vytvoření</th>
                                        <th>Akce</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingEntries.map(entry => (
                                        <tr key={entry.id}>
                                            <td>{entry.doctor_id}</td>
                                            <td>{`${entry.name} ${entry.surname}`}</td>
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
                        </>
                    ) : (
                        <>
                            <h1>Statistiky uživatelů</h1>
                            <div className="user-stats">
                                <h2>{`Lékař ID: ${selectedUser.doctor_id} (${selectedUser.email})`}</h2>
                                {selectedUser.videosWatched.length > 0 ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Název videa</th>
                                                <th>Čas sledování</th>
                                                <th>Stav</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedUser.videosWatched.map((video, index) => (
                                                <tr key={index}>
                                                    <td>{video.videoName}</td>
                                                    <td>{`${formatTime(video.timeWatched)} / ${formatTime(video.videoDuration)}`}</td>
                                                    <td>{video.finished ? 'Dokončeno' : 'Nedokončeno'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Uživatel zatím nesledoval žádné video.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;
