import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import '../styles/Admin.scss';

const supabaseUrl = 'https://qlwylaqkynxaljlctznm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3lsYXFreW54YWxqbGN0em5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNTcyMzEsImV4cCI6MjAyOTYzMzIzMX0.IDuXkcQY163Nrm4tWl8r3AMHAEetc_rdz4AyBNuJRIE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Admin = () => {
    const [pendingEntries, setPendingEntries] = useState([]);
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

        fetchPendingEntries();
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
        </div>
    );
}

export default Admin;
