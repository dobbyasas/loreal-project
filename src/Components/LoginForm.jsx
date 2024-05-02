import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import '../styles/LoginForm.scss';
import Divider from '@mui/material/Divider';

const LoginForm = () => {
  const navigate = useNavigate(); 
  const [credentials, setCredentials] = useState({
    doctorId: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(credentials);
    // Perform login logic here

    // testing
    navigate('/home');
  };
  
  const [focused, setFocused] = useState('');

  const handleFocus = (name) => {
    setFocused(name);
  };

  const handleBlur = () => {
    setFocused('');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Přihlášení</h2>
        <Divider component="li" />
        <br />
        <div className="form-group">
        <label htmlFor="doctorId" className="form-label">
            Identifikační číslo lékaře:
        </label>
          <input
            type="text"
            id="doctorId"
            name="doctorId"
            value={credentials.doctorId}
            onChange={handleChange}
            placeholder="Zde napište ..."
          />
        </div>
        <br /><br />
        <div className="form-group">
        <label htmlFor="email" className="form-label">
            E-mailová adresa:
        </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Zde napište ..."
          />
        </div>
        <button type="submit" className="login-button">Přihlásit</button>
      </form>
    </div>
  );
};

export default LoginForm;
