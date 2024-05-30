import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../styles/LoginForm.scss';
import Divider from '@mui/material/Divider';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
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
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('doctor_id', username)
        .single();

      if (error || !user) {
        throw new Error('Invalid login credentials');
      }

      if (user.password !== password) {
        throw new Error('Invalid login credentials');
      }

      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
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
        <h5 style={{ color: "white" }}>*Po kliknutí na tlačitko registrace Vám bude po ověření identity na email posláno heslo pro přihlášení.</h5>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginForm;
