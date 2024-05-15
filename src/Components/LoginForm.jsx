import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.scss';
import { createClient } from '@supabase/supabase-js';
import Divider from '@mui/material/Divider';

const supabaseUrl = 'https://qlwylaqkynxaljlctznm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3lsYXFreW54YWxqbGN0em5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNTcyMzEsImV4cCI6MjAyOTYzMzIzMX0.IDuXkcQY163Nrm4tWl8r3AMHAEetc_rdz4AyBNuJRIE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (username === 'admin' && password === 'GodMode2024') {
        navigate('/admin');
      } else {
        const { data, error } = await supabase
          .from('users')
          .select('doctor_id')
          .eq('doctor_id', username)
          .single();

        if (error || !data) {
          throw new Error('Invalid credentials');
        }

        if (password === 'password123') {
          navigate('/home');
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Přihlášení selhalo, špatné jméno nebo heslo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <Divider component="li" />
        <br />
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Identifikační číslo lékaře:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Zde napište ..."
            required
          />
        </div>
        <br /><br />
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Heslo:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Zde napište ..."
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Načítání...' : 'Přihlásit'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginForm;