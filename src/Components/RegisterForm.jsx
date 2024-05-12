import React, { useState } from 'react';
import '../styles/LoginForm.scss';
import Divider from '@mui/material/Divider';

const RegisterForm = () => {  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="login-container">
      {submitted && (
        <div className="announcement">
          <h4>Prosím zkontrolujte svůj e-mail pro další instrukce.</h4>
        </div>
        )}
      <form className="login-form">
        <h2>Registrace</h2>
        <h6>Po kliknutí na tlačitko registrace Vám bude po ověření identity na email posláno heslo pro přihlášení.</h6>
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
            placeholder="Zde napište ..."
          />
        </div>
        <button type="submit" className="login-button">Registrovat</button>
      </form>
    </div>
  );
};

export default RegisterForm;
